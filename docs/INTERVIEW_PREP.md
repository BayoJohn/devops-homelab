# 🎓 Homelab Project: Interview Study Guide

This guide is designed to help you articulate the technical depth, architectural decisions, and problem-solving journey of your homelab project during interviews.

---

## 1. 🎤 The Elevator Pitch

### For a Technical Interviewer (e.g., Senior DevOps Engineer)
> "I built a production-grade Kubernetes homelab hosted on Oracle Cloud, managed entirely via a GitOps workflow. The system uses K3s for orchestration and ArgoCD for continuous delivery, pulling from a self-hosted Gitea/Drone CI/CD stack. I’ve integrated advanced reliability features like Chaos Mesh for fault injection and a custom Python-based auto-recovery webhook that triggers rollbacks during deployment failures. I’ve optimized the end-to-end pipeline to run in under 30 seconds."

### For a Manager/Lead (High-Level)
> "I developed a self-healing infrastructure platform that focuses on automation and reliability. By transitioning from Docker Compose to a Kubernetes-GitOps model, I achieved an 83% improvement in deployment speed and implemented automated recovery systems. The project demonstrates my ability to manage complex networking (VPN tunnels), secure secrets management, and proactive observability in a cloud-native environment."

---

## 2. 🛠️ Tool Selection: The "Why"

| Tool | Rationale | Internal "Pro-Tip" to mention |
|---|---|---|
| **K3s (Kubernetes)** | Selected for its low resource footprint (ideal for free-tier ARM instances) while providing full K8s API compatibility. | "I chose K3s because it packages components like Traefik and Local Storage, allowing me to focus on app orchestration rather than control plane overhead." |
| **ArgoCD** | Implements the **GitOps 'Pull' model**, ensuring the cluster state always matches the Git repository. | "GitOps eliminates configuration drift. If someone manually edits a deployment on the cluster, ArgoCD detects it immediately and syncs it back to the 'Source of Truth' in Git." |
| **Gitea + Drone CI** | Self-hosted alternatives to GitHub/GitHub Actions that provide full data sovereignty. | "I use Drone because its container-native architecture simplifies pipeline debugging—every step is just a Docker image." |
| **WireGuard** | Provides a secure, encrypted tunnel between the local lab (storage/build) and the public cloud (runtime). | "I implemented WireGuard to keep my build artifacts (Harbor) and source code (Gitea) private while still allowing the public cluster to reach them securely." |
| **Chaos Mesh** | Used to prove system resilience through fault injection. | "Reliability isn't a guess; it's a metric. I use Chaos Mesh to verify that my HPA and self-healing logic actually work under stress." |

---

## 3. 🧠 My Systematic Debugging Framework

**Interviewer asks: "How do you approach a complex technical problem?"**

1.  **Isolate the Layer**: "I determine if the failure is at the **Application**, **Container**, or **Network** layer. If a service is down, I first check the binary logs, then the container health, and finally the network port reachability."
2.  **Deep-Dive Logs**: "I look beyond the 'Error' message for the stack trace. I use `docker logs` for container-level issues and `kubectl describe` or `journalctl` for infrastructure-level failures."
3.  **Connectivity Validation**: "I use a 'Bottom-Up' approach: `ping` for basic reachability, `nc` or `telnet` for port validation, and `curl` for application response testing."
4.  **Isolate & Iterate**: "I change one variable at a time (e.g., an environment variable or a firewall rule) and verify the result immediately. This prevents the 'fixing one thing but breaking another' trap."

---

## 4. 🛡️ Hero Stories: Problem-Solving (STAR Method)

### Story 1: The Networking & VPN Resilience (WireGuard)
*   **Situation**: The connection between my local build server (Gitea/Drone) and the Oracle Cloud K3s cluster was unstable, frequently dropping after node reboots.
*   **Root Cause**: I was manually assigning WireGuard IPs, which wasn't persistent.
*   **Action**: I initially wrote a **Bash watchdog script** to monitor and restart the interface, but later migrated to a **native systemd service** (`wg-quick@wg0`) for a production-grade solution.
*   **Result**: 100% stable VPN tunnel and automated recovery on boot.

### Story 2: Drone-Gitea Connectivity & The "Localhost" Trap
*   **Situation**: My Drone CI runner couldn't reach Gitea, even though they were on the same host.
*   **Root Cause**: I was using `localhost:3001`. In a container, `localhost` refers to the container itself, not the host machine.
*   **Action**: I identified the **Docker bridge IP (172.17.0.1)** and updated my configurations.
*   **Result**: Reliable cross-service communication and a deep understanding of container network namespaces.

### Story 3: Resource Management & Port Conflicts
*   **Situation**: After installing the Prometheus monitoring stack, the `node-exporter` pods went into a `CrashLoopBackOff`.
*   **Root Cause**: A standalone `node-exporter` Docker container was already running on the same port (9100).
*   **Action**: I used `netstat -tulpn` to identify the conflict and decommissioned the legacy container in favor of the K8s DaemonSet.
*   **Result**: Unified monitoring and resolved resource contention.

### Story 4: Security & Git History Sanitization
*   **Situation**: I accidental committed a live Slack Webhook URL to a public repository.
*   **Action**: I revoked the token, used `git filter-repo` to scrub the secret from the entire commit history, and migrated all secrets to **Kubernetes Secrets**.
*   **Result**: Restored security and implemented a "Secrets-First" architecture.

---

## 5. 🚀 The Migration Journey: Docker to Kubernetes

**Interviewer asks: "Tell me about a difficult migration."**

> "One of the biggest challenges was migrating **stateful components** like PostgreSQL from Docker Volumes to Kubernetes **Persistent Volumes**. I had to ensure data integrity during the move. I validated the entire transition by running side-by-side environments before cutting over traffic via the **Traefik Ingress**. This move improved my platform's resilience and enabled automated horizontal scaling (HPA) that wasn't possible with Docker Compose."

---

## 6. 🦾 Advanced Reliability: Auto-Recovery & Chaos

**Interviewer asks: "How do you ensure 99.9% availability?"**

- **Chaos Engineering**: "I use **Chaos Mesh** to inject 'Pod Kill' experiments. It validates that my Kubernetes self-healing and HPA logic actually work under fire before a real outage happens."
- **Auto-Recovery Webhook**: "I built a custom Python microservice that listens for `KubePodCrashLooping` alerts. It automatically queries the ArgoCD API and triggers a rollback to the last successful deployment ID, ensuring the system recovers even if I'm not online."

---

## 7. 📈 Key Stats to Flash

- **83% Speedup**: Deployment time reduced from 3 minutes to **30 seconds**.
- **Efficiency**: Running **25+ pods** on a single ARM instance via aggressive resource tuning.
- **Stability**: Resolved **17+ critical infrastructure bugs**, all documented in a systematic [Troubleshooting Guide](file:///home/bayo/homelab/TROUBLESHOOTING.md).

---

## 8. 🎨 The "Passion" Side: Why I do it

- **"The Hybrid Cloud Experience"**: Using WireGuard to make my home desk and a London cloud instance feel like one private LAN is incredibly rewarding.
- **"Zen-Like Dashboarding"**: I find building custom **Grafana** dashboards to visualize the "pulse" of a cluster to be one of the most satisfying parts of DevOps.

---

> [!TIP]
> **Pro-Tip**: When you talk about the **Troubleshooting Guide**, mention that you treat documentation as part of the "Definition of Done." This shows you are a mature engineer who cares about the team's long-term success.
