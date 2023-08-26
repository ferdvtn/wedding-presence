package db

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	host     = os.Getenv("DB_HOST")
	port     = os.Getenv("DB_PORT")
	user     = os.Getenv("DB_USER")
	password = os.Getenv("DB_PASSWORD")
	dbname   = os.Getenv("DB_NAME")
)

type PgsqlDB struct {
	db *gorm.DB
}

func NewPgsqlDB() *PgsqlDB {

	portInt, err := strconv.Atoi(port)
	if err != nil {
		log.Fatalln(err)
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, portInt, user, password, dbname)
	db, err := gorm.Open(
		postgres.New(postgres.Config{
			DSN:                  dsn,
			PreferSimpleProtocol: true,
		}),
		&gorm.Config{},
	)
	if err != nil {
		log.Fatalln(err)
	}

	return &PgsqlDB{
		db: db,
	}
}

func (p *PgsqlDB) DB() *gorm.DB {
	return p.db
}
