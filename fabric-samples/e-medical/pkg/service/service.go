package service

import (
	"e-madical/pkg/domain"
	"e-madical/pkg/domain/entity"
	"errors"
	"time"
)

type Service interface {
	RegisterDoctor(doctor *entity.Doctor) (*entity.Doctor, error)
	RegisterPatient(patient *entity.Patient) (*entity.Patient, error)
	Login(email string, password string) (*entity.LoginUser, error)
	ForgotPassword(forgot *entity.Forgot) (*entity.LoginUser, error)
	ResetPassword(id string, new_password string) error

	GetDoctorProfile(id string) (*entity.Doctor, error)
	GetPatientProfile(id string) (*entity.Patient, error)

	UpdateDoctor(doctor *entity.Doctor) error
	UpdatePatient(patient *entity.Patient) error

	CreateAppointment(appointment *entity.Appointment) error
	GetAppointments(user_id string) ([]entity.Appointment, error)
	GetAppointment(id string) (*entity.Appointment, error)
	GetHospitals() ([]entity.Hospital, error)
	GetHospitalDepartments(hospitalID string) ([]entity.Department, error)
	GetHospitalDepartmentDoctors(hospitalID, departmentID string) ([]entity.Doctor, error)
	CreateMailBox(mailBox *entity.MailBox) error
	GetMailBoxesByDoctorID(doctorID string) ([]entity.MailBox, error)
	GetMailBoxByID(id string) (*entity.MailBox, error)
	GetRewards(user_id string) ([]entity.Reward, error)
	CreateReward(reward *entity.Reward) error
	CreateMedicalHistory(medicalHistory *entity.MedicalHistory) error
}

type service struct {
	repo domain.Repository
}

// new service
func NewService(repo domain.Repository) Service {
	return &service{
		repo: repo,
	}
}

// implement all service interface

// register doctor
func (s *service) RegisterDoctor(doctor *entity.Doctor) (*entity.Doctor, error) {
	return s.repo.CreateDoctor(doctor)
}

// register patient
func (s *service) RegisterPatient(patient *entity.Patient) (*entity.Patient, error) {
	return s.repo.CreatePatient(patient)
}

func (s *service) Login(email string, password string) (*entity.LoginUser, error) {
	var user *entity.LoginUser

	// get user by email
	var err error
	user, err = s.repo.GetLoginUserByEmail(email)
	if err != nil {
		return nil, err
	}

	// check password
	if user.Password != password {
		return nil, errors.New("password is not correct")
	}

	return user, nil
}

// forgot password
func (s *service) ForgotPassword(forgot *entity.Forgot) (*entity.LoginUser, error) {
	if forgot.IsDoctor {
		// get doctor by email
		doctor, err := s.repo.GetDoctorByEmail(forgot.Email)
		if err != nil {
			return nil, err
		}

		// check question1, answer1, question2, answer2
		if doctor.Question1 != forgot.Question1 || doctor.Answer1 != forgot.Answer1 || doctor.Question2 != forgot.Question2 || doctor.Answer2 != forgot.Answer2 {
			return nil, errors.New("question or answer is not correct")
		}

		return &entity.LoginUser{
			ID: doctor.ID,
		}, nil
	}
	// get patient by email
	patient, err := s.repo.GetPatientByEmail(forgot.Email)
	if err != nil {
		return nil, err
	}

	// check question1, answer1, question2, answer2
	if patient.Question1 != forgot.Question1 || patient.Answer1 != forgot.Answer1 || patient.Question2 != forgot.Question2 || patient.Answer2 != forgot.Answer2 {
		return nil, errors.New("question or answer is not correct")
	}

	return &entity.LoginUser{
		ID: patient.ID,
	}, nil
}

// password reset
func (s *service) ResetPassword(id string, new_password string) error {
	return s.repo.UpdatePassword(id, new_password)
}

func (s *service) GetDoctorProfile(id string) (*entity.Doctor, error) {
	doc, err := s.repo.GetDoctorByID(id)
	if err != nil {
		return nil, err
	}

	if !doc.HospitalID.IsZero() {
		hospital, err := s.repo.GetHospitalByID(doc.HospitalID.Hex())
		if err != nil {
			return nil, err
		}
		doc.Hospital = hospital.Name
	}

	if !doc.DepartmentID.IsZero() {
		department, err := s.repo.GetDepartmentByID(doc.DepartmentID.Hex())
		if err != nil {
			return nil, err
		}
		doc.Department = department.Name
	}

	return doc, nil
}

func (s *service) GetPatientProfile(id string) (*entity.Patient, error) {
	return s.repo.GetPatientByID(id)
}

func (s *service) GetHospitals() ([]entity.Hospital, error) {
	return s.repo.GetHospitals()
}

func (s *service) GetHospitalDepartments(hospitalID string) ([]entity.Department, error) {
	return s.repo.GetHospitalDepartments(hospitalID)
}

func (s *service) GetHospitalDepartmentDoctors(hospitalID, departmentID string) ([]entity.Doctor, error) {
	return s.repo.GetHospitalDepartmentDoctors(hospitalID, departmentID)
}

// create appointment
func (s *service) CreateAppointment(appointment *entity.Appointment) error {
	return s.repo.CreateAppointment(appointment)
}

// get appointments
func (s *service) GetAppointments(user_id string) ([]entity.Appointment, error) {
	return s.repo.GetAppointments(user_id)
}

// GetAppointment
func (s *service) GetAppointment(id string) (*entity.Appointment, error) {
	return s.repo.GetAppointmentByID(id)
}

// create mail box
func (s *service) CreateMailBox(mailBox *entity.MailBox) error {
	// get patient by id

	patient, err := s.repo.GetPatientByID(mailBox.PatientID.Hex())
	if err != nil {
		return err
	}
	mailBox.PatientName = patient.Name
	return s.repo.CreateMailBox(mailBox)
}

// get mail boxes by doctor id
func (s *service) GetMailBoxesByDoctorID(doctorID string) ([]entity.MailBox, error) {
	return s.repo.GetMailBoxesByDoctorID(doctorID)
}

// get mail box by id
func (s *service) GetMailBoxByID(id string) (*entity.MailBox, error) {
	return s.repo.GetMailBoxByID(id)
}

// get Rewards
func (s *service) GetRewards(user_id string) ([]entity.Reward, error) {
	return s.repo.GetRewards(user_id)
}

// create Reward
func (s *service) CreateReward(reward *entity.Reward) error {

	lastReward, _ := s.repo.GetLastAddedReward(reward.UserID.Hex())

	if lastReward != nil {
		// number of hours between two rewards
		hours := reward.Date.Sub(lastReward.Date).Hours()
		if hours < 24 {
			return errors.New("you can't add reward less than 24 hours")
		}
	}

	return s.repo.CreateReward(reward)
}

// create medical history
func (s *service) CreateMedicalHistory(medicalHistory *entity.MedicalHistory) error {
	// get doctor by id
	doctor, err := s.repo.GetDoctorByID(medicalHistory.DoctorID.Hex())
	if err != nil {
		return err
	}
	medicalHistory.DoctorName = doctor.Name
	medicalHistory.Date = time.Now()

	return s.repo.CreateMedicalHistory(medicalHistory)
}

// update doctor
func (s *service) UpdateDoctor(doctor *entity.Doctor) error {
	// get user with email
	user, err := s.repo.GetLoginUserByEmail(doctor.Email)
	if err == nil {
		if user.ID.Hex() != doctor.ID.Hex() {
			return errors.New("email is already used")
		}
	}

	return s.repo.UpdateDoctor(doctor)
}

// update patient
func (s *service) UpdatePatient(patient *entity.Patient) error {
	// get user with email
	user, err := s.repo.GetLoginUserByEmail(patient.Email)
	if err == nil {
		if user.ID.Hex() != patient.ID.Hex() {
			return errors.New("email is already used")
		}
	}

	return s.repo.UpdatePatient(patient)
}
