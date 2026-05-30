---
title: "I Got Tired of Wiring Grafana + Loki + Tempo — So I Built a One-Command Observability Stack"
published: false
description: "Setting up the three pillars of observability (logs, metrics, traces) shouldn't take a weekend. Here's how I made it take 30 seconds."
tags: observability, devops, opentelemetry, docker
cover_image: 
---

I've lost count of how many weekends I've spent wiring up observability stacks for side projects. Grafana for dashboards. Loki for logs. Tempo for traces. Prometheus for metrics. Jaeger if you're feeling adventurous. Each one needs its own config, its own datasource wiring, its own port.

By the time everything talks to each other, you've burned a Saturday and you still haven't shipped your actual app.

So I built [TelyX](https://github.com/sulthonzh/telyx) — a lightweight observability suite that gives you logs, metrics, and traces with a single `docker-compose up`. No chasing config docs. No datasource chaining. Just run it and start instrumenting.

## What's in the box

TelyX stacks five containers:

- **OpenSearch** — stores and indexes your logs
- **OpenSearch Dashboards** — visualizes those logs (think Kibana but open source)
- **Prometheus** — scrapes and stores your metrics
- **OpenTelemetry Collector** — receives traces and forwards them
- **Go backend + React frontend** — ties it all together

Here's the `docker-compose.yml`:

```yaml
version: "3.8"
services:
  opensearch:
    image: opensearchproject/opensearch:2.18.0
    environment:
      - discovery.type=single-node
      - plugins.security.disabled=true
    ports:
      - "9200:9200"

  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:2.18.0
    ports:
      - "5601:5601"
    environment:
      - OPENSEARCH_HOSTS=http://opensearch:9200

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"

  otel-collector:
    image: otel/opentelemetry-collector:0.115.1
    ports:
      - "4317:4317"  # gRPC
      - "55681:55681" # HTTP

  backend:
    build: ../backend
    ports:
      - "8080:8080"

  frontend:
    build: ../frontend
    ports:
      - "3000:3000"
```

One command. Six services. All three pillars covered.

## The Go backend — where the magic happens

The backend is a simple Go service that demonstrates the full observability pipeline. It exposes a `/logs` endpoint that:

1. Receives log data as JSON
2. Forwards it to OpenSearch for indexing
3. Records request metrics in Prometheus (count + duration histogram)
4. Creates an OpenTelemetry span for distributed tracing

Here's what the instrumentation looks like:

```go
var (
    requestCount = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"path"},
    )
    requestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "Histogram of response time",
            Buckets: prometheus.DefBuckets,
        },
        []string{"path"},
    )
)

func logHandler(w http.ResponseWriter, r *http.Request) {
    start := time.Now()
    defer func() {
        duration := time.Since(start).Seconds()
        requestDuration.WithLabelValues("/logs").Observe(duration)
    }()

    _, span := otel.Tracer("telyx-backend").Start(r.Context(), "logHandler")
    defer span.End()

    var logData map[string]interface{}
    json.NewDecoder(r.Body).Decode(&logData)

    // Forward to OpenSearch
    body, _ := json.Marshal(logData)
    http.Post("http://opensearch:9200/logs/_doc", "application/json", bytes.NewReader(body))

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
```

See how every request gets three things for free? The Prometheus counter and histogram track volume and latency. The OTel span gives you distributed tracing. And the OpenSearch call ensures your logs are searchable.

## Why not just use Grafana?

Look, I love Grafana. I use it at work. But for side projects and small teams, the Grafana+Loki+Tempo stack is heavy. You need:

- Grafana itself
- Loki (with its own storage config)
- Tempo or Jaeger (with span storage)
- Prometheus (metrics)
- Each datasource configured in Grafana's UI
- Service discovery or static targets

That's a lot of moving parts. TelyX trades some Grafana flexibility for simplicity. OpenSearch Dashboards handles log visualization natively. Prometheus gives you raw metric queries. And the OTel collector standardizes your trace pipeline.

If you're running production infra at scale, stick with Grafana. If you're building a side project and want to see "what's breaking" without a PhD in Grafana config — TelyX gets you there faster.

## Running it yourself

Clone the repo and fire it up:

```bash
git clone https://github.com/sulthonzh/telyx.git
cd telyx/docker
docker-compose up -d
```

Wait about 30 seconds for OpenSearch to initialize (it's chatty on startup, that's normal). Then:

- **Frontend**: http://localhost:3000
- **OpenSearch Dashboards**: http://localhost:5601
- **Prometheus**: http://localhost:9090
- **Backend API**: http://localhost:8080

Send a test log:

```bash
curl -X POST http://localhost:8080/logs \
  -H "Content-Type: application/json" \
  -d '{"level":"info","message":"TelyX is running","service":"test"}'
```

Check it in OpenSearch Dashboards — go to Discover, create an index pattern for `logs*`, and you'll see your entry. In Prometheus, query `http_requests_total` and you'll see the metric. The trace lands in the OTel collector.

Three pillars. One request. Zero config headaches.

## The sampling gotcha

One thing I learned the hard way — the backend uses 10% trace sampling:

```go
trace.WithSampler(trace.ParentBased(trace.TraceIDRatioBased(0.1)))
```

This is intentional for production workloads where you don't want every single request traced. But during development, you might want to bump that to `1.0` so every request shows up. Cost me 20 minutes of "where are my traces?!" before I realized.

Also, the `initTracer` function has a duplicate `trace.WithBatcher(exporter)` line — that's a bug, not a feature. It won't break anything but it's redundant. PR welcome 😉

## What I'd like to add next

TelyX is functional but minimal. A few things I want to build:

- **Alerting rules** — Prometheus alertmanager integration so you get notified when things break
- **Pre-built dashboards** — OpenSearch and Prometheus dashboards that work out of the box
- **Multi-service tracing** — right now the trace pipeline works but you need OTel SDK in your own services to propagate context
- **Helm chart** — for deploying to Kubernetes instead of just Docker Compose

If any of that sounds interesting, the repo is open. Contributions welcome.

## When to use this vs. managed services

Real talk: if you're running a production system with SLAs, use Datadog or New Relic. Managed observability is worth the money when your pager goes off at 3 AM and you need answers fast.

But for:

- Side projects where you want visibility without the price tag
- Learning how observability actually works (the three pillars, not just "install agent")
- Small teams that can't justify $100+/month on monitoring
- Prototyping before committing to a managed stack

TelyX fills that gap. It's not trying to be Datadog. It's trying to be the thing you reach for when `console.log` isn't enough but full Grafana is too much.

Give it a spin and let me know what you think. Star the repo if it saves you a weekend — that's literally what it was built for.

---

*Built TelyX as part of an open-source lab. Check out [the repo](https://github.com/sulthonzh/telyx) if you want to contribute or just poke around the code.*
