export interface TelemetryEvent {
  trace: TraceEvent;
  metric?: MetricsEvent;
}
export interface TraceEvent {
  correlationId: string;
  processId?: string;
  operation: string;
  startTime: number;
  endTime: number;
}

export interface MetricsEvent {
  name: string;
  category: string;
}

export interface TraceableDecoratorInput {
  operation: string;
  metrics?: MetricsEvent;
  serviceName?: string;
}
