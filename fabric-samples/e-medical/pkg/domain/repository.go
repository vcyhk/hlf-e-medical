package domain

import "e-madical/pkg/domain/entity"

type Repository interface {
	// Patient
	CreatePatient(patient *entity.Patient) (*entity.Patient, error)
	GetPatientByID(id string) (*entity.Patient, error)
	GetPatientByEmail(email string) (*entity.Patient, error)
	UpdatePatient(patient *entity.Patient) error
	DeletePatient(id string) error

	GetPatientAppointments(id string) ([]*entity.Appointment, error)

	// Doctor
	CreateDoctor(doctor *entity.Doctor) (*entity.Doctor, error)
	GetDoctorByID(id string) (*entity.Doctor, error)
	GetDoctorByEmail(email string) (*entity.Doctor, error)
	UpdateDoctor(doctor *entity.Doctor) error
	DeleteDoctor(id string) error

	// LoginUser
	GetLoginUserByEmail(email string) (*entity.LoginUser, error)

	// UpdatePassword by id
	UpdatePassword(id string, new_password string) error

	// GetDoctorAppointments(id string) ([]*entity.Appointment, error)

	// // Hospital
	// CreateHospital(hospital *entity.Hospital) (*entity.Hospital, error)
	GetHospitalByID(id string) (*entity.Hospital, error)
	GetHospitals() ([]entity.Hospital, error)
	// UpdateHospital(hospital *entity.Hospital) error
	// DeleteHospital(id string) error

	GetDepartmentByID(id string) (*entity.Department, error)

	GetHospitalDepartments(id string) ([]entity.Department, error)
	// GetHospitalAppointments(id string) ([]*entity.Appointment, error)

	GetHospitalDepartmentDoctors(hospital_id, department_id string) ([]entity.Doctor, error)

	// Appointment
	CreateAppointment(appointment *entity.Appointment) error
	// get appointment by user id
	GetAppointments(user_id string) ([]entity.Appointment, error)
	GetAppointmentByID(id string) (*entity.Appointment, error)

	// Create mail box
	CreateMailBox(mail_box *entity.MailBox) error
	GetMailBoxesByDoctorID(doctor_id string) ([]entity.MailBox, error)
	GetMailBoxByID(id string) (*entity.MailBox, error)
	CreateMedicalHistory(medical_history *entity.MedicalHistory) error
	GetMedicalHistoriesByPatientID(patient_id string) ([]entity.MedicalHistory, error)

	//CreateReward(reward *entity.Reward) error
	GetRewards(user_id string) ([]entity.Reward, error)
	//create reward
	CreateReward(reward *entity.Reward) error
	GetLastAddedReward(user_id string) (*entity.Reward, error)
}
