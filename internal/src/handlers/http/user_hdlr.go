package http

import (
	"net/http"
	"time"
	"wedding_presence/internal/middleware"
	"wedding_presence/internal/src/dto"
	"wedding_presence/internal/src/services"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

type IUserHandler interface {
	RegisterUser(ctx echo.Context) error
	LoginUser(ctx echo.Context) error
}

type userHandler struct {
	userSrv services.IUserService
}

func NewUserHandler(userSrv services.IUserService) IUserHandler {
	return &userHandler{
		userSrv: userSrv,
	}
}

func (u *userHandler) RegisterUser(ctx echo.Context) error {
	var userReq dto.UserDTORequest
	err := ctx.Bind(&userReq)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	user, err := u.userSrv.RegisterUser(userReq)
	if err != nil {
		return ctx.String(http.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(http.StatusCreated, user.ToDTOResponse())
}

func (u *userHandler) LoginUser(ctx echo.Context) error {
	var userReq dto.UserDTORequest
	err := ctx.Bind(&userReq)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	user, err := u.userSrv.GetUserByUserUsernamePassword(userReq)
	if err != nil {
		return ctx.String(http.StatusNotFound, err.Error())
	}

	var tokenString string

	tokenCookie, err := ctx.Cookie("_token")
	if err != nil {
		// create auth token
		exp := time.Now().Add(30 * time.Minute).Local()
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			ExpiresAt: exp.Unix(),
		})
		tokenString, err = token.SignedString([]byte(middleware.SigningKey))
		if err != nil {
			return ctx.String(http.StatusInternalServerError, err.Error())
		}
	} else {
		tokenString = tokenCookie.Value
	}

	userRes := user.ToDTOResponse()
	userRes.Token = tokenString

	return ctx.JSON(http.StatusOK, userRes)
}
