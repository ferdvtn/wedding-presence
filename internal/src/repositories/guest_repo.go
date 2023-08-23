package repositories

import (
	"wedding_presence/infrastructures/db"
	"wedding_presence/internal/src/domain"

	"gorm.io/gorm"
)

type IGuestRepository interface {
	GetAll() ([]domain.Guest, error)
	GetAllByName(name string) ([]domain.Guest, error)
	GetByID(id uint) (domain.Guest, error)
	Create(guest domain.Guest) (domain.Guest, error)
	Update(guest domain.Guest) (domain.Guest, error)
	Delete(guest domain.Guest) error
}

type guestRepository struct {
	DB *db.PgsqlDB
}

func NewGuestRepository(DB *db.PgsqlDB) IGuestRepository {
	return &guestRepository{
		DB: DB,
	}
}

func (g *guestRepository) GetAll() ([]domain.Guest, error) {
	var guests []domain.Guest
	res := g.DB.DB().Order("name ASC").Find(&guests)
	if res.Error != nil {
		return nil, res.Error
	}

	return guests, nil
}

func (g *guestRepository) GetAllByName(name string) ([]domain.Guest, error) {
	var guests []domain.Guest
	res := g.DB.DB().Where("name LIKE ?", "%"+name+"%").Order("name ASC").Find(&guests)
	if res.Error != nil {
		return nil, res.Error
	}

	if len(guests) == 0 {
		return nil, gorm.ErrRecordNotFound
	}

	return guests, nil
}

func (g *guestRepository) GetByID(id uint) (domain.Guest, error) {
	var guest domain.Guest
	res := g.DB.DB().First(&guest, id)
	if res.Error != nil {
		return domain.Guest{}, res.Error
	}

	return guest, nil
}

func (g *guestRepository) Create(guest domain.Guest) (domain.Guest, error) {
	res := g.DB.DB().Save(&guest)
	if res.Error != nil {
		return domain.Guest{}, res.Error
	}

	return guest, nil
}

func (g *guestRepository) Update(guest domain.Guest) (domain.Guest, error) {
	res := g.DB.DB().Updates(&guest)
	if res.Error != nil {
		return domain.Guest{}, res.Error
	}

	return guest, nil
}

func (g *guestRepository) Delete(guest domain.Guest) error {
	res := g.DB.DB().Delete(&guest)

	return res.Error
}
