package metrics

type MetricEvent struct {
	MetricName     string `json:"name"`
	MetricCategory string `json:"category"`
}
