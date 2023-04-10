#!/bin/bash

# Change directory to the k8s folder
cd k8s

# Apply the namespace
kubectl apply -f namespace-bitloops.yaml

# Apply ConfigMaps, Secrets, and Persistent Volume Claims
kubectl apply -f configmap-bl-grafana-config.yaml
kubectl apply -f secret-bl-postgres-secret.yaml
kubectl apply -f pvc-bl-mongo-data.yaml
kubectl apply -f pvc-bl-nats-data.yaml
kubectl apply -f pvc-bl-postgres-data.yaml
kubectl apply -f pvc-bl-prometheus-data.yaml
kubectl apply -f pvc-bl-grafana-data.yaml

# Apply Deployments and Services
kubectl apply -f deployment-todo-frontend.yaml
kubectl apply -f service-todo-frontend.yaml
kubectl apply -f deployment-todo-backend.yaml
kubectl apply -f service-todo-backend.yaml
kubectl apply -f deployment-bl-mongo.yaml
kubectl apply -f service-bl-mongo.yaml
kubectl apply -f deployment-bl-nats.yaml
kubectl apply -f service-bl-nats.yaml
kubectl apply -f deployment-bl-postgres.yaml
kubectl apply -f service-bl-postgres.yaml
kubectl apply -f deployment-bl-prometheus-nats-exporter.yaml
kubectl apply -f service-bl-prometheus-nats-exporter.yaml
kubectl apply -f deployment-bl-jaeger.yaml
kubectl apply -f service-bl-jaeger.yaml
kubectl apply -f deployment-bl-pushgateway.yaml
kubectl apply -f service-bl-pushgateway.yaml
kubectl apply -f deployment-bl-prometheus.yaml
kubectl apply -f service-bl-prometheus.yaml
kubectl apply -f deployment-bl-grafana.yaml
kubectl apply -f service-bl-grafana.yaml
kubectl apply -f deployment-bl-envoy.yaml
kubectl apply -f service-bl-envoy.yaml
kubectl apply -f deployment-bl-telemetry-consumer.yaml
kubectl apply -f service-bl-telemetry-consumer.yaml

# Change back to the original directory
cd ..
