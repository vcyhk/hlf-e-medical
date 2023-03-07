package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type MailBox struct {
	ID               primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	PatientID        primitive.ObjectID `json:"patient_id,omitempty" bson:"patient_id,omitempty"`
	DoctorID         primitive.ObjectID `json:"doctor_id,omitempty" bson:"doctor_id,omitempty"`
	PatientName      string             `json:"patient_name,omitempty" bson:"patient_name,omitempty"`
	Patient          Patient            `json:"patient,omitempty" bson:"patient,omitempty"`
	MedicalHistories []MedicalHistory   `json:"medical_histories,omitempty" bson:"medical_histories,omitempty"`
}
