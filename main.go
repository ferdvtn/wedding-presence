package main

import (
	"wedding_presence/infrastructures/db"
	internalmiddleware "wedding_presence/internal/middleware"
	"wedding_presence/internal/src/handlers/http"
	"wedding_presence/internal/src/repositories"
	"wedding_presence/internal/src/services"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db := db.NewPgsqlDB()

	// guests
	guestRepo := repositories.NewGuestRepository(db)
	guestSrv := services.NewGuestService(guestRepo)
	guestHdlr := http.NewGuestHandler(guestSrv)

	// users
	userRepo := repositories.NewUserRepository(db)
	userSrv := services.NewUserService(userRepo)
	userHdlr := http.NewUserHandler(userSrv)

	e := echo.New()
	e.Use(middleware.CORS())

	v1 := e.Group("api/v1")

	v1auth := e.Group("api/v1")
	v1auth.Use(internalmiddleware.JwtTokenMiddleware)

	// users
	v1.POST("/users/register", userHdlr.RegisterUser)
	v1.POST("/users/login", userHdlr.LoginUser)

	// guests
	v1auth.GET("/guests", guestHdlr.GetGuests)
	v1auth.GET("/guests/:id", guestHdlr.GetGuestByID)
	v1auth.GET("/guests/name/:name", guestHdlr.GetGuestByName)
	v1auth.POST("/guests", guestHdlr.CreateGuest)
	v1auth.PUT("/guests/:id", guestHdlr.UpdateGuest)
	v1auth.DELETE("/guests/:id", guestHdlr.DeleteGuest)

	e.Logger.Fatal(e.Start(":1323"))
}
