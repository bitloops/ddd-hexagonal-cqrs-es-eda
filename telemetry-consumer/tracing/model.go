package tracing

type TraceEvent struct {
	TraceID     string            `json:"correlationId"`
	ServiceName string            `json:"serviceName"`
	Operation   string            `json:"operation"`
	StartTime   int64             `json:"startTime"`
	EndTime     int64             `json:"endTime"`
	Attributes  map[string]string `json:"attributes"`
}
