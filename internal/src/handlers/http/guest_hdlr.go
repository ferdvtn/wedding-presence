package http

import (
	"net/http"
	"strconv"
	"wedding_presence/internal/src/dto"
	"wedding_presence/internal/src/services"

	"github.com/labstack/echo/v4"
)

type IGuestHandler interface {
	GetGuests(ctx echo.Context) error
	GetGuestByID(ctx echo.Context) error
	GetGuestByName(ctx echo.Context) error
	CreateGuest(ctx echo.Context) error
	UpdateGuest(ctx echo.Context) error
	DeleteGuest(ctx echo.Context) error
}

type guestHandler struct {
	guestSrv services.IGuestService
}

func NewGuestHandler(guestSrv services.IGuestService) IGuestHandler {
	return &guestHandler{
		guestSrv: guestSrv,
	}
}

func (g *guestHandler) GetGuests(ctx echo.Context) error {
	guests, err := g.guestSrv.GetGuests()
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	var guestsResponse []dto.GuestDTOResponse
	for _, g := range guests {
		guestsResponse = append(guestsResponse, g.ToDTOResponse())
	}

	return ctx.JSON(http.StatusOK, guestsResponse)
}

func (g *guestHandler) GetGuestByID(ctx echo.Context) error {
	rawGuestID := ctx.Param("id")
	guestID, err := strconv.Atoi(rawGuestID)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	guest, err := g.guestSrv.GetGuestByGuestID(uint(guestID))
	if err != nil {
		return ctx.String(http.StatusNotFound, err.Error())
	}

	return ctx.JSON(http.StatusOK, guest.ToDTOResponse())
}

func (g *guestHandler) GetGuestByName(ctx echo.Context) error {
	name := ctx.Param("name")
	guests, err := g.guestSrv.GetGuestsByGuestName(name)
	if err != nil {
		return ctx.String(http.StatusNotFound, err.Error())
	}

	var guestsResponse []dto.GuestDTOResponse
	for _, g := range guests {
		guestsResponse = append(guestsResponse, g.ToDTOResponse())
	}

	return ctx.JSON(http.StatusOK, guestsResponse)
}

func (g *guestHandler) CreateGuest(ctx echo.Context) error {
	var guestReq dto.GuestDTORequest
	err := ctx.Bind(&guestReq)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	guest, err := g.guestSrv.CreateGuest(guestReq)
	if err != nil {
		return ctx.String(http.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(http.StatusCreated, guest.ToDTOResponse())
}

func (g *guestHandler) UpdateGuest(ctx echo.Context) error {
	rawGuestID := ctx.Param("id")
	guestID, err := strconv.Atoi(rawGuestID)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	var guestReq dto.GuestDTORequest
	err = ctx.Bind(&guestReq)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	guestReq.GuestID = uint(guestID)

	guest, err := g.guestSrv.UpdateGuest(guestReq)
	if err != nil {
		return ctx.String(http.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(http.StatusOK, guest.ToDTOResponse())
}

func (g *guestHandler) DeleteGuest(ctx echo.Context) error {
	rawGuestID := ctx.Param("id")
	guestID, err := strconv.Atoi(rawGuestID)
	if err != nil {
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	err = g.guestSrv.DeleteGuest(uint(guestID))
	if err != nil {
		return ctx.String(http.StatusNotFound, err.Error())
	}

	return ctx.JSON(http.StatusNoContent, "")
}
