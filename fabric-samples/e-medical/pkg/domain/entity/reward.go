package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Reward struct {
	ID     primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID primitive.ObjectID `json:"user_id,omitempty" bson:"user_id,omitempty"`
	Title  string             `json:"title,omitempty" bson:"title,omitempty"`
	Date   time.Time          `json:"date,omitempty" bson:"date,omitempty"`
	Value  int                `json:"value,omitempty" bson:"value,omitempty"`
}
