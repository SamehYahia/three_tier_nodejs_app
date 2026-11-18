# 3-Tier Cloud-Native Todo Application — DevOps & Kubernetes Modernization

[![CI Pipeline](https://github.com/SamehYahia/three_tier_nodejs_app/actions/workflows/ci.yml/badge.svg)](https://github.com/SamehYahia/three_tier_nodejs_app/actions)
![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20%7C%20Non--Root-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Multi--Node%20%7C%20StatefulSet-326CE5?logo=kubernetes&logoColor=white)
![Security](https://img.shields.io/badge/DevSecOps-Trivy%20%7C%20Hadolint-4B32C3?logo=aquasecurity&logoColor=white)

An end-to-end production modernization of a legacy 3-tier web application (**React**, **Node.js/Express**, **MongoDB**). This project refactors a tightly coupled application into a **12-Factor**, container-hardened, and highly available microservices architecture orchestrated on a **Multi-Node Kubernetes Cluster**.

---

## System Architecture & Traffic Flow

```text
                         [ External Client: [http://todo-app.local](http://todo-app.local) ]
                                             │
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │     Nginx Ingress Controller (Edge)     │
                        │      Host Routing: todo-app.local       │
                        └────────────────────┬────────────────────┘
                                             │
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │       Frontend Service (ClusterIP)      │
                        │          Internal Port: 8080            │
                        └────────────────────┬────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     ▼                                               ▼
        ┌─────────────────────────┐                     ┌─────────────────────────┐
        │   Frontend Pod (Node 1) │                     │   Frontend Pod (Node 2) │
        │  React + Nginx Non-Root │                     │  React + Nginx Non-Root │
        │      Liveness: :8080    │                     │      Liveness: :8080    │
        └────────────┬────────────┘                     └────────────┬────────────┘
                     └───────────────────────┬───────────────────────┘
                                             │  Reverse Proxy (/api/*)
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │       Backend Service (ClusterIP)       │
                        │          Internal Port: 3001            │
                        └────────────────────┬────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     ▼                                               ▼
        ┌─────────────────────────┐                     ┌─────────────────────────┐
        │   Backend Pod (Node 1)  │                     │   Backend Pod (Node 2)  │
        │  Node.js + dumb-init    │                     │  Node.js + dumb-init    │
        │  Liveness: /api/health  │                     │  Liveness: /api/health  │
        └────────────┬────────────┘                     └────────────┬────────────┘
                     └───────────────────────┬───────────────────────┘
                                             │  MONGO_URI (Injected via K8s Secret)
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │       MongoDB Service (ClusterIP)       │
                        │          Internal Port: 27017           │
                        └────────────────────┬────────────────────┘
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │      MongoDB StatefulSet (mongodb-0)    │
                        │     Liveness & Readiness: mongo ping    │
                        └────────────────────┬────────────────────┘
                                             │
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │   PersistentVolumeClaim (2Gi Storage)   │
                        │       AccessMode: ReadWriteOnce         │
                        └─────────────────────────────────────────┘
Technology StackDomainTechnologiesRoleFrontendReact, Nginx (Unprivileged)Static asset delivery and /api reverse proxyBackendNode.js, Express, MongooseRESTful API and database connection poolDatabaseMongoDB 4.4Document persistence layerContainerizationDocker, Docker Compose, dumb-initMulti-stage builds, PID 1 handling, local orchestrationCI & DevSecOpsGitHub Actions, Trivy, HadolintAutomated IaC linting, CVE scanning, and image verificationOrchestrationKubernetes (Minikube Multi-Node), Ingress-NginxHigh availability, stateful storage, and edge routingKey Engineering Decisions & Architecture HighlightsPhase 1: 12-Factor Refactoring, Container Hardening & Shift-Left CI12-Factor Compliance: Eliminated hardcoded database URIs and backend IPs. Injected dynamic runtime configurations via environment variables and added dedicated health endpoints (/api/health for Node.js and /healthz for Nginx).Multi-Stage Non-Root Containers: Separated build-time tooling from runtime artifacts to reduce image footprint and attack surface. Both Frontend (UID 101) and Backend (UID 1000) run strictly as unprivileged non-root users.Proper PID 1 Signal Handling: Wrapped the Node.js runtime with dumb-init to ensure proper forwarding of SIGTERM and SIGINT signals for graceful container shutdowns and zombie process reaping.Shift-Left Security Pipeline: Engineered a GitHub Actions CI workflow that gates image builds behind Hadolint (Dockerfile best-practice enforcement) and Trivy (Filesystem Software Composition Analysis for HIGH and CRITICAL CVEs).Phase 2: Production-Grade Multi-Node Kubernetes OrchestrationStateful Data Persistence (StatefulSet vs Deployment): Deployed MongoDB using a StatefulSet with volumeClaimTemplates (2Gi PersistentVolumeClaim) rather than a standard Deployment. This guarantees a predictable network identity (mongodb-0) and sticky persistent storage that survives pod rescheduling and node restarts.Zero-Trust Internal Networking: Restricted MongoDB (27017) and Backend (3001) strictly to internal ClusterIP Services. Only the Frontend is reachable via the Nginx Ingress Controller on port 80.Secrets Management: Abstracted the database connection string (MONGO_URI) into an opaque Kubernetes Secret (backend-secrets) injected at runtime via secretRef.High Availability & Self-Healing: Configured replicas: 2 across a 2-node cluster (control-plane + worker node) with automated livenessProbe and readinessProbe checks to prevent routing traffic to uninitialized containers.Zero-Downtime Rolling Updates: Modernized the React UI into a responsive Dark Mode theme (v1.1.0) and rolled out updates across active replicas without dropping client connections.Repository StructurePlaintext.
├── .github/
│   └── workflows/
│       └── ci.yml                       # Shift-Left CI Pipeline (Trivy, Hadolint, Docker Build)
├── backend/
│   ├── Dockerfile                       # Hardened multi-stage Node.js image (Non-root + dumb-init)
│   ├── models/                          # Mongoose schemas
│   ├── routes/                          # Express REST API & /api/health endpoint
│   └── server.js                        # Application entry point
├── frontend/
│   ├── Dockerfile                       # Multi-stage React build + unprivileged Nginx runtime
│   ├── nginx.conf                       # Reverse proxy (/api -> backend:3001) & /healthz endpoint
│   └── src/                             # React components & modern Dark Mode styling
├── k8s/
│   └── manifests/
│       ├── 01-mongo.yaml                # MongoDB StatefulSet, PVC (2Gi) & ClusterIP Service
│       ├── 02-backend-secret.yaml       # Kubernetes Secret storing MONGO_URI
│       ├── 03-backend-deployment.yaml   # Backend Deployment (2 Replicas + Liveness Probe)
│       ├── 04-backend-service.yaml      # Backend internal ClusterIP Service (:3001)
│       ├── 05-frontend-deployment.yaml  # Frontend Deployment (2 Replicas + Liveness Probe)
│       ├── 06-frontend-service.yaml     # Frontend internal ClusterIP Service (:8080)
│       └── 07-ingress.yaml              # Nginx Ingress routing rules (todo-app.local)
├── docker-compose.yml                   # Local single-host orchestration with health condition gates
└── README.md                            # Project documentation
Getting Started & Reproduction GuideOption A: Local Development (Docker Compose)Clone the repository:Bashgit clone [https://github.com/SamehYahia/three_tier_nodejs_app.git](https://github.com/SamehYahia/three_tier_nodejs_app.git)
cd three_tier_nodejs_app
Build and start the stack:Bashdocker compose up --build -d
Verify container health:Bashdocker compose ps
curl -s http://localhost:3001/api/health
Option B: Multi-Node Kubernetes Deployment (Minikube)Provision a 2-Node Cluster and Enable Ingress:Bashminikube start --nodes 2 --driver=docker --memory=3072 --cpus=2
minikube addons enable ingress
Deploy the Persistence, Backend, Frontend, and Ingress Manifests:Bashkubectl apply -f k8s/manifests/
Verify Cluster State and Pod Distribution:Bashkubectl get nodes -o wide
kubectl get pods -o wide
kubectl get pvc,svc,ingress
Validate Internal Backend-to-DB Connectivity:Bashkubectl run curl-test --image=curlimages/curl -i --rm --restart=Never -- \
  curl -s http://backend:3001/api/health
# Expected output: {"status":"UP","db":"connected"}
Configure Local DNS Resolution:
Retrieve the Ingress IP from kubectl get ingress and map it to todo-app.local:Bashecho "$(minikube ip) todo-app.local" | sudo tee -a /etc/hosts
Access the Application:
Navigate to http://todo-app.local in your browser.Executing a Zero-Downtime Rolling UpdateTo deploy a new frontend release without downtime:Bashdocker build -t samehyahia/todo-frontend:v1.1.0 ./frontend
docker push samehyahia/todo-frontend:v1.1.0

kubectl set image deployment/frontend frontend=samehyahia/todo-frontend:v1.1.0
kubectl rollout status deployment/frontend
Roadmap[x] Phase 1: 12-Factor Refactoring, Hardened Multi-Stage Dockerfiles, Docker Compose, GitHub Actions DevSecOps CI.[x] Phase 2: Multi-Node Kubernetes Orchestration (StatefulSet, PVC, Secrets, ClusterIP, Ingress, Rolling Updates).[ ] Phase 3: Infrastructure as Code (Terraform) & Cloud Deployment on AWS EKS.AuthorSameh Yahia — DevOps & Cloud EngineerGitHub: @SamehYahiaDocker Hub: samehyahia
