package metrics

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/push"
)

var prometheusPushGateway = os.Getenv("PUSH_GATEWAY_URL")

var commandCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "command_requests_total",
	Help: "The Requests of a specific Command",
}, []string{"command_name"})

var queryCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "query_requests_total",
	Help: "The Requests of a specific Query",
}, []string{"query_name"})

var domainEventCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "domain_event_requests_total",
	Help: "The amount of the specific Integration Events sent",
}, []string{"domain_event_name"})

var integrationEventCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "integration_event_requests_total",
	Help: "The amount of the specific Integration Events sent",
}, []string{"integration_event_name"})

var commandHandlerCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "command_handler_requests_total",
	Help: "The Requests of a specific Command Handler",
}, []string{"command_handler_name"})

var queryHandlerCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "query_handler_requests_total",
	Help: "The Requests of a specific Query Handler",
}, []string{"query_handler_name"})

var domainEventHandlerCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "domain_event_handler_requests_total",
	Help: "The Requests of a specific Domain Event Handler",
}, []string{"domain_event_handler_name"})

var integrationEventHandlerCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "integration_event_handler_requests_total",
	Help: "The Requests of a specific Integration Event Handler",
}, []string{"integration_event_handler_name"})

var controllerCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "controller_requests_total",
	Help: "The Requests of a specific Controller",
}, []string{"controller_name"})

func init() {
	godotenv.Load()
	prometheusPushGateway = os.Getenv("PUSH_GATEWAY_URL") //"http://pushgateway:9091"
	prometheus.MustRegister(commandCounter)
	prometheus.MustRegister(controllerCounter)
	prometheus.MustRegister(integrationEventHandlerCounter)
	prometheus.MustRegister(domainEventHandlerCounter)
	prometheus.MustRegister(queryHandlerCounter)
	prometheus.MustRegister(commandHandlerCounter)
	prometheus.MustRegister(integrationEventCounter)
	prometheus.MustRegister(domainEventCounter)
	prometheus.MustRegister(queryCounter)

}

func IncreaseCommandCounter(commandName string) {
	commandCounter.WithLabelValues(commandName).Inc()
	if err := push.New(prometheusPushGateway, "commands").
		Collector(commandCounter).Push(); err != nil {
		fmt.Println("Could not push command counter to Pushgateway:", err)
	}
}

func IncreaseQueryCounter(queryName string) {
	queryCounter.WithLabelValues(queryName).Inc()
	if err := push.New(prometheusPushGateway, "queries").
		Collector(queryCounter).Push(); err != nil {
		fmt.Println("Could not push query counter to Pushgateway:", err)
	}
}

func IncreaseDomainEventCounter(domainEventName string) {
	domainEventCounter.WithLabelValues(domainEventName).Inc()
	if err := push.New(prometheusPushGateway, "domain_events").
		Collector(domainEventCounter).Push(); err != nil {
		fmt.Println("Could not push domain event counter to Pushgateway:", err)
	}
}

func IncreaseIntegrationEventCounter(integrationEventName string) {
	integrationEventCounter.WithLabelValues(integrationEventName).Inc()
	if err := push.New(prometheusPushGateway, "integration_events").
		Collector(integrationEventCounter).Push(); err != nil {
		fmt.Println("Could not push integration event counter to Pushgateway:", err)
	}
}

func IncreaseCommandHandlerCounter(commandHandlerName string) {
	commandHandlerCounter.WithLabelValues(commandHandlerName).Inc()
	if err := push.New(prometheusPushGateway, "command_handlers").
		Collector(commandHandlerCounter).Push(); err != nil {
		fmt.Println("Could not push command handler counter to Pushgateway:", err)
	}
}

func IncreaseQueryHandlerCounter(queryHandlerName string) {
	queryHandlerCounter.WithLabelValues(queryHandlerName).Inc()
	if err := push.New(prometheusPushGateway, "query_handlers").
		Collector(queryHandlerCounter).Push(); err != nil {
		fmt.Println("Could not push query handler counter to Pushgateway:", err)
	}
}

func IncreaseDomainEventHandlerCounter(domainEventHandlerName string) {
	domainEventHandlerCounter.WithLabelValues(domainEventHandlerName).Inc()
	if err := push.New(prometheusPushGateway, "domain_event_handlers").
		Collector(domainEventHandlerCounter).Push(); err != nil {
		fmt.Println("Could not push domain event handler counter to Pushgateway:", err)
	}
}

func IncreaseIntegrationEventHandlerCounter(integrationEventHandlerName string) {
	integrationEventHandlerCounter.WithLabelValues(integrationEventHandlerName).Inc()
	if err := push.New(prometheusPushGateway, "integration_event_handlers").
		Collector(integrationEventHandlerCounter).Push(); err != nil {
		fmt.Println("Could not push integration event handler counter to Pushgateway:", err)
	}
}

func IncreaseControllerCounter(controllerName string) {
	controllerCounter.WithLabelValues(controllerName).Inc()
	if err := push.New(prometheusPushGateway, "controllers").
		Collector(controllerCounter).Push(); err != nil {
		fmt.Println("Could not push controller counter to Pushgateway:", err)
	}
}
