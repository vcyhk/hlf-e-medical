package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

// Doctor is a entity of domain, it represents a mongodb document.
type Doctor struct {
	ID                 primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name               string             `json:"name,omitempty" bson:"name,omitempty"`
	Email              string             `json:"email,omitempty" bson:"email,omitempty"`
	Password           string             `json:"password,omitempty" bson:"password,omitempty"`
	RegistrationNumber string             `json:"registration_number,omitempty" bson:"registration_number,omitempty"`
	Hospital           string             `json:"hospital,omitempty" bson:"-"`
	Department         string             `json:"department,omitempty" bson:"-"`
	HospitalID         primitive.ObjectID `json:"-" bson:"hospital_id,omitempty"`
	DepartmentID       primitive.ObjectID `json:"-" bson:"department_id,omitempty"`
	Question1          string             `json:"question1,omitempty" bson:"question1,omitempty"`
	Answer1            string             `json:"answer1,omitempty" bson:"answer1,omitempty"`
	Question2          string             `json:"question2,omitempty" bson:"question2,omitempty"`
	Answer2            string             `json:"answer2,omitempty" bson:"answer2,omitempty"`
	IsDoctor           bool               `json:"is_doctor,omitempty" bson:"is_doctor,omitempty"`
}
