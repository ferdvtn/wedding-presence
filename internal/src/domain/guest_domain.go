package domain

import "wedding_presence/internal/src/dto"

type Guest struct {
	GuestID     uint   `gorm:"column:guest_id;primary_key"`
	Name        string `gorm:"column:name"`
	MoneyGift   uint   `gorm:"column:money_gift"`
	AddsGift    string `gorm:"column:adds_gift"`
	Address     string `gorm:"column:address"`
	PhoneNumber string `gorm:"column:phone_number"`
}

func (g *Guest) TableName() string {
	return "guests"
}

func (g *Guest) ToDTOResponse() dto.GuestDTOResponse {
	return dto.GuestDTOResponse{
		GuestID:     g.GuestID,
		Name:        g.Name,
		MoneyGift:   g.MoneyGift,
		AddsGift:    g.AddsGift,
		Address:     g.Address,
		PhoneNumber: g.PhoneNumber,
	}
}
