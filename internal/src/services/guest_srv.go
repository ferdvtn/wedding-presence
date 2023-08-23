package services

import (
	"wedding_presence/internal/src/domain"
	"wedding_presence/internal/src/dto"
	"wedding_presence/internal/src/repositories"
)

type IGuestService interface {
	GetGuests() ([]domain.Guest, error)
	GetGuestsByGuestName(guestName string) ([]domain.Guest, error)
	GetGuestByGuestID(guestID uint) (domain.Guest, error)
	CreateGuest(guest dto.GuestDTORequest) (domain.Guest, error)
	UpdateGuest(guest dto.GuestDTORequest) (domain.Guest, error)
	DeleteGuest(guestID uint) error
}

type guestService struct {
	guestRepo repositories.IGuestRepository
}

func NewGuestService(guestRepo repositories.IGuestRepository) IGuestService {
	return &guestService{
		guestRepo: guestRepo,
	}
}

func (g *guestService) GetGuests() ([]domain.Guest, error) {
	return g.guestRepo.GetAll()
}

func (g *guestService) GetGuestsByGuestName(guestName string) ([]domain.Guest, error) {
	return g.guestRepo.GetAllByName(guestName)
}

func (g *guestService) GetGuestByGuestID(guestID uint) (domain.Guest, error) {
	return g.guestRepo.GetByID(guestID)
}

func (g *guestService) CreateGuest(guest dto.GuestDTORequest) (domain.Guest, error) {
	arg := domain.Guest{
		Name:        guest.Name,
		MoneyGift:   guest.MoneyGift,
		AddsGift:    guest.AddsGift,
		Address:     guest.Address,
		PhoneNumber: guest.PhoneNumber,
	}

	return g.guestRepo.Create(arg)
}

func (g *guestService) UpdateGuest(guest dto.GuestDTORequest) (domain.Guest, error) {
	arg := domain.Guest{
		GuestID:     guest.GuestID,
		Name:        guest.Name,
		MoneyGift:   guest.MoneyGift,
		AddsGift:    guest.AddsGift,
		Address:     guest.Address,
		PhoneNumber: guest.PhoneNumber,
	}

	return g.guestRepo.Update(arg)
}

func (g *guestService) DeleteGuest(guestID uint) error {
	guest, err := g.guestRepo.GetByID(guestID)
	if err != nil {
		return err
	}

	return g.guestRepo.Delete(guest)
}
