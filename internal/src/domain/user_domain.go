package domain

import "wedding_presence/internal/src/dto"

type User struct {
	UserID   uint   `gorm:"column:user_id;primary_key"`
	Username string `gorm:"column:username;"`
	Password string `gorm:"column:password;"`
}

func (u *User) TableName() string {
	return "users"
}

func (u *User) ToDTOResponse() dto.UserDTOResponse {
	return dto.UserDTOResponse{
		UserID:   u.UserID,
		Username: u.Username,
	}
}
