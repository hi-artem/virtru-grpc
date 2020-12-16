package main

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
)

const	address = "0.0.0.0:50051"

func main() {
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := NewVirtruClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	encResp, err := c.Encrypt(ctx, &EncryptRequest{UnprotectedString: "Hello World"})
	if err != nil {
		log.Fatalf("Could not protect string: %v", err)
	}

	log.Printf("Protected string: %s", encResp.GetProtectedString())

	ctx, cancel = context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	decResp, err := c.Decrypt(ctx, &DecryptRequest{ProtectedString: encResp.GetProtectedString()})
	if err != nil {
		log.Fatalf("Could not decrypt protected string: %v", err)
	}

	log.Printf("Decrypted protected string: %s", decResp.GetUnprotectedString())
}
