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

## 3. 🛡️ Hero Stories: Problem-Solving (STAR Method)

### Story 1: The Networking & VPN Resilience (WireGuard)
*   **Situation**: The connection between my local build server (Gitea/Drone) and the Oracle Cloud K3s cluster was unstable, frequently dropping after node reboots.
*   **Root Cause**: I was manually assigning WireGuard IPs using `ip addr add`, which isn't persistent. Additionally, the VPN interface wouldn't always auto-start on boot.
*   **Action**: 
    1. I initially wrote a **Bash watchdog script** that would ping the peer and restart the interface if it went down. 
    2. To move to a more 'production-grade' solution, I migrated the logic to a **native systemd service** using `wg-quick@wg0`. 
    3. I configured `/etc/wireguard/wg0.conf` to handle persistence and enabled the service to start automatically on boot.
*   **Result**: 100% VPN uptime, ensuring that ArgoCD always has access to the manifest repository.

### Story 2: Drone-Gitea Connectivity & IP Discovery
*   **Situation**: Drone CI pipelines were hanging during the 'clone' step, unable to reach the Gitea container.
*   **Root Cause**: The system was trying to use the Docker bridge IP (`172.17.0.1`), which was inconsistent across service restarts and isolated within the host.
*   **Action**: I reconfigured the internal networking to use the **WireGuard peer IP (10.0.0.x)**. This provided a stable, routable static IP that worked regardless of Docker's internal bridge state.
*   **Result**: Pipeline reliability jumped to 100%, enabling the sub-30s build-and-push workflow.

### Story 3: The "Chaos" Pull Failure & Optimization
*   **Situation**: During a chaos experiment (killing all portfolio pods), the new pods failed to start due to `ImagePullBackOff`.
*   **Root Cause**: The `imagePullPolicy: Always` set in the manifests was forcing the cluster to pull from my local Harbor registry over the VPN tunnel for every pod. Under the load of a mass-restart, the tunnel bottlenecked.
*   **Action**: I optimized the manifest to `imagePullPolicy: IfNotPresent`, leveraging the local node's cache for existing images.
*   **Result**: Recovery time dropped to < 10 seconds, and the system now effortlessly heals even under mass-termination chaos events.

### Story 4: Security & Git History Sanitization
*   **Situation**: I accidentally committed a live Slack Webhook URL to a public repository, which was immediately flagged by GitHub's secret scanning.
*   **Task**: Remove the secret and ensure it’s not retrievable through the Git history.
*   **Action**: 
    1. I immediately revoked the Slack token.
    2. I used **git filter-repo** to scrub the secret from every commit in the history.
    3. I implemented **Kubernetes Secrets** and environment variables to ensure secrets never touch the filesystem or repository again.
*   **Result**: Successfully sanitized the repository, restored security, and implemented a more robust "Secrets-First" architecture.

### Story 5: Resource Management & Port Conflicts (Node Exporter)
*   **Situation**: After installing the Prometheus monitoring stack on K3s, the `node-exporter` pods went into a `CrashLoopBackOff`.
*   **Root Cause**: A standalone `node-exporter` Docker container was already running on the host, occupying port 9100.
*   **Action**: I performed a root-cause analysis using `kubectl logs` and `netstat`, identified the conflict, and decommissioned the legacy Docker container in favor of the K8s-managed DaemonSet.
*   **Result**: Unified monitoring architecture and resolved the resource conflict.

---

## 4. 🚀 The Migration Journey: Docker to Kubernetes

**Interviewer asks: "Tell me about a difficult migration."**

> "One of the biggest challenges was migrating the **stateful components** (PostgreSQL and application uploads) from Docker Volumes to Kubernetes **Persistent Volumes**. I had to ensure data integrity while switching from a host-path-based persistent model to a K8s-native one. I used the migration as an opportunity to implement **automated backups** and validated the entire move by running side-by-side environments before cutting over traffic via the Traefik Ingress."

---

## 5. 🧠 Deep-Dive: Auto-Recovery Webhook

**Interviewer asks: "How do you handle automated failures?"**

> "I built a custom Python microservice that acts as a 'last line of defense.' It listens for Prometheus alerts. When it detects a `KubePodCrashLooping` alert in the portfolio namespace, it doesn't just notify Slack—it actually queries the ArgoCD API, identifies the last successful deployment ID, and triggers an automated rollback. This closed-loop automation ensures that a bad image push doesn't stay in production, even if I'm not at my computer."

---

## 6. 📈 Key Stats to Flash

- **83% Speedup**: The GitOps transition reduced deployment time from 3 minutes to **30 seconds**.
- **Efficiency**: Running **25+ pods** effectively on a single Oracle ARM instance through aggressive resource limit tuning.
- **Problem Solving**: Documented and resolved **17+ critical infrastructure bugs**, proving a methodical troubleshooting approach.

---

## 7. 🎨 The "Fun" Side: Passion for the Homelab

**Interviewer asks: "What do you do for fun in your homelab?"** This is where you show your passion!

- **Chaos Experiments**: "I actually enjoy 'breaking' my cluster on purpose with **Chaos Mesh**. There’s a certain satisfaction in watching the system detect a failure and automatically roll back or spin up new pods. It’s like a puzzle where I’m testing the resiliency of my own architecture."
- **The "Hybrid Cloud" Feel**: "I love the magic of **WireGuard**. It’s incredibly cool to have my physical server in my room and a cloud instance in London feeling like they’re on the same local network. It allows me to build 'private-first' infrastructure where the cloud is just an extension of my home lab."
- **Dashboard Zen**: "I spend a lot of time in **Grafana** building custom dashboards. Seeing the HPA (Horizontal Pod Autoscaler) kick in and the 'Replica Count' graph spike up when I run a load test is a huge rush—it’s seeing my automation work in real-time."
- **Stack Ownership**: "There is a deep sense of independence in self-hosting **Gitea, Harbor, and Vault**. I’m not just using tools; I’m managing the entire lifecycle of the developer experience from scratch."

---

## 8. ❓ Common Questions for You to Practice

1.  **"Why not just use GitHub Actions?"**
    *   *Answer*: "Gitea and Drone give me full control over my CI environment and keep my proprietary code/secrets entirely off the public internet, only exposing the final running app."
2.  **"How do you handle secrets?"**
    *   *Answer*: "I use HashiCorp Vault for build secrets and Kubernetes Secrets for runtime. I also implemented git history scrubbing to ensure no secrets ever leak into the repository commits."
3.  **"What happens if the WireGuard VPN goes down?"**
    *   *Answer*: "The apps remain running on K3s, but syncs fail. That's why I implemented systemd monitoring for the `wg-quick` service to ensure it auto-restarts immediately."

---

> [!TIP]
> **Confidence Pro-Tip**: When talking about the project, use "we" for industry standards (e.g., "In DevOps, we use GitOps...") but use "I" for your specific contributions (e.g., "I implemented the rollback logic..."). It shows you understand both the industry context and your own technical impact.
