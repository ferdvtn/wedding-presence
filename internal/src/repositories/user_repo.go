package repositories

import (
	"wedding_presence/infrastructures/db"
	"wedding_presence/internal/src/domain"
)

type IUserRepository interface {
	GetByUsernamePassword(user domain.User) (domain.User, error)
	Create(user domain.User) (domain.User, error)
}

type userRepository struct {
	DB *db.PgsqlDB
}

func NewUserRepository(DB *db.PgsqlDB) IUserRepository {
	return &userRepository{
		DB: DB,
	}
}

func (u *userRepository) GetByUsernamePassword(data domain.User) (domain.User, error) {
	var user domain.User
	res := u.DB.DB().Where("username = ? AND password = ?", data.Username, data.Password).First(&user)
	if res.Error != nil {
		return domain.User{}, res.Error
	}

	return user, nil
}

func (u *userRepository) Create(user domain.User) (domain.User, error) {
	res := u.DB.DB().Save(&user)
	if res.Error != nil {
		return domain.User{}, res.Error
	}

	return user, nil
}
