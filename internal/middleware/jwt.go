package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

const SigningKey = "12345678"

func JwtTokenMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authorizationHeader := c.Request().Header.Get("Authorization")
		if !strings.Contains(authorizationHeader, "Bearer") {
			return c.String(http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
		}

		tokenString := authorizationHeader[len("Bearer "):]
		_, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(SigningKey), nil
		})
		if err != nil {
			return c.String(http.StatusUnauthorized, http.StatusText(http.StatusUnauthorized))
		}

		return next(c)
	}
}
