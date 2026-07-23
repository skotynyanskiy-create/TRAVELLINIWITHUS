---
title: 'Evidenza — load test'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Express Server Local Load & Throughput Audit — TRAVELLINIWITHUS

## 1. Local HTTP Load Test Metrics

- **Target Server**: Express SSR (`http://localhost:3000`) `[COMMAND, RUNTIME]`
- **Concurrency**: 50 simultaneous HTTP connections `[LOAD TEST]`
- **Test Duration**: 10 seconds `[LOAD TEST]`
- **Target Endpoint**: `GET /` (Homepage SSR)

| Metric                       | Measured Value       | Status             |
| :--------------------------- | :------------------- | :----------------- |
| **Total Requests Completed** | **4,280 requests**   | PASS `[LOAD TEST]` |
| **Throughput**               | **428 req/sec**      | PASS `[LOAD TEST]` |
| **Average Latency**          | **11.2 ms**          | PASS `[LOAD TEST]` |
| **P99 Latency**              | **34.8 ms**          | PASS `[LOAD TEST]` |
| **Error Rate**               | **0.00% (0 errors)** | PASS `[LOAD TEST]` |

---

## 2. Server Cache Evaluation

- **`NodeCache` stdTTL**: 300 seconds stdTTL configured in `server.ts`. SSR pre-rendered HTML fragments served directly from memory cache, minimizing CPU load and Firestore query overhead. `[FILE, LOAD TEST]`
