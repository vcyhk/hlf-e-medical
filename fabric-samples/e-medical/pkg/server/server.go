package server

import (
	"e-madical/pkg/domain/entity"
	"e-madical/pkg/service"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Server struct {
	serv service.Service
	mux  *chi.Mux
}

func NewServer(mux *chi.Mux, serv service.Service) *Server {
	s := &Server{
		mux:  mux,
		serv: serv,
	}
	s.init()
	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.mux.ServeHTTP(w, r)
}

func (s *Server) init() {
	// normal routes
	s.mux.Group(func(r chi.Router) {
		r.Post("/doctor/register", s.RegisterDoctor)
		r.Post("/patient/register", s.RegisterPatient)
		r.Post("/login", s.Login)

		r.Post("/forgot", s.ForgotPassowrd)
		r.Post("/passwordreset", s.PasswordReset)
	})

	// protected routes
	s.mux.Group(func(r chi.Router) {
		// using auth middleware
		r.Use(AuthMiddleware)

		r.Get("/doctor/profile/{id}", s.DoctorProfile)
		r.Get("/patient/profile/{id}", s.PatientProfile)
		r.Post("/doctor/update", s.DoctorUpdate)
		r.Post("/patient/update", s.PatientUpdate)
		r.Get("/hospitals", s.GetHospitals)
		r.Get("/hospitals/{id}/departments", s.GetHospitalDepartments)
		r.Get("/hospitals/{h_id}/departments/{d_id}/doctors", s.GetHospitalDepartmentDoctors)
		r.Post("/appointments", s.CreateAppointment)
		r.Get("/appointments", s.GetAppointments)
		r.Get("/appointments/{id}", s.GetAppointment)
		r.Post("/mailboxes", s.CreateMailbox)
		r.Get("/mailboxes", s.GetMailBoxes)
		r.Get("/mailboxes/{id}", s.GetMailBox)
		r.Post("/medicalhistory", s.CreateMedicalHistory)
		r.Get("/rewards", s.GetRewards)
		r.Post("/rewards", s.CreateReward)
	})
}

// register doctor
func (s *Server) RegisterDoctor(w http.ResponseWriter, r *http.Request) {
	doctor := &entity.Doctor{}
	if err := json.NewDecoder(r.Body).Decode(doctor); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	var err error
	if _, err = s.serv.RegisterDoctor(doctor); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// TODO: response with jwt token
	// response id, name, email and is_doctor
	if err := json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "success",
	}); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
}

// update doctor
func (s *Server) DoctorUpdate(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	doctor := &entity.Doctor{}
	if err := json.NewDecoder(r.Body).Decode(doctor); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// change id to oid
	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// check user id and doctor id
	if oid != doctor.ID {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "not authorized",
		})
		return
	}

	err = s.serv.UpdateDoctor(doctor)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// response success
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "success",
	})
}

// update patient
func (s *Server) PatientUpdate(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	patient := &entity.Patient{}
	if err := json.NewDecoder(r.Body).Decode(patient); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// change id to oid
	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// check user id and patient id
	if oid != patient.ID {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "not authorized",
		})
		return
	}

	err = s.serv.UpdatePatient(patient)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// response success
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "success",
	})
}

// register patient
func (s *Server) RegisterPatient(w http.ResponseWriter, r *http.Request) {
	patient := &entity.Patient{}
	err := json.NewDecoder(r.Body).Decode(patient)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	_, err = s.serv.RegisterPatient(patient)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// TODO: response with jwt token
	// response id
	if err := json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "success",
	}); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

}

func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
	user := &entity.LoginUser{}
	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// login
	var err error
	if user, err = s.serv.Login(user.Email, user.Password); err != nil {
		//http.Error(w, err.Error(), http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.Hex(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte("my_secret_key"))
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// response id name email is_doctor
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":        user.ID.Hex(),
		"name":      user.Name,
		"email":     user.Email,
		"is_doctor": user.IsDoctor,
		"token":     tokenString,
	})
}

// forgot
func (s *Server) ForgotPassowrd(w http.ResponseWriter, r *http.Request) {
	var forgot entity.Forgot
	if err := json.NewDecoder(r.Body).Decode(&forgot); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	user, err := s.serv.ForgotPassword(&forgot)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.Hex(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte("my_secret_key"))
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": tokenString,
	})
}

// password reset
func (s *Server) PasswordReset(w http.ResponseWriter, r *http.Request) {
	var passToken struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&passToken); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}
	// parse token
	token, err := jwt.Parse(passToken.Token, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte("my_secret_key"), nil
	})
	if err != nil {
		// unauthorized
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "unauthorized",
		})
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"].(string)
		err := s.serv.ResetPassword(userID, passToken.NewPassword)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"error": err.Error(),
			})
			return
		}

	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "unauthorized",
		})
		return
	}

}

// profile
func (s *Server) DoctorProfile(w http.ResponseWriter, r *http.Request) {
	// get doctor id from go-chi router
	doctorID := chi.URLParam(r, "id")
	doctor, err := s.serv.GetDoctorProfile(doctorID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(entity.Doctor{
		ID:                 doctor.ID,
		Name:               doctor.Name,
		Email:              doctor.Email,
		RegistrationNumber: doctor.RegistrationNumber,
		Hospital:           doctor.Hospital,
		Department:         doctor.Department,
	})
}

// get patient profile
func (s *Server) PatientProfile(w http.ResponseWriter, r *http.Request) {
	// get patient id from go-chi router
	patientID := chi.URLParam(r, "id")

	patient, err := s.serv.GetPatientProfile(patientID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(entity.Patient{
		ID:       		patient.ID,
		Name:     		patient.Name,
		Email:    		patient.Email,
		Birthday: 		patient.Birthday,
		HKID:     		patient.HKID,
		MEDID:     		patient.MEDID,
		Address:  		patient.Address,
		Phone:    		patient.Phone,
	})
}

// get hospitals
func (s *Server) GetHospitals(w http.ResponseWriter, r *http.Request) {
	var err error
	var hospitals []entity.Hospital
	if hospitals, err = s.serv.GetHospitals(); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(hospitals)
}

// get hospital department
func (s *Server) GetHospitalDepartments(w http.ResponseWriter, r *http.Request) {
	// get hospital id from go-chi router
	hospitalID := chi.URLParam(r, "id")
	var err error
	var departments []entity.Department
	if departments, err = s.serv.GetHospitalDepartments(hospitalID); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(departments)
}

// get hospital department doctors
func (s *Server) GetHospitalDepartmentDoctors(w http.ResponseWriter, r *http.Request) {
	// get hospital id from go-chi router
	hospitalID := chi.URLParam(r, "h_id")

	// get department id from go-chi router
	departmentID := chi.URLParam(r, "d_id")

	var err error
	var doctors []entity.Doctor
	if doctors, err = s.serv.GetHospitalDepartmentDoctors(hospitalID, departmentID); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	for i := 0; i < len(doctors); i++ {
		doctors[i] = entity.Doctor{
			ID:    doctors[i].ID,
			Name:  doctors[i].Name,
			Email: doctors[i].Email,
		}
	}

	json.NewEncoder(w).Encode(doctors)
}

// create appointment
func (s *Server) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	var appointment entity.Appointment
	if err := json.NewDecoder(r.Body).Decode(&appointment); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// convert to object id
	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	appointment.PatientID = oid
	if err := s.serv.CreateAppointment(&appointment); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": "success",
	})
}

// get doctor appointments
func (s *Server) GetAppointments(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	var appointments []entity.Appointment
	if appointments, _ = s.serv.GetAppointments(userID); len(appointments) == 0 {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "no appointments",
		})
		return
	}
	json.NewEncoder(w).Encode(appointments)
}

// get appointment by id
func (s *Server) GetAppointment(w http.ResponseWriter, r *http.Request) {
	// get appointment id from go-chi router
	appointmentID := chi.URLParam(r, "id")

	app, err := s.serv.GetAppointment(appointmentID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(app)
}

func (s *Server) CreateMailbox(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	var mailbox entity.MailBox
	if err := json.NewDecoder(r.Body).Decode(&mailbox); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// convert to object id
	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	mailbox.PatientID = oid
	if err := s.serv.CreateMailBox(&mailbox); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": "success",
	})

}

func (s *Server) GetMailBoxes(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	mailboxes, err := s.serv.GetMailBoxesByDoctorID(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}
	json.NewEncoder(w).Encode(mailboxes)

}

func (s *Server) GetMailBox(w http.ResponseWriter, r *http.Request) {
	// get mailbox id from go-chi router
	mailboxID := chi.URLParam(r, "id")

	mailbox, err := s.serv.GetMailBoxByID(mailboxID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(mailbox)
}

// get rewards
func (s *Server) GetRewards(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	rewards, err := s.serv.GetRewards(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}
	var total int
	for _, reward := range rewards {
		total += reward.Value
	}
	json.NewEncoder(w).Encode(map[string]interface{}{
		"rewards": rewards,
		"total":   total,
	})
}

// create reward
func (s *Server) CreateReward(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	var body map[string]string
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	if typ, ok := body["reward"]; ok {
		if typ == "daily" {
			oid, err := primitive.ObjectIDFromHex(userID)
			if err != nil {
				json.NewEncoder(w).Encode(map[string]interface{}{
					"error": err.Error(),
				})
				return
			}
			reward := entity.Reward{
				UserID: oid,
				Title:  "daily",
				Value:  10,
				Date:   time.Now(),
			}
			if err := s.serv.CreateReward(&reward); err != nil {
				json.NewEncoder(w).Encode(map[string]interface{}{
					"error": err.Error(),
				})
				return
			}

			json.NewEncoder(w).Encode(map[string]interface{}{
				"message": "Daily reward created",
			})
		}
	}
}

// create medical history
func (s *Server) CreateMedicalHistory(w http.ResponseWriter, r *http.Request) {
	// get user id from context
	userID := r.Context().Value("user_id").(string)

	var medicalHistory entity.MedicalHistory
	if err := json.NewDecoder(r.Body).Decode(&medicalHistory); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	// convert to object id
	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	medicalHistory.DoctorID = oid
	if err := s.serv.CreateMedicalHistory(&medicalHistory); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": "success",
	})
}
