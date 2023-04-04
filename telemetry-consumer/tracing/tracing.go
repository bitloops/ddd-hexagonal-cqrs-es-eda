package tracing

import (
	"bitloops/telemetry/consumer/metrics"
	"context"
	"fmt"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
)

var traceIdSpanIdMapping = map[string]string{}

type Event struct {
	Trace  TraceEvent          `json:"trace"`
	Metric metrics.MetricEvent `json:"metric"`
}

func getParentContext(event TraceEvent, parentSpanId string) (spanContext trace.SpanContext, err error) {
	var traceID trace.TraceID
	traceID, err = trace.TraceIDFromHex(event.TraceID)
	if err != nil {
		return spanContext, err
	}
	var spanID trace.SpanID
	spanID, err = trace.SpanIDFromHex(parentSpanId)
	if err != nil {
		return spanContext, err
	}
	spanContext = trace.NewSpanContext(trace.SpanContextConfig{
		TraceID:    traceID,
		SpanID:     spanID,
		TraceFlags: 01,
		Remote:     true,
	})
	return spanContext, nil
}

func SendTrace(event TraceEvent) error {
	tracer := otel.GetTracerProvider().Tracer(event.ServiceName)

	ctx := context.Background()
	// fmt.Print("before unix")
	startTime := time.UnixMilli(event.StartTime)
	endTime := time.UnixMilli(event.EndTime)
	// fmt.Printf("\nCreating span with startTime: %v %v", startTime, endTime)

	// fmt.Println("traceId: ", event.TraceID)
	// if event.ParentSpanId != "" {
	if traceIdSpanIdMapping[event.TraceID] != "" {
		parentSpanId := traceIdSpanIdMapping[event.TraceID]
		// fmt.Printf("\nCreating span with traceId: %v and parent spanId: %v", event.TraceID, parentSpanId)
		remoteCtx, err := getParentContext(event, parentSpanId)
		if err != nil {
			fmt.Print(err)
		}
		_, span := tracer.Start(trace.ContextWithRemoteSpanContext(ctx, remoteCtx), event.Operation, trace.WithTimestamp(startTime))
		traceIdSpanIdMapping[event.TraceID] = span.SpanContext().SpanID().String()
		defer span.End(trace.WithTimestamp(endTime))
	} else {
		traceID, err := trace.TraceIDFromHex(event.TraceID)
		fmt.Println("traceID: ", traceID)
		if err != nil {
			return err
		}

		// fmt.Printf("\nCreating span with traceId: %v", traceID)
		//create a new root span with provided spanId and traceId
		spanContext := trace.NewSpanContext(trace.SpanContextConfig{
			TraceID:    traceID,
			TraceFlags: 01,
			Remote:     false,
		})

		// fmt.Println("after spanContext: ")

		_, span := tracer.Start(
			trace.ContextWithSpanContext(ctx, spanContext),
			event.Operation,
			trace.WithTimestamp(startTime),
		)

		traceIdSpanIdMapping[event.TraceID] = span.SpanContext().SpanID().String()
		// fmt.Printf("\nCreatedtraceIdSpanIdMapping: %+v", traceIdSpanIdMapping)

		// Add attributes to the span
		for key, value := range event.Attributes {
			span.SetAttributes(attribute.String(key, value))
		}
		defer span.End(trace.WithTimestamp(endTime))
	}
	return nil
}
