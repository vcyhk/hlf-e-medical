package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Patient is a entity of domain, it represents a mongodb document.
type Patient struct {
	ID				primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name			string             `json:"name,omitempty" bson:"name,omitempty"`
	Email			string             `json:"email,omitempty" bson:"email,omitempty"`
	Password		string             `json:"password,omitempty" bson:"password,omitempty"`
	Birthday		time.Time          `json:"birthday,omitempty" bson:"birthday,omitempty"`
	Phone			string             `json:"phone,omitempty" bson:"phone,omitempty"`
	Address			string             `json:"address,omitempty" bson:"address,omitempty"`
	HKID			string             `json:"hkid,omitempty" bson:"hkid,omitempty"`
	MEDID			string             `json:"medid,omitempty" bson:"medid,omitempty"`
	Question1		string             `json:"question1,omitempty" bson:"question1,omitempty"`
	Answer1			string             `json:"answer1,omitempty" bson:"answer1,omitempty"`
	Question2		string             `json:"question2,omitempty" bson:"question2,omitempty"`
	Answer2			string             `json:"answer2,omitempty" bson:"answer2,omitempty"`
	IsDoctor		bool               `json:"is_doctor" bson:"is_doctor"`
}

// Mediacal history
type MedicalHistory struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	PatientID  primitive.ObjectID `json:"patient_id,omitempty" bson:"patient_id,omitempty"`
	DoctorID   primitive.ObjectID `json:"doctor_id,omitempty" bson:"doctor_id,omitempty"`
	Date       time.Time          `json:"date,omitempty" bson:"date,omitempty"`
	DoctorName string             `json:"doctor_name,omitempty" bson:"doctor_name,omitempty"`
	Note       string             `json:"note,omitempty" bson:"note,omitempty"`
}
