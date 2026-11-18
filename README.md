# 🚀 Production-Grade 3-Tier Node.js & React Application | DevOps Modernization

![DevOps](https://img.shields.io/badge/DevOps-Production--Grade-blue)
![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Multi--Node-326CE5?logo=kubernetes&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![Security](https://img.shields.io/badge/Security-Trivy%20%7C%20Hadolint-green)
![Status](https://img.shields.io/badge/Project-Phase_2_Completed-success)

A production-oriented DevOps modernization of a legacy **3-Tier Todo Application** built with React, Node.js/Express, and MongoDB.

This project demonstrates the complete transformation of a traditional application into a containerized, security-hardened, and Kubernetes-orchestrated environment.

The implementation focuses on **Infrastructure Reliability, Container Security, Shift-Left CI/CD, High Availability, Persistent Storage, and Zero-Downtime Rolling Updates**.

The project is being developed incrementally, with local Kubernetes deployment completed and AWS EKS migration planned as the next phase.

---

## 📌 Table of Contents

- [🚀 Production-Grade 3-Tier Node.js \& React Application | DevOps Modernization](#-production-grade-3-tier-nodejs--react-application--devops-modernization)
  - [📌 Table of Contents](#-table-of-contents)
  - [🎯 Project Overview](#-project-overview)
    - [Application Architecture](#application-architecture)
    - [Key Engineering Objectives](#key-engineering-objectives)
  - [🏗️ Architecture Overview](#️-architecture-overview)
    - [Kubernetes Architecture](#kubernetes-architecture)
    - [Request Flow](#request-flow)
  - [🛠️ Technology Stack](#️-technology-stack)
    - [Container Images](#container-images)
  - [🚧 Project Implementation](#-project-implementation)
    - [✅ Phase 1: Containerization \& Shift-Left CI/CD](#-phase-1-containerization--shift-left-cicd)
      - [1. Twelve-Factor App Configuration](#1-twelve-factor-app-configuration)
      - [2. Hardened Multi-Stage Docker Builds](#2-hardened-multi-stage-docker-builds)
      - [3. Local Container Orchestration](#3-local-container-orchestration)
      - [4. Automated Shift-Left CI Pipeline](#4-automated-shift-left-ci-pipeline)
    - [✅ Phase 2: Production-Grade Kubernetes Orchestration](#-phase-2-production-grade-kubernetes-orchestration)
      - [1. Multi-Node Kubernetes Cluster](#1-multi-node-kubernetes-cluster)
      - [2. Persistent Database Architecture](#2-persistent-database-architecture)
      - [3. High Availability \& Self-Healing](#3-high-availability--self-healing)
      - [4. Security \& Network Isolation](#4-security--network-isolation)
      - [5. Ingress \& External Access](#5-ingress--external-access)
      - [6. Zero-Downtime Rolling Updates](#6-zero-downtime-rolling-updates)
    - [🔜 Phase 3: Infrastructure as Code \& AWS Cloud Deployment](#-phase-3-infrastructure-as-code--aws-cloud-deployment)
  - [🔐 Security Implementation](#-security-implementation)
  - [📁 Repository Structure](#-repository-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Option 1: Local Deployment with Docker Compose](#option-1-local-deployment-with-docker-compose)
    - [Option 2: Multi-Node Kubernetes Deployment](#option-2-multi-node-kubernetes-deployment)
  - [🔍 Verification \& Troubleshooting](#-verification--troubleshooting)
  - [💡 Key DevOps Engineering Decisions](#-key-devops-engineering-decisions)
  - [🛣️ Future Improvements](#️-future-improvements)
  - [👨‍💻 Author](#-author)
  - [⭐ Support](#-support)

---

## 🎯 Project Overview

The objective of this project is to modernize a traditional three-tier application by introducing production-oriented DevOps practices.

### Application Architecture

| Tier | Technology | Responsibility |
|---|---|---|
| Presentation | React + Nginx | User interface and API reverse proxy |
| Application | Node.js + Express | REST API and business logic |
| Database | MongoDB | Persistent application data |

### Key Engineering Objectives

- Containerize frontend and backend applications using optimized multi-stage Docker builds.
- Reduce container attack surfaces by running workloads as non-root users.
- Implement automated Dockerfile linting and vulnerability scanning.
- Introduce health checks and service dependency management.
- Deploy workloads across a multi-node Kubernetes cluster.
- Implement persistent database storage using StatefulSets and PVCs.
- Enable application self-healing through Kubernetes probes.
- Secure application configuration using Kubernetes Secrets.
- Expose the application through an Nginx Ingress Controller.
- Perform rolling updates while maintaining application availability.

---

## 🏗️ Architecture Overview

The application follows a three-tier architecture deployed on a multi-node Kubernetes cluster.

### Kubernetes Architecture

```text
                    External Traffic
                 http://todo-app.local
                           |
                           v
                +------------------------+
                | Nginx Ingress Controller|
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Frontend ClusterIP      |
                | Service :8080           |
                +-----------+------------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
          +-------------+       +-------------+
          | Frontend    |       | Frontend    |
          | Pod 1       |       | Pod 2       |
          | Nginx       |       | Nginx       |
          +------+------+       +------+------+
                 |                     |
                 +----------+----------+
                            |
                     /api/* Proxy
                            |
                            v
                +------------------------+
                | Backend ClusterIP      |
                | Service :3001          |
                +-----------+------------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
          +-------------+       +-------------+
          | Backend     |       | Backend     |
          | Pod 1       |       | Pod 2       |
          | Node.js     |       | Node.js     |
          +------+------+       +------+------+
                 |                     |
                 +----------+----------+
                            |
                       MONGO_URI
                     (K8s Secret)
                            |
                            v
                +------------------------+
                | MongoDB ClusterIP      |
                | Service :27017         |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | MongoDB StatefulSet    |
                | mongo-0                |
                | PVC: 2Gi               |
                +------------------------+
```

### Request Flow

1. External traffic reaches the Nginx Ingress Controller.
2. Ingress forwards requests to the Frontend ClusterIP Service.
3. The Frontend Service distributes traffic across available Nginx Pods.
4. Nginx serves the React application and proxies `/api/*` requests to the Backend Service.
5. The Backend Service distributes requests across Node.js replicas.
6. Backend Pods retrieve database connection configuration from Kubernetes Secrets.
7. MongoDB runs as a StatefulSet with persistent storage.

**Design Principle:** The database is not exposed externally. Application-to-database communication happens through internal Kubernetes networking.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Nginx |
| Backend | Node.js, Express.js |
| Database | MongoDB 4.4 |
| Containerization | Docker, Multi-Stage Builds, Docker Compose |
| Container Runtime | containerd |
| Container Security | Non-Root Users, dumb-init |
| CI/CD | GitHub Actions |
| Dockerfile Linting | Hadolint |
| Vulnerability Scanning | Trivy |
| Orchestration | Kubernetes, Minikube |
| Networking | ClusterIP, Nginx Ingress Controller |
| Storage | StatefulSet, PersistentVolumeClaim |
| Configuration Management | Environment Variables, Kubernetes Secrets |
| Container Registry | Docker Hub |

### Container Images

| Component | Docker Hub Image |
|---|---|
| Backend | `samehyahia/todo-backend` |
| Frontend | `samehyahia/todo-frontend` |

---

## 🚧 Project Implementation

### ✅ Phase 1: Containerization & Shift-Left CI/CD

**Status: Completed**

#### 1. Twelve-Factor App Configuration

Refactored application configuration to eliminate hardcoded environment-specific values.

- Externalized configuration using environment variables.
- Implemented dedicated health check endpoints.
- Backend health endpoint: `/api/health`
- Frontend health endpoint: `/healthz`

#### 2. Hardened Multi-Stage Docker Builds

Implemented optimized Dockerfiles for both application tiers.

**Backend:**
- Multi-stage Docker build.
- Separated build dependencies from runtime dependencies.
- Non-root execution using UID 1000.
- Integrated `dumb-init` for proper PID 1 signal handling.
- Reduced unnecessary runtime dependencies.

**Frontend:**
- Multi-stage React build.
- Nginx-based production runtime.
- Non-root execution using an unprivileged Nginx configuration.
- Custom Nginx configuration for frontend routing, API reverse proxying, and health checks.

#### 3. Local Container Orchestration

Implemented Docker Compose to manage the application stack.

Key configurations:

- Isolated application networks.
- Service dependency management.
- Health-check-based startup ordering.
- Environment-based configuration.
- Persistent database storage.

#### 4. Automated Shift-Left CI Pipeline

Created a GitHub Actions workflow:

`.github/workflows/ci.yml`

Pipeline responsibilities:

| Stage | Tool | Purpose |
|---|---|---|
| Linting | Hadolint | Validate Dockerfile best practices |
| Security Scanning | Trivy | Identify HIGH and CRITICAL vulnerabilities |
| Image Build | Docker | Build frontend and backend images |

The pipeline introduces security validation early in the development lifecycle, helping identify container-related issues before deployment.

---

### ✅ Phase 2: Production-Grade Kubernetes Orchestration

**Status: Completed**

Deployed the application across a two-node local Kubernetes cluster using Minikube.

#### 1. Multi-Node Kubernetes Cluster

Configured a two-node environment:

- One Control Plane node.
- One dedicated Worker node.
- Docker-based Minikube driver.
- Nginx Ingress Controller.

This environment demonstrates workload scheduling and distribution across multiple Kubernetes nodes.

#### 2. Persistent Database Architecture

Deployed MongoDB using a Kubernetes StatefulSet.

Implementation includes:

- StatefulSet workload management.
- `volumeClaimTemplates` for dynamic PVC provisioning.
- 2Gi PersistentVolumeClaim.
- ReadWriteOnce access mode.
- Stable Pod network identity.
- Persistent database storage across Pod restarts.

**Why StatefulSet?**

Unlike stateless application workloads, databases require stable identities and persistent storage. StatefulSets provide these capabilities.

#### 3. High Availability & Self-Healing

Deployed frontend and backend using Kubernetes Deployments.

| Component | Replicas | Health Checks |
|---|---:|---|
| Frontend | 2 | Liveness + Readiness |
| Backend | 2 | Liveness + Readiness |
| MongoDB | 1 | StatefulSet |

Implemented:

- Multiple application replicas.
- Liveness probes for container health monitoring.
- Readiness probes for traffic eligibility.
- Kubernetes self-healing and Pod replacement.
- Service-based load distribution.

#### 4. Security & Network Isolation

Implemented Kubernetes-native configuration and service exposure controls.

- Database credentials and connection configuration stored in Kubernetes Secrets.
- Backend accessed internally through ClusterIP.
- MongoDB accessed internally through ClusterIP.
- No direct external exposure of database services.
- Non-root container execution.

#### 5. Ingress & External Access

Configured Nginx Ingress Controller to expose the application.

**Application URL:**

`http://todo-app.local`

Ingress routes external HTTP traffic to the Frontend Service, while Nginx handles API reverse proxying to the Backend Service.

#### 6. Zero-Downtime Rolling Updates

Performed an application update from `v1.0.0` to `v1.1.0`.

Implementation:

- Updated the React frontend with a Dark Mode UI.
- Changed the frontend container image using `kubectl set image`.
- Leveraged Kubernetes rolling update strategy.
- Maintained multiple frontend replicas during rollout.
- Verified application availability during deployment.

This demonstrated rolling deployment behavior without observed service interruption in the local environment.

---

### 🔜 Phase 3: Infrastructure as Code & AWS Cloud Deployment

**Status: Planned**

The next phase focuses on migrating the local Kubernetes environment to AWS.

Planned implementation:

**Infrastructure Provisioning**
- Terraform for Infrastructure as Code.
- AWS VPC architecture.
- Public and private subnets.
- Multi-AZ networking.
- IAM roles and policies.
- Amazon EKS cluster provisioning.

**Container Registry**
- Migration from Docker Hub to Amazon ECR.
- Image tagging and version management.

**Kubernetes Deployment**
- Migration of Kubernetes manifests to Amazon EKS.
- Cloud-based workload deployment.
- AWS-native networking and security integration.

**CI/CD Modernization**
- Extend GitHub Actions workflows.
- Automate container image publishing.
- Implement automated deployment to EKS.
- Introduce environment-specific deployment configurations.

---

## 🔐 Security Implementation

Security is integrated throughout the development and deployment lifecycle.

| Security Control | Implementation |
|---|---|
| Container User Security | Non-root users |
| Image Optimization | Multi-stage Docker builds |
| Process Management | dumb-init |
| Dockerfile Quality | Hadolint |
| Vulnerability Management | Trivy |
| Configuration Security | Environment Variables |
| Database Configuration | Kubernetes Secrets |
| Database Exposure | Internal ClusterIP |
| Application Health | Liveness and Readiness Probes |

**Security Note:** Kubernetes Secrets provide configuration abstraction but are not automatically encrypted at rest. Production deployment should include encryption at rest, restricted RBAC access, and a dedicated secrets management solution.

---

## 📁 Repository Structure

```text
three_tier_nodejs_app/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── Dockerfile
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│
├── k8s/
│   └── manifests/
│       ├── 01-mongo.yaml
│       ├── 02-backend-secret.yaml
│       ├── 03-backend-deployment.yaml
│       ├── 04-backend-service.yaml
│       ├── 05-frontend-deployment.yaml
│       ├── 06-frontend-service.yaml
│       └── 07-ingress.yaml
│
├── docker-compose.yml
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed:

- Git
- Docker Engine
- Docker Compose
- kubectl
- Minikube

---

### Option 1: Local Deployment with Docker Compose

**1. Clone the repository**

```bash
git clone https://github.com/SamehYahia/three_tier_nodejs_app.git

cd three_tier_nodejs_app
```

**2. Build and start the application**

```bash
docker compose up --build -d
```

**3. Verify running containers**

```bash
docker compose ps
```

**4. Inspect application logs**

```bash
docker compose logs -f
```

**5. Stop the application**

```bash
docker compose down
```

---

### Option 2: Multi-Node Kubernetes Deployment

**1. Start a two-node Minikube cluster**

```bash
minikube start \
  --nodes 2 \
  --driver=docker \
  --memory=3072 \
  --cpus=2
```

**2. Verify cluster nodes**

```bash
kubectl get nodes -o wide
```

**3. Enable Nginx Ingress**

```bash
minikube addons enable ingress
```

**4. Apply Kubernetes manifests**

```bash
kubectl apply -f k8s/manifests/
```

**5. Verify deployed workloads**

```bash
kubectl get pods -o wide
```

```bash
kubectl get deployments
```

```bash
kubectl get svc,ingress,pvc
```

**6. Verify deployment rollout**

```bash
kubectl rollout status deployment/frontend
```

```bash
kubectl rollout status deployment/backend
```

**7. Configure local DNS resolution**

Retrieve the Ingress IP:

```bash
kubectl get ingress
```

Add the returned address to `/etc/hosts`:

```bash
echo "<INGRESS_IP> todo-app.local" | sudo tee -a /etc/hosts
```

Replace `<INGRESS_IP>` with the actual Ingress address.

**8. Access the application**

Open your browser:

```text
http://todo-app.local
```

---

## 🔍 Verification & Troubleshooting

Useful Kubernetes commands for validating the deployment.

**Inspect Pods:**

```bash
kubectl get pods -o wide
```

**Inspect Services:**

```bash
kubectl get svc
```

**Inspect Ingress:**

```bash
kubectl describe ingress
```

**Inspect Persistent Volumes:**

```bash
kubectl get pv,pvc
```

**Inspect Pod Events:**

```bash
kubectl describe pod <POD_NAME>
```

**Inspect Application Logs:**

```bash
kubectl logs <POD_NAME>
```

**Follow Logs in Real Time:**

```bash
kubectl logs -f <POD_NAME>
```

**Check Deployment History:**

```bash
kubectl rollout history deployment/frontend
```

**Rollback a Deployment:**

```bash
kubectl rollout undo deployment/frontend
```

---

## 💡 Key DevOps Engineering Decisions

| Engineering Decision | Why It Matters |
|---|---|
| Multi-Stage Docker Builds | Smaller and more focused runtime images |
| Non-Root Containers | Reduced container privileges |
| dumb-init | Correct signal forwarding and process reaping |
| Docker Compose Health Checks | Improved local service startup coordination |
| GitHub Actions | Automated CI validation |
| Hadolint | Dockerfile quality enforcement |
| Trivy | Early vulnerability detection |
| Kubernetes Deployments | Declarative stateless workload management |
| StatefulSet | Stable database identity |
| PersistentVolumeClaims | Data persistence |
| Readiness Probes | Prevent traffic from reaching unready Pods |
| Liveness Probes | Detect unhealthy containers |
| ClusterIP Services | Internal service communication |
| Ingress Controller | Centralized HTTP routing |
| Rolling Updates | Controlled application version transitions |

---

## 🛣️ Future Improvements

The project will continue evolving toward a more complete production-grade platform.

- [ ] Provision AWS infrastructure using Terraform.
- [ ] Deploy workloads to Amazon EKS.
- [ ] Migrate container images to Amazon ECR.
- [ ] Implement automated Continuous Deployment.
- [ ] Integrate Helm for Kubernetes package management.
- [ ] Implement HashiCorp Vault or AWS Secrets Manager.
- [ ] Introduce Prometheus and Grafana monitoring.
- [ ] Implement centralized logging.
- [ ] Configure Kubernetes RBAC and NetworkPolicies.
- [ ] Add resource requests, limits, and PodDisruptionBudgets.
- [ ] Introduce automated integration and end-to-end testing.
- [ ] Implement database backup and recovery procedures.

---

## 👨‍💻 Author

**Sameh Yahia**

DevOps & Cloud Engineer | AWS | Docker | Kubernetes | Terraform | CI/CD

- GitHub: [@SamehYahia](https://github.com/SamehYahia)
- Docker Hub: [samehyahia](https://hub.docker.com/u/samehyahia)
- LinkedIn: [Sameh Yahia](https://www.linkedin.com/in/sameh-yahia/)

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Contributions, suggestions, and technical discussions are welcome.

**Building reliable infrastructure, one deployment at a time.**