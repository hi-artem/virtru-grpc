package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"google.golang.org/grpc"
)

const serverUrl = "0.0.0.0:50051"

func main() {
	conn, err := grpc.Dial(serverUrl, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Error connecting to Virtru gRPC server: %v", err)
	}
	defer conn.Close()
	client := NewVirtruClient(conn)

	connContext, cancel := context.WithTimeout(context.Background(), 40*time.Second)
	defer cancel()

	currentTimestamp := time.Now().String()

	encResp, err := client.Encrypt(connContext, &EncryptRequest{UnprotectedString: currentTimestamp})
	if err != nil {
		log.Fatalf("Could not protect string: %v", err)
	}

	fmt.Print(encResp.GetProtectedString(), "\n")

	decResp, err := client.Decrypt(connContext, &DecryptRequest{ProtectedString: encResp.GetProtectedString()})
	if err != nil {
		log.Fatalf("Could not decrypt protected string: %v", err)
	}

	fmt.Print(decResp.GetUnprotectedString(), "\n")
}
