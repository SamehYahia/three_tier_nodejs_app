## Phase 1: Containerization & CI/CD (Completed)
- **12-Factor Refactoring**: Abstracted hardcoded configs to environment variables and added `/api/health` endpoints.
- **Hardened Containers**: Implemented Multi-Stage Docker builds. Images run as `non-root` users, with `dumb-init` managing PID 1 in the backend, and an unprivileged `Nginx` reverse proxy for the frontend.
- **Local Orchestration**: Configured `docker-compose.yml` with strict dependency mapping (`service_healthy`) and isolated networks.
- **Shift-Left CI Pipeline**: Built a GitHub Actions workflow integrating `Hadolint` and `Trivy (FS)` to gate builds on linting standards and critical vulnerabilities.
