package services

import (
	"wedding_presence/internal/src/domain"
	"wedding_presence/internal/src/dto"
	"wedding_presence/internal/src/repositories"
)

type IUserService interface {
	GetUserByUserUsernamePassword(user dto.UserDTORequest) (domain.User, error)
	RegisterUser(user dto.UserDTORequest) (domain.User, error)
}

type userService struct {
	userRepo repositories.IUserRepository
}

func NewUserService(userRepo repositories.IUserRepository) IUserService {
	return &userService{
		userRepo: userRepo,
	}
}

func (g *userService) GetUserByUserUsernamePassword(user dto.UserDTORequest) (domain.User, error) {
	arg := domain.User{
		Username: user.Username,
		Password: user.Password,
	}

	return g.userRepo.GetByUsernamePassword(arg)
}

func (g *userService) RegisterUser(user dto.UserDTORequest) (domain.User, error) {
	arg := domain.User{
		Username: user.Username,
		Password: user.Password,
	}

	return g.userRepo.Create(arg)
}
