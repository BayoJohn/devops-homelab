# DevOps Homelab - Production Infrastructure

> A complete, production-grade DevOps platform built from scratch with self-hosted CI/CD, monitoring, and cloud deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Drone-blue)](https://www.drone.io/)

## 🚀 Overview

This project demonstrates a complete DevOps infrastructure platform built entirely from scratch over three weeks. It includes self-hosted Git, automated CI/CD pipelines, container registry, secrets management, monitoring, logging, and production deployment to Oracle Cloud.

**Live Demo:** [Portfolio Website](http://your-site-url)  
**Blog Post:** [Complete Journey](http://your-blog-post-url)

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HOMELAB (8GB)                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Monitoring Stack:                                      │
│  ├── Prometheus (9090) - Metrics Collection            │
│  ├── Grafana (3000) - Visualization                    │
│  ├── Node Exporter (9100) - System Metrics             │
│  └── Loki + Promtail - Centralized Logging             │
│                                                         │
│  Git Server:                                            │
│  ├── Gitea (3001) - Self-hosted Git                    │
│  └── PostgreSQL - Database                             │
│                                                         │
│  CI/CD Pipeline:                                        │
│  ├── Drone Server (8080) - Orchestration               │
│  └── Drone Runner - Build Execution                    │
│                                                         │
│  Container Registry:                                    │
│  └── Harbor (80) - Private Registry + Trivy Scanning   │
│                                                         │
│  Infrastructure:                                        │
│  ├── Vault - Secrets Management                        │
│  └── WireGuard - VPN Tunnel (10.0.0.1)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↕
                   WireGuard VPN
                          ↕
┌─────────────────────────────────────────────────────────┐
│                 ORACLE CLOUD (FREE TIER)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Production:                                            │
│  ├── Portfolio Website (Flask)                         │
│  ├── Portainer - Container Management                  │
│  └── WireGuard Client (10.0.0.2)                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## ✨ Features

### Infrastructure Components
- **Self-Hosted Git Server** - Gitea with PostgreSQL backend
- **Automated CI/CD** - Drone CI with custom pipelines
- **Container Registry** - Harbor with vulnerability scanning
- **Secrets Management** - HashiCorp Vault with KV store
- **Monitoring Stack** - Prometheus + Grafana + Node Exporter
- **Centralized Logging** - Loki + Promtail
- **VPN Tunnel** - WireGuard homelab ↔ cloud connectivity
- **Cloud Deployment** - Oracle Cloud free tier
- **Container Management** - Portainer for cloud infrastructure

### Key Capabilities
- ✅ **Complete Automation** - Git push → Production in 3 minutes
- ✅ **Zero Manual Steps** - Fully automated deployment pipeline
- ✅ **Production Ready** - Real traffic, monitoring, and security
- ✅ **Self-Hosted** - Complete infrastructure ownership
- ✅ **Secure by Default** - Firewall, Fail2Ban, secrets management
- ✅ **Observable** - Comprehensive monitoring and logging

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker, Docker Compose | Container orchestration |
| **Git Server** | Gitea | Self-hosted version control |
| **Database** | PostgreSQL | Gitea backend storage |
| **CI/CD** | Drone CI | Automated build and deployment |
| **Registry** | Harbor | Private container registry |
| **Secrets** | Vault | Centralized secrets management |
| **Monitoring** | Prometheus, Grafana | Metrics and visualization |
| **Logging** | Loki, Promtail | Log aggregation |
| **VPN** | WireGuard | Secure tunnel homelab ↔ cloud |
| **Cloud** | Oracle Cloud | Production hosting |
| **Security** | UFW, Fail2Ban | Firewall and intrusion prevention |

## 📁 Repository Structure

```
devops-homelab/
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── provisioning/
│   └── docker-compose.yml
│
├── cicd/
│   ├── gitea/
│   │   └── docker-compose.yml
│   ├── drone/
│   │   └── docker-compose.yml
│   └── harbor/
│       └── docker-compose.yml
│
├── apps/
│   ├── sample-app/
│   │   ├── app.js
│   │   ├── Dockerfile
│   │   └── .drone.yml
│   └── portfolio-website/
│       ├── app/
│       ├── Dockerfile
│       └── .drone.yml
│
├── scripts/
│   ├── health-check.sh
│   ├── restart-all.sh
│   └── backup.sh
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TROUBLESHOOTING.md
│   ├── DEPLOYMENT.md
│   └── problems-and-solutions/
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Linux system (Ubuntu 24.04 recommended)
- Docker and Docker Compose installed
- Minimum 8GB RAM
- 50GB free disk space

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devops-homelab.git
   cd devops-homelab
   ```

2. **Start Monitoring Stack**
   ```bash
   cd monitoring
   docker-compose up -d
   ```

3. **Start Gitea**
   ```bash
   cd ../cicd/gitea
   docker-compose up -d
   ```

4. **Start Drone CI**
   ```bash
   cd ../drone
   # Update environment variables in docker-compose.yml
   docker-compose up -d
   ```

5. **Access Services**
   - Grafana: http://localhost:3000 (admin/admin)
   - Gitea: http://localhost:3001
   - Drone: http://localhost:8080
   - Prometheus: http://localhost:9090

### Configuration

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed setup instructions.

## 📖 Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)** - Detailed system design
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step setup
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Problems & Solutions](docs/problems-and-solutions/)** - All 11 problems documented

## 🎯 CI/CD Pipeline

### Workflow

```
Developer commits code
        ↓
Gitea webhook triggers Drone
        ↓
Drone Runner executes pipeline:
  1. Clone repository (custom step)
  2. Run tests (npm test)
  3. Build Docker image
  4. Push to Harbor registry
        ↓
SSH to Oracle Cloud via WireGuard
        ↓
Deploy to production:
  1. Pull image from Harbor
  2. Stop old container
  3. Start new container
  4. Health check verification
        ↓
Logs → Loki
Metrics → Prometheus
        ↓
Production (3 minutes total)
```

### Example Pipeline

```yaml
kind: pipeline
type: docker
name: deploy

clone:
  disable: true

steps:
  - name: clone
    image: alpine/git
    commands:
      - git clone http://172.17.0.1:3001/bayo/sample-app.git .
      - git checkout $DRONE_COMMIT

  - name: test
    image: node:18-alpine
    commands:
      - npm install
      - npm test

  - name: build-and-push
    image: plugins/docker
    settings:
      registry: 172.16.18.128:8888
      repo: 172.16.18.128:8888/library/sample-app
      tags:
        - latest
        - build-${DRONE_BUILD_NUMBER}
      username: admin
      password:
        from_secret: harbor_password
      insecure: true
```

## 🔧 Key Problems Solved

During this project, I encountered and solved 11 critical infrastructure problems:

1. **Hardware Constraints** - Migrated from 4GB to 8GB system
2. **Database Password Mismatch** - Docker volume persistence issue
3. **Nested Git Repositories** - Repository structure conflict
4. **Docker Networking** - Container isolation and bridge IP discovery
5. **YAML Syntax Errors** - Data type mismatches in CI/CD config
6. **Webhook Configuration** - Branch naming and URL issues
7. **Drone Runner Connection** - Service name vs localhost
8. **Git Clone in Pipeline** - Custom clone step requirement
9. **CI Authentication** - Non-interactive auth implementation
10. **Container Crash Loop** - Entry point configuration mismatch
11. **Cloud Firewall** - Oracle Cloud security configuration

**Full details:** [docs/problems-and-solutions/](docs/problems-and-solutions/)

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Containers** | 18+ |
| **Services Running** | 13 |
| **Configuration Files** | 20+ |
| **Lines of YAML** | 500+ |
| **Development Time** | ~48 hours over 3 weeks |
| **Debugging Time** | ~18 hours (37%) |
| **Problems Solved** | 11/11 (100%) |
| **Deployment Time** | 3 minutes (automated) |
| **Manual Steps** | 0 |

## 🔐 Security Features

- **Firewall** - UFW configured with minimal open ports
- **Fail2Ban** - Automatic IP blocking for suspicious activity
- **Secrets Management** - Vault for credential storage
- **VPN Tunnel** - Encrypted WireGuard connection
- **Private Registry** - Harbor with authentication
- **Security Scanning** - Trivy vulnerability detection
- **Attack Monitoring** - Prometheus alerts for unusual patterns

### Production Security Hardening

Within 5 minutes of going live, the site was under automated attack. Security measures implemented:

- Port-based firewall rules (UFW)
- Fail2Ban for brute force protection
- Rate limiting (planned)
- HTTPS with Let's Encrypt (planned)
- Regular security updates

## 📈 Monitoring & Observability

### Metrics Collection
- **Prometheus** - Scrapes metrics from all services
- **Node Exporter** - System-level metrics (CPU, memory, disk)
- **Grafana Dashboards** - Visual representation of system health

### Logging
- **Loki** - Centralized log aggregation
- **Promtail** - Log shipping from all containers
- **Grafana Integration** - Unified metrics and logs

### Alerting
- **Alert Manager** - Prometheus alert routing
- **Custom Alerts** - High error rates, resource exhaustion
- **Notification Channels** - Email/Slack integration (planned)

## 🌐 Production Deployment

### Oracle Cloud Setup

Infrastructure deployed to Oracle Cloud free tier:
- **Instance:** VM.Standard.E2.1.Micro
- **RAM:** 6GB
- **OS:** Ubuntu 24.04
- **Networking:** WireGuard VPN tunnel to homelab
- **Access:** Public IP with firewall configuration

### Deployment Process

1. Code pushed to Gitea
2. Webhook triggers Drone pipeline
3. Tests execute in fresh container
4. Docker image built and pushed to Harbor
5. SSH deployment to Oracle Cloud
6. Zero-downtime rolling update
7. Health checks verify deployment
8. Logs and metrics collected

**Average deployment time:** 3 minutes  
**Success rate:** 100% (after initial debugging)

## 🎓 Lessons Learned

### Technical Skills Acquired
- Docker networking and container isolation
- CI/CD pipeline design and debugging
- YAML syntax and configuration management
- Infrastructure monitoring and logging
- Cloud deployment and VPN configuration
- Security hardening and attack mitigation

### Key Takeaways
1. **Docker Networking** - `localhost` inside container ≠ host machine
2. **YAML Strictness** - Data types must match exactly
3. **State Persistence** - Docker volumes retain data across restarts
4. **Security Priority** - Attacks begin immediately upon public exposure
5. **Systematic Debugging** - Methodical approach beats trial and error
6. **Documentation Value** - Record solutions for future reference

## 🔄 Future Enhancements

### Short-Term
- [ ] Add HTTPS with Let's Encrypt
- [ ] Implement Nginx reverse proxy with rate limiting
- [ ] Configure automatic backups
- [ ] Add custom Grafana dashboards
- [ ] Implement blue-green deployments

### Long-Term
- [ ] Migrate to Kubernetes (K3s)
- [ ] Implement GitOps with ArgoCD
- [ ] Add Terraform for infrastructure as code
- [ ] Multi-cloud deployment (AWS, GCP)
- [ ] Service mesh implementation (Istio/Linkerd)

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Bayo**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [your-website.com](http://your-website.com)
- Blog: [Blog Post](http://your-blog-url)

## 🙏 Acknowledgments

- Docker, Gitea, Drone CI, Harbor, and Prometheus communities for excellent documentation
- Stack Overflow contributors for debugging insights
- Oracle Cloud for free tier infrastructure

## ⭐ Star History

If you found this project helpful, please consider giving it a star!

---

**Built with** 🔧 **by Bayo** | **Deployed with** ⚡ **Drone CI** | **Monitored with** 📊 **Prometheus + Grafana**
