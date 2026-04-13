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

### Story 1: The Networking Connectivity Puzzle
*   **Situation**: ArgoCD on Oracle Cloud couldn't pull manifests from the local Gitea server.
*   **Task**: Establish a secure, stable communication channel between a public cloud and a home network behind NAT.
*   **Action**: I configured a **WireGuard VPN** tunnel. I discovered that hardcoded Docker bridge IPs were unreliable, so I switched to using the WireGuard Peer individual IPs. I then automated the interface persistence using `systemd` to ensure connectivity survived node reboots.
*   **Result**: 100% stable sync connectivity with zero public exposure of the Gitea server.

### Story 2: The "Chaos" Pull Failure
*   **Situation**: During a chaos experiment (killing all portfolio pods), the new pods failed to start due to `ImagePullBackOff`.
*   **Task**: Ensure the system can recover even when the network to the private registry is under high load.
*   **Action**: I analyzed the failure and identified that `imagePullPolicy: Always` was flooding the VPN tunnel. I optimized this to `IfNotPresent` and tuned the registry timeouts.
*   **Result**: Recovery time dropped to < 10 seconds, and the system now survives 100% of the chaos experiments I run.

---

## 4. 🧠 Deep-Dive: Auto-Recovery Webhook

**Interviewer asks: "How do you handle automated failures?"**

> "I built a custom Python microservice that acts as a 'last line of defense.' It listens for Prometheus alerts. When it detects a `KubePodCrashLooping` alert in the portfolio namespace, it doesn't just notify Slack—it actually queries the ArgoCD API, identifies the last successful deployment ID, and triggers an automated rollback. This closed-loop automation ensures that a bad image push doesn't stay in production, even if I'm not at my computer."

---

## 5. 📈 Key Stats to Flash

- **83% Speedup**: The GitOps transition reduced deployment time from 3 minutes to **30 seconds**.
- **Efficiency**: Running **25+ pods** effectively on a single Oracle ARM instance through aggressive resource limit tuning.
- **Problem Solving**: Documented and resolved **17+ critical infrastructure bugs**, proving a methodical troubleshooting approach.

---

## ❓ Common Questions for You to Practice

1.  **"Why not just use GitHub Actions?"**
    *   *Answer*: "Gitea and Drone give me full control over my CI environment and keep my proprietary code/secrets entirely off the public internet, only exposing the final running app."
2.  **"How do you handle secrets?"**
    *   *Answer*: "I use HashiCorp Vault for build secrets and Kubernetes Secrets for runtime. I also implemented git history scrubbing to ensure no secrets ever leak into the repository commits."
3.  **"What happens if the WireGuard VPN goes down?"**
    *   *Answer*: "The apps remain running on K3s, but syncs fail. That's why I implemented systemd monitoring for the `wg-quick` service to ensure it auto-restarts immediately."

---

> [!TIP]
> **Confidence Pro-Tip**: When talking about the project, use "we" for industry standards (e.g., "In DevOps, we use GitOps...") but use "I" for your specific contributions (e.g., "I implemented the rollback logic..."). It shows you understand both the industry context and your own technical impact.
