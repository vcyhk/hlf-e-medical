package main

import (
	"context"
	"e-madical/pkg/domain"
	"e-madical/pkg/server"
	"e-madical/pkg/service"
	"e-madical/pkg/storage"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// mongodb uri
	// example:
	// mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
	uri := "mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"

	// create mongo client
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	// connect to mongo database
	err = client.Connect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	// disconnect from mongo database after use
	defer client.Disconnect(context.Background())

	// get mongo database
	db := client.Database("emedical")

	var repo domain.Repository = storage.NewStorage(db)
	if err != nil {
		log.Fatal(err)
	}

	service := service.NewService(repo)

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	server := server.NewServer(r, service)

	http.ListenAndServe(":8000", server)
}
