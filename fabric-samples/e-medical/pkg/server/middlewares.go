package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get token string from header
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			// unauthorized
			json.NewEncoder(w).Encode(map[string]interface{}{
				"error": "unauthorized",
			})
			return
		}

		// parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
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
			ctx := context.WithValue(r.Context(), "user_id", claims["user_id"].(string))
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"error": "unauthorized",
			})
			return
		}
	})
}
