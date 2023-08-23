package dto

type GuestDTORequest struct {
	GuestID     uint
	Name        string `json:"name"`
	MoneyGift   uint   `json:"money_gift"`
	AddsGift    string `json:"adds_gift"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
}

type GuestDTOResponse struct {
	GuestID     uint   `json:"id"`
	Name        string `json:"name"`
	MoneyGift   uint   `json:"money_gift"`
	AddsGift    string `json:"adds_gift"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
}
