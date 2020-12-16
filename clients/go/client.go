package main

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
)

const	address = "localhost:50051"

func main() {
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := NewVirtruClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	r, err := c.Encrypt(ctx, &EncryptRequest{UnprotectedString: "Hello World"})
	if err != nil {
		log.Fatalf("Could not protect: %v", err)
	}
	log.Printf("Protected string: %s", r.GetProtectedString())
}
