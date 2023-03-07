package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

// Hospital is a entity of domain, it represents a mongodb document.
type Hospital struct {
	ID          primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string               `json:"name,omitempty" bson:"name,omitempty"`
	Departments []primitive.ObjectID `json:"departments,omitempty" bson:"departments,omitempty"`
}

type Department struct {
	ID   primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name string             `json:"name,omitempty" bson:"name,omitempty"`
	//Doctors []primitive.ObjectID `json:"doctors,omitempty" bson:"doctors,omitempty"`
}
