package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Appointment struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	PatientID    primitive.ObjectID `json:"patient_id,omitempty" bson:"patient_id,omitempty"`
	DoctorID     primitive.ObjectID `json:"doctor_id,omitempty" bson:"doctor_id,omitempty"`
	HospitalID   primitive.ObjectID `json:"hospital_id,omitempty" bson:"hospital_id,omitempty"`
	DepartmentID primitive.ObjectID `json:"department_id,omitempty" bson:"department_id,omitempty"`
	Hospital     string             `json:"hospital,omitempty" bson:"hospital"`
	Department   string             `json:"department,omitempty" bson:"department,omitempty"`
	Doctor       string             `json:"doctor,omitempty" bson:"doctor,omitempty"`
	Date         time.Time          `json:"date,omitempty" bson:"date,omitempty"`
	Status       string             `json:"status,omitempty" bson:"status,omitempty"`
}
