package entity

type Forgot struct {
	Email     string `json:"email"`
	Question1 string `json:"question1"`
	Answer1   string `json:"answer1"`
	Question2 string `json:"question2"`
	Answer2   string `json:"answer2"`
	IsDoctor  bool   `json:"is_doctor"`
}
