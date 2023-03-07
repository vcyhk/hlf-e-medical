package storage

import (
	"context"
	"e-madical/pkg/domain/entity"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Storage struct {
	db *mongo.Database
}

func NewStorage(db *mongo.Database) *Storage {
	return &Storage{
		db: db,
	}
}

// implement all e-medical/domain repository interface

// create patient
func (s *Storage) CreatePatient(patient *entity.Patient) (*entity.Patient, error) {
	// patient collection
	collection := s.db.Collection("users")

	// patient is not doctor
	patient.IsDoctor = false

	// check user already exists
	// get user by email
	_, err := s.GetPatientByEmail(patient.Email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	// insert patient
	_, err = collection.InsertOne(context.Background(), patient)
	if err != nil {
		return nil, err
	}

	return patient, nil
}

// get patient by id
func (s *Storage) GetPatientByID(id string) (*entity.Patient, error) {
	// patient collection
	collection := s.db.Collection("users")

	// get patient by id
	patient := &entity.Patient{}

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// find patient by id
	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(patient)
	if err != nil {
		return nil, err
	}

	return patient, nil
}

// get patient by email
func (s *Storage) GetPatientByEmail(email string) (*entity.Patient, error) {
	// patient collection
	collection := s.db.Collection("users")

	// get patient by email
	patient := &entity.Patient{}

	// find patient by email
	err := collection.FindOne(context.Background(), primitive.M{"email": email}).Decode(patient)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("patient not found")
		}
		return nil, err
	}

	return patient, nil
}

// update patient
func (s *Storage) UpdatePatient(patient *entity.Patient) error {
	// patient collection
	collection := s.db.Collection("users")

	// update patient
	result, err := collection.UpdateOne(context.Background(),
		primitive.M{"_id": patient.ID},
		primitive.M{"$set": primitive.M{
			"email":    patient.Email,
			"name":     patient.Name,
			"birthday": patient.Birthday,
			"hkid":     patient.HKID,
			"medid":	patient.MEDID,
			"phone":    patient.Phone,
			"address":  patient.Address,
		}},
	)
	if err != nil {
		return err
	}

	// check if patient is found
	if result.MatchedCount == 0 {
		return errors.New("patient not found")
	}

	return nil
}

// delete patient
func (s *Storage) DeletePatient(id string) error {
	// patient collection
	collection := s.db.Collection("users")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	// delete patient
	result, err := collection.DeleteOne(context.Background(), primitive.M{"_id": oid})
	if err != nil {
		return err
	}

	// check if patient is found
	if result.DeletedCount == 0 {
		return errors.New("patient not found")
	}

	return nil
}

// get patient appointments
func (s *Storage) GetPatientAppointments(id string) ([]*entity.Appointment, error) {
	// appointment collection
	collection := s.db.Collection("appointment")

	// get patient appointments
	cursor, err := collection.Find(context.Background(), primitive.M{"patient_id": id})
	if err != nil {
		return nil, err
	}

	// get all appointments
	appointments := []*entity.Appointment{}
	err = cursor.All(context.Background(), &appointments)
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

// create doctor
func (s *Storage) CreateDoctor(doctor *entity.Doctor) (*entity.Doctor, error) {
	// doctor collection
	collection := s.db.Collection("users")

	doctor.IsDoctor = true

	// check user already exists
	// get user by email
	_, err := s.GetDoctorByEmail(doctor.Email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	// insert doctor
	result1, err := collection.InsertOne(context.Background(), doctor)
	if err != nil {
		return nil, err
	}

	// department collection
	collection = s.db.Collection("departments")

	// find department by name
	var department entity.Department
	err = collection.FindOne(context.Background(), primitive.M{"name": doctor.Department}).Decode(&department)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			// create department
			insertdepartresult, err := collection.InsertOne(context.Background(), entity.Department{
				Name: doctor.Department,
				// Doctors: []primitive.ObjectID{
				// 	result1.InsertedID.(primitive.ObjectID),
				// },
			})
			if err != nil {
				return nil, err
			}

			department.ID = insertdepartresult.InsertedID.(primitive.ObjectID)
		} else {

			return nil, err
		}
	}

	// // update department doctors
	// _, err = collection.UpdateOne(context.Background(), primitive.M{"_id": department.ID}, primitive.M{"$addToSet": primitive.M{"doctors": result1.InsertedID.(primitive.ObjectID)}})
	// if err != nil {
	// 	return nil, err
	// }

	// hospital collection
	collection = s.db.Collection("hospitals")

	// find hospital by name
	var hospital entity.Hospital
	err = collection.FindOne(context.Background(), primitive.M{"name": doctor.Hospital}).Decode(&hospital)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			// create hospital
			inserthospitalresult, err := collection.InsertOne(context.Background(), entity.Hospital{
				Name: doctor.Hospital,
				Departments: []primitive.ObjectID{
					department.ID,
				},
			})
			if err != nil {
				return nil, err
			}

			hospital.ID = inserthospitalresult.InsertedID.(primitive.ObjectID)
		} else {
			return nil, err
		}
	}

	// update hospital departments
	_, err = collection.UpdateOne(context.Background(), primitive.M{"_id": hospital.ID}, primitive.M{"$addToSet": primitive.M{"departments": department.ID}})
	if err != nil {
		return nil, err
	}

	// doctor collection
	collection = s.db.Collection("users")

	// update doctor
	_, err = collection.UpdateOne(context.Background(), primitive.M{"_id": result1.InsertedID.(primitive.ObjectID)},
		primitive.M{
			"$set": primitive.M{
				"department_id": department.ID,
				"hospital_id":   hospital.ID,
			},
		},
	)
	if err != nil {
		return nil, err
	}

	return doctor, nil
}

// get hospitals
func (s *Storage) GetHospitals() ([]entity.Hospital, error) {
	// hospital collection
	collection := s.db.Collection("hospitals")

	// get all hospitals
	cursor, err := collection.Find(context.Background(), primitive.M{})
	if err != nil {
		return nil, err
	}

	// get all hospitals
	hospitals := []entity.Hospital{}
	err = cursor.All(context.Background(), &hospitals)
	if err != nil {
		return nil, err
	}

	return hospitals, nil
}

// update password
func (s *Storage) UpdatePassword(id string, password string) error {
	// users collection
	collection := s.db.Collection("users")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	// update password
	_, err = collection.UpdateOne(context.Background(),
		primitive.M{"_id": oid},
		primitive.M{"$set": primitive.M{"password": password}},
	)
	if err != nil {
		return err
	}

	return nil
}

// get hospital by id
func (s *Storage) GetHospitalByID(id string) (*entity.Hospital, error) {
	// hospital collection
	collection := s.db.Collection("hospitals")

	// get hospital by id
	hospital := &entity.Hospital{}

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// find hospital by id
	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(hospital)
	if err != nil {
		// check err docuemnt not found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("hospital not found")
		}
		return nil, err
	}

	// check if hospital is found
	if hospital.ID.IsZero() {
		return nil, errors.New("hospital not found")
	}

	return hospital, nil
}

// get department by id
func (s *Storage) GetDepartmentByID(id string) (*entity.Department, error) {
	// department collection
	collection := s.db.Collection("departments")

	// get department by id
	department := &entity.Department{}

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// find department by id
	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(department)
	if err != nil {
		// check err document not found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("department not found")
		}
		return nil, err
	}

	// check if department is found
	if department.ID.IsZero() {
		return nil, errors.New("department not found")
	}

	return department, nil
}

// get hospital departments by hospital id
func (s *Storage) GetHospitalDepartments(id string) ([]entity.Department, error) {
	// one to many relationship
	// one hospital has many departments

	// hospital collection
	collection := s.db.Collection("hospitals")

	// get hospital by id
	hospital := entity.Hospital{}

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, err
	}

	// find hospital by id
	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(&hospital)
	if err != nil {
		return nil, err
	}

	// check number of departments
	if len(hospital.Departments) == 0 {
		return nil, errors.New("no departments found")
	}

	// department collection
	collection = s.db.Collection("departments")

	// get departments by hospital id
	// { quantity: { $in: [ 5, 15 ] } }
	cursor, err := collection.Find(context.Background(), primitive.M{"_id": primitive.M{"$in": hospital.Departments}})
	if err != nil {
		return nil, err
	}

	// get all departments
	departments := []entity.Department{}

	err = cursor.All(context.Background(), &departments)
	if err != nil {
		return nil, err
	}

	return departments, nil
}

// get hospitaldepartment doctors by department id
func (s *Storage) GetHospitalDepartmentDoctors(hospital_id, department_id string) ([]entity.Doctor, error) {

	// change objectid
	hoid, err := primitive.ObjectIDFromHex(hospital_id)
	if err != nil {
		return nil, err
	}
	doid, err := primitive.ObjectIDFromHex(department_id)
	if err != nil {
		return nil, err
	}

	// find doctors by hospital id and department id
	collection := s.db.Collection("users")

	doctors := make([]entity.Doctor, 0)
	cur, err := collection.Find(context.Background(), primitive.M{"hospital_id": hoid, "department_id": doid})
	if err != nil {
		return nil, err
	}

	for cur.Next(context.Background()) {
		var doc entity.Doctor
		err := cur.Decode(&doc)
		if err != nil {
			return nil, err
		}
		doctors = append(doctors, doc)
	}

	return doctors, nil

}

// get doctor by id
func (s *Storage) GetDoctorByID(id string) (*entity.Doctor, error) {
	// doctor collection
	collection := s.db.Collection("users")

	var doctor entity.Doctor

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// find doctor by id
	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(&doctor)
	if err != nil {
		// err document not found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("doctor not found")
		}
		return nil, err
	}

	return &doctor, nil
}

// get doctor by email
func (s *Storage) GetDoctorByEmail(email string) (*entity.Doctor, error) {
	// doctor collection
	collection := s.db.Collection("users")

	// get doctor by email
	doctor := &entity.Doctor{}

	// find doctor by email
	err := collection.FindOne(context.Background(), primitive.M{"email": email}).Decode(doctor)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("doctor not found")
		}
		return nil, err
	}

	return doctor, nil
}

// update doctor
func (s *Storage) UpdateDoctor(doctor *entity.Doctor) error {
	// department collection
	collection := s.db.Collection("departments")

	// find department by name
	var department entity.Department
	err := collection.FindOne(context.Background(), primitive.M{"name": doctor.Department}).Decode(&department)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			// create department
			insertdepartresult, err := collection.InsertOne(context.Background(), entity.Department{
				Name: doctor.Department,
			})
			if err != nil {
				return err
			}

			department.ID = insertdepartresult.InsertedID.(primitive.ObjectID)
		} else {

			return err
		}
	}

	// hospital collection
	collection = s.db.Collection("hospitals")

	// find hospital by name
	var hospital entity.Hospital
	err = collection.FindOne(context.Background(), primitive.M{"name": doctor.Hospital}).Decode(&hospital)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			// create hospital
			inserthospitalresult, err := collection.InsertOne(context.Background(), entity.Hospital{
				Name: doctor.Hospital,
				Departments: []primitive.ObjectID{
					department.ID,
				},
			})
			if err != nil {
				return err
			}

			hospital.ID = inserthospitalresult.InsertedID.(primitive.ObjectID)
		} else {
			return err
		}
	}

	// update hospital departments
	_, err = collection.UpdateOne(context.Background(), primitive.M{"_id": hospital.ID}, primitive.M{"$addToSet": primitive.M{"departments": department.ID}})
	if err != nil {
		return err
	}

	// doctor collection
	collection = s.db.Collection("users")

	// update doctor
	result, err := collection.UpdateOne(context.Background(),
		primitive.M{"_id": doctor.ID},
		primitive.M{
			"$set": primitive.M{
				"name":                doctor.Name,
				"email":               doctor.Email,
				"registration_number": doctor.RegistrationNumber,	
				"hospital_id":         hospital.ID,
				"department_id":       department.ID,
			},
		},
	)
	if err != nil {
		return err
	}

	// check if doctor is found
	if result.MatchedCount == 0 {
		return errors.New("doctor not found")
	}

	return nil
}

// delete doctor
func (s *Storage) DeleteDoctor(id string) error {
	// doctor collection
	collection := s.db.Collection("users")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	// delete doctor
	result, err := collection.DeleteOne(context.Background(), primitive.M{"_id": oid})
	if err != nil {
		return err
	}

	// check if doctor is found
	if result.DeletedCount == 0 {
		return errors.New("doctor not found")
	}

	return nil
}

// get login user by email
func (s *Storage) GetLoginUserByEmail(email string) (*entity.LoginUser, error) {
	// user collection
	collection := s.db.Collection("users")

	// get user by email
	user := &entity.LoginUser{}

	// find user by email
	err := collection.FindOne(context.Background(), primitive.M{"email": email}).Decode(user)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return user, nil
}

// create appointment
func (s *Storage) CreateAppointment(appointment *entity.Appointment) error {
	// appointment collection
	collection := s.db.Collection("appointments")

	// get doctor by id
	doctor, err := s.GetDoctorByID(appointment.DoctorID.Hex())
	if err != nil {
		return err
	}

	// get hospital by id
	hospital, err := s.GetHospitalByID(appointment.HospitalID.Hex())
	if err != nil {
		return err
	}

	// get department by id
	department, err := s.GetDepartmentByID(appointment.DepartmentID.Hex())
	if err != nil {
		return err
	}

	appointment.Doctor = doctor.Name
	appointment.Hospital = hospital.Name
	appointment.Department = department.Name

	// insert appointment
	_, err = collection.InsertOne(context.Background(), appointment)
	if err != nil {
		return err
	}

	return nil
}

// get appointment by patient id
func (s *Storage) GetAppointments(patient_id string) ([]entity.Appointment, error) {
	// appointment collection
	collection := s.db.Collection("appointments")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(patient_id)
	if err != nil {
		return nil, err
	}

	// find appointment by patient id
	cursor, err := collection.Find(context.Background(), primitive.M{"patient_id": oid})
	if err != nil {
		return nil, err
	}

	// get all appointments
	appointments := []entity.Appointment{}

	err = cursor.All(context.Background(), &appointments)
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

// create mail box
func (s *Storage) CreateMailBox(mailbox *entity.MailBox) error {
	// mail box collection
	collection := s.db.Collection("mailboxes")

	// get mail box have same patient id and doctor id
	mailbox_exist := &entity.MailBox{}

	// find mail box have same patient id and doctor id
	err := collection.FindOne(context.Background(), primitive.M{"patient_id": mailbox.PatientID, "doctor_id": mailbox.DoctorID}).Decode(mailbox_exist)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			// insert mail box
			_, err := collection.InsertOne(context.Background(), mailbox)
			if err != nil {
				return err
			}
		} else {
			return err
		}
	}

	return nil
}

// GetMailBoxesByDoctorID
func (s *Storage) GetMailBoxesByDoctorID(doctor_id string) ([]entity.MailBox, error) {
	// mail box collection
	collection := s.db.Collection("mailboxes")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(doctor_id)
	if err != nil {
		return nil, err
	}

	// find mail box by doctor id
	cursor, err := collection.Find(context.Background(), primitive.M{"doctor_id": oid})
	if err != nil {
		return nil, err
	}

	// get all mail boxes
	mailboxes := []entity.MailBox{}

	err = cursor.All(context.Background(), &mailboxes)
	if err != nil {
		return nil, err
	}

	return mailboxes, nil
}

// GetAppointmentByID
func (s *Storage) GetAppointmentByID(id string) (*entity.Appointment, error) {
	// appointment collection
	collection := s.db.Collection("appointments")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// find appointment by id
	appointment := &entity.Appointment{}

	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(appointment)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("appointment not found")
		}
		return nil, err
	}

	return appointment, nil
}

// get rewards by user id
func (s *Storage) GetRewards(user_id string) ([]entity.Reward, error) {
	// reward collection
	collection := s.db.Collection("rewards")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(user_id)
	if err != nil {
		return nil, err
	}

	// find reward by user id
	cursor, err := collection.Find(context.Background(), primitive.M{"user_id": oid})
	if err != nil {
		return nil, err
	}

	// get all rewards
	rewards := []entity.Reward{}

	err = cursor.All(context.Background(), &rewards)
	if err != nil {
		return nil, err
	}

	return rewards, nil
}

// get mail box by id
func (s *Storage) GetMailBoxByID(id string) (*entity.MailBox, error) {
	// mail box collection
	collection := s.db.Collection("mailboxes")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	// find mail box by id
	mailbox := &entity.MailBox{}

	err = collection.FindOne(context.Background(), primitive.M{"_id": oid}).Decode(mailbox)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("mail box not found")
		}
		return nil, err
	}

	// get patient by id
	patient, err := s.GetPatientByID(mailbox.PatientID.Hex())
	if err != nil {
		return nil, err
	}

	patient.Password = ""
	patient.Question1 = ""
	patient.Question2 = ""
	patient.Answer1 = ""
	patient.Answer2 = ""

	mailbox.Patient = *patient

	// get medicalhistories by patient id
	medicalhistories, err := s.GetMedicalHistoriesByPatientID(mailbox.PatientID.Hex())
	if err != nil {
		return nil, err
	}

	mailbox.MedicalHistories = medicalhistories

	return mailbox, nil
}

//CreateMedicalHistory(medical_history *entity.MedicalHistory) error
func (s *Storage) CreateMedicalHistory(medical_history *entity.MedicalHistory) error {
	// medical history collection
	collection := s.db.Collection("medical_histories")

	// insert medical history
	_, err := collection.InsertOne(context.Background(), medical_history)
	if err != nil {
		return err
	}

	return nil
}

// get medical histories by patient id
func (s *Storage) GetMedicalHistoriesByPatientID(patient_id string) ([]entity.MedicalHistory, error) {
	// medical history collection
	collection := s.db.Collection("medical_histories")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(patient_id)
	if err != nil {
		return nil, err
	}

	// find medical history by patient id
	cursor, err := collection.Find(context.Background(), primitive.M{"patient_id": oid})
	if err != nil {
		return nil, err
	}

	// get all medical histories
	medical_histories := []entity.MedicalHistory{}

	err = cursor.All(context.Background(), &medical_histories)
	if err != nil {
		return nil, err
	}

	return medical_histories, nil
}

// create reward
func (s *Storage) CreateReward(reward *entity.Reward) error {
	// reward collection
	collection := s.db.Collection("rewards")

	// insert reward
	_, err := collection.InsertOne(context.Background(), reward)
	if err != nil {
		return err
	}

	return nil
}

// get last added reward
func (s *Storage) GetLastAddedReward(user_id string) (*entity.Reward, error) {
	// reward collection
	collection := s.db.Collection("rewards")

	// convert id to object id
	oid, err := primitive.ObjectIDFromHex(user_id)
	if err != nil {
		return nil, err
	}

	// find reward by user id
	reward := &entity.Reward{}

	err = collection.FindOne(context.Background(), primitive.M{"user_id": oid}).Decode(reward)
	if err != nil {
		// if err no document found
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("reward not found")
		}
		return nil, err
	}

	return reward, nil
}
