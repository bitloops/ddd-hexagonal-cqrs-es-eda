### OpenTelemetry consumer that exports traces to Jaeger and metrics to Promitheus

This is a consumer written in Go that consume Nats Jestream streams containing observability data and exports them accordingly to Prometheus and Jaeger.

#### Message structure

```json{
    "trace": {
        "correlationId": "",
        "service_name": "",
        "operation": "",
        "startTime": "",
        "endTime": "",
        "attributes": ""
        },
    "metric": {
        "name":"",
        "category: ""
    }
}
```

#### Jaeger

In Jaeger we can search based on service `bitloops_app` and filetr by operation, time etc, or we can search based on TraceId.

http://localhost:16686/search

#### Prometheus

In Prometheus we can spot our metric and query by it at the time frame we want.

- For example if we want to search for commandHandlers we filter with `command_handler_requests_total`

http://localhost:9090/
