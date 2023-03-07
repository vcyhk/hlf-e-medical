package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type LoginUser struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	Name     string             `json:"name" bson:"name"`
	Email    string             `json:"email" bson:"email"`
	Password string             `json:"password" bson:"password"`
	IsDoctor bool               `json:"is_doctor" bson:"is_doctor"`
}
