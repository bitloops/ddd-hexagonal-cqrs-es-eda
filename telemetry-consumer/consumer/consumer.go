package consumer

import (
	"log"

	"github.com/nats-io/nats.go"
)

const (
	natsURL = "nats:4222"
	subject = "trace_events"
)

func ConnectToJetStream() (nats.JetStreamContext, *nats.Conn) {
	nc, err := nats.Connect(natsURL)
	if err != nil {
		log.Fatalf("Error connecting to NATS: %v %v", natsURL, err)
	}

	js, err := nc.JetStream()
	if err != nil {
		log.Fatalf("Error connecting to JetStream: %v", err)
	}
	return js, nc
}
