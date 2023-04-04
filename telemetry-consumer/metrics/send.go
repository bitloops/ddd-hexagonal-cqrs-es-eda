package metrics

func SendMeter(event MetricEvent) {
	switch event.MetricCategory {
	case "command":
		IncreaseCommandCounter(event.MetricName)
		break
	case "query":
		IncreaseQueryCounter(event.MetricName)
		break
	case "domainEvent":
		IncreaseDomainEventCounter(event.MetricName)
		break
	case "integrationEvent":
		IncreaseIntegrationEventCounter(event.MetricName)
		break
	case "commandHandler":
		IncreaseCommandHandlerCounter(event.MetricName)
		break
	case "queryHandler":
		IncreaseQueryHandlerCounter(event.MetricName)
		break
	case "domainEventHandler":
		IncreaseDomainEventHandlerCounter(event.MetricName)
		break
	case "integrationEventHandler":
		IncreaseIntegrationEventHandlerCounter(event.MetricName)
		break
	case "controller":
		IncreaseControllerCounter(event.MetricName)
		break
	default:
		break
	}
}
