package dto

type UserDTORequest struct {
	UserID   uint
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserDTOResponse struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Token    string `json:"token"`
}
