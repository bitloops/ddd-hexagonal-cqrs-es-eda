package main

import (
	"bitloops/telemetry/consumer/consumer"
	"bitloops/telemetry/consumer/metrics"
	"bitloops/telemetry/consumer/tracing"
	"encoding/json"
	"fmt"
	"log"

	"github.com/nats-io/nats.go"
)

const (
	subject    = "trace_events"
	StreamName = "trace_events"
)

func main() {

	// Connect to NATS JetStream
	js, nc := consumer.ConnectToJetStream()
	defer nc.Close()
	sub := SubscribeToTracingEvents(js)
	defer sub.Unsubscribe()
	select {}
}

func SubscribeToTracingEvents(js nats.JetStreamContext) *nats.Subscription {
	sub, err := js.Subscribe(subject, func(msg *nats.Msg) {

		processEvent(msg.Data, msg.Header)
		err := msg.Ack()
		if err != nil {
			log.Fatalf("Error acknowledging message: %v\n", err)
		}
	}, nats.Durable("monitor"), nats.ManualAck())
	if err != nil {
		fmt.Printf("Error subscribing to subject: %v\n %v", subject, err)
		CreateStream(js)
		SubscribeToTracingEvents(js)
	}

	return sub

}

func CreateStream(jetStream nats.JetStreamContext) error {
	stream, err := jetStream.StreamInfo(StreamName)

	if stream == nil {
		log.Printf("Creating stream: %s\n", StreamName)

		_, err = jetStream.AddStream(&nats.StreamConfig{
			Name:     StreamName,
			Subjects: []string{subject},
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func processEvent(data []byte, headers nats.Header) {
	var event tracing.Event
	err := json.Unmarshal(data, &event)
	if err != nil {
		log.Printf("Error unmarshalling event: %v", err)
		return
	}

	fmt.Printf("\nReceived event metric: %+v", event.Metric)
	metrics.SendMeter(event.Metric)

	fmt.Printf("\nReceived event trace: %+v\n", event.Trace)
	err = tracing.SendTrace(event.Trace)
	if err != nil {
		log.Printf("Error sending trace: %v", err)
		return
	}

}
