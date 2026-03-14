# Troubleshooting Guide

Complete solutions to all problems encountered during this project.

## Table of Contents

1. [Hardware Issues](#hardware-issues)
2. [Docker & Container Problems](#docker-container-problems)
3. [Networking Issues](#networking-issues)
4. [CI/CD Pipeline Problems](#cicd-pipeline-problems)
5. [Database Issues](#database-issues)
6. [Security & Firewall](#security-firewall)
7. [General Debugging Tips](#general-debugging-tips)

---

## Hardware Issues

### Insufficient RAM

**Problem:** Containers slow to start, system swapping constantly

**Symptoms:**
- Container startup times > 2 minutes
- System unresponsive
- `docker ps` takes long to respond

**Solution:**
- Minimum 8GB RAM recommended for this stack
- Use `docker stats` to monitor resource usage
- Consider reducing number of concurrent services

**Prevention:**
- Check system requirements before starting
- Monitor resource usage during development

---

## Docker & Container Problems

### Container Crash Loop

**Problem:** Container keeps restarting with exit code 4

**Error:**
```
Failed to find attribute 'app' in 'app'.
Worker (pid:7) exited with code 4
```

**Solution:**
1. Check Dockerfile CMD matches your actual entry point:
   ```dockerfile
   # If you have run.py:
   CMD ["python", "run.py"]
   
   # Not:
   CMD ["gunicorn", "app:app"]  # Only if app.py exists
   ```

2. Verify file structure matches CMD expectations

**Debugging:**
```bash
# Check logs
docker logs <container-name>

# Run interactively to debug
docker run -it --rm <image-name> /bin/bash

# Check what files exist in image
docker run --rm <image-name> ls -la
```

### Docker Volumes Persisting Old Data

**Problem:** Changed configuration not taking effect

**Error:**
```
pq: password authentication failed for user "gitea"
```

**Solution:**
```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

**Important:** This deletes ALL data in volumes!

### Container Can't Access localhost

**Problem:** Container trying to connect to service on localhost fails

**Error:**
```
Connection refused to localhost:3001
```

**Root Cause:** Inside a container, `localhost` means the container itself

**Solution:**
Use Docker bridge IP to reach host:
```bash
# Find bridge IP
ip addr show docker0 | grep "inet "
# Usually: 172.17.0.1

# Update config to use bridge IP
http://172.17.0.1:3001  # Instead of localhost:3001
```

---

## Networking Issues

### host.docker.internal Not Found

**Problem:** `host.docker.internal` doesn't work on Linux

**Error:**
```
ERR_NAME_NOT_RESOLVED: host.docker.internal
```

**Solution:**
`host.docker.internal` only works on Docker Desktop (Mac/Windows).

On Linux, use:
```yaml
# Instead of:
DRONE_GITEA_SERVER: http://host.docker.internal:3001

# Use:
DRONE_GITEA_SERVER: http://172.17.0.1:3001
```

### Service Communication Between Containers

**Problem:** One container can't reach another

**Solution:**
Use service names from docker-compose.yml:

```yaml
# docker-compose.yml
services:
  database:
    image: postgres
  
  app:
    image: myapp
    environment:
      # Use service name, not localhost
      DB_HOST: database  # Not localhost
```

### Network Debugging Commands

```bash
# List all networks
docker network ls

# Inspect a network
docker network inspect bridge

# Check container's network
docker inspect <container-name> | grep -A 20 NetworkSettings

# Test connectivity from container
docker exec <container-name> ping 172.17.0.1
docker exec <container-name> nc -zv 172.17.0.1 3001
```

---

## CI/CD Pipeline Problems

### YAML Unmarshal Errors

**Problem:** Pipeline fails with YAML parsing error

**Error:**
```
yaml: unmarshal errors:
  line 31: cannot unmarshal !!map into string
```

**Common Causes:**

1. **Wrong data type:**
   ```yaml
   # WRONG - string when list expected
   tags: latest
   
   # CORRECT - list format
   tags:
     - latest
   ```

2. **Indentation errors:**
   ```yaml
   # WRONG - inconsistent spaces
   steps:
     - name: build
        image: docker  # 3 spaces
       commands:       # 2 spaces
   
   # CORRECT - consistent 2 spaces
   steps:
     - name: build
       image: docker
       commands:
   ```

**Debugging:**
```bash
# Validate YAML syntax
yamllint .drone.yml

# Parse YAML to see structure
python3 -c "import yaml; print(yaml.safe_load(open('.drone.yml')))"
```

### Webhook Not Triggering Builds

**Problem:** Git push doesn't start Drone build

**Checklist:**
1. Check webhook URL in Gitea:
   ```
   # Should be:
   http://172.17.0.1:8080/hook
   
   # Not:
   http://localhost:8080/hook
   ```

2. Check branch names match:
   ```yaml
   # In .drone.yml, watch both:
   when:
     branch:
       - main
       - master
   ```

3. Verify webhook in Gitea Settings → Webhooks
4. Test delivery and check response

### Drone Runner Not Connecting

**Problem:** Builds queue but never execute

**Error in logs:**
```
"msg": "http: no content returned: re-connect and re-try"
```

**Solution:**
```yaml
# In drone-runner config:
environment:
  # Use service name, not localhost
  DRONE_RPC_HOST: drone-server  # Not localhost
```

### Git Clone Fails in Pipeline

**Problem:** Pipeline can't clone repository

**Error:**
```
fatal: unable to access 'http://localhost:3001/repo.git/': 
Connection refused
```

**Solution:**
Custom clone step with bridge IP:

```yaml
clone:
  disable: true

steps:
  - name: clone
    image: alpine/git
    commands:
      - git clone http://172.17.0.1:3001/bayo/sample-app.git .
      - git checkout $DRONE_COMMIT
```

### Authentication Errors in CI

**Problem:** Can't authenticate in non-interactive pipeline

**Error:**
```
terminal prompts disabled
```

**Solutions:**

1. **Make repository public** (simplest for learning)

2. **Use access tokens:**
   ```yaml
   environment:
     GITEA_TOKEN:
       from_secret: gitea_token
   commands:
     - git clone http://user:${GITEA_TOKEN}@172.17.0.1:3001/repo.git .
   ```

3. **Use SSH keys** (most secure)

---

## Database Issues

### Password Mismatch

**Problem:** Database password doesn't match

**Solution:**
1. Ensure passwords match in docker-compose.yml:
   ```yaml
   services:
     db:
       environment:
         POSTGRES_PASSWORD: gitea123
     
     app:
       environment:
         DB_PASSWORD: gitea123  # Must match!
   ```

2. If volumes exist with old password:
   ```bash
   docker-compose down -v  # Remove volumes
   docker-compose up -d
   ```

### Database Connection Refused

**Debugging:**
```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs database

# Test connection from app container
docker exec app-container psql -h database -U user -d dbname
```

---

## Security & Firewall

### Cloud Firewall Blocking Traffic

**Problem:** Can't access service from internet

**Symptoms:**
- Works from localhost on server ✓
- Connection refused from external IP ✗

**Solution for Oracle Cloud:**

1. **VM firewall (iptables):**
   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo netfilter-persistent save
   ```

2. **Cloud Security List:**
   - Oracle Console → Compute → Instance
   - Click Subnet → Security List
   - Add Ingress Rule:
     - Source: 0.0.0.0/0
     - Protocol: TCP
     - Port: 80

**Verification:**
```bash
# From another machine
curl http://[your-public-ip]
```

### Fail2Ban Not Blocking Attacks

**Check if running:**
```bash
sudo systemctl status fail2ban
```

**Check banned IPs:**
```bash
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

**Unban an IP:**
```bash
sudo fail2ban-client set sshd unbanip [IP]
```

---

## General Debugging Tips

### Systematic Approach

1. **Read the error message completely**
   - Don't just read the first line
   - Error messages usually tell you what's wrong

2. **Check logs**
   ```bash
   docker logs <container>
   docker-compose logs <service>
   journalctl -u docker
   ```

3. **Test connectivity**
   ```bash
   ping <host>
   nc -zv <host> <port>
   curl http://<host>:<port>
   ```

4. **Verify configuration**
   ```bash
   # YAML validation
   yamllint file.yml
   
   # Check environment variables
   docker exec <container> env
   
   # Check file contents
   docker exec <container> cat /path/to/file
   ```

5. **Isolate the problem**
   - Change one thing at a time
   - Test after each change
   - Document what worked

### Useful Commands

```bash
# Container management
docker ps -a                    # All containers
docker logs -f <container>      # Follow logs
docker exec -it <container> sh  # Enter container
docker inspect <container>      # Full details

# Networking
docker network ls
docker network inspect bridge
ip addr show
netstat -tulpn

# Resource usage
docker stats
df -h
free -h
top

# Clean up
docker system prune -a
docker volume prune
```

### When to Start Over

Sometimes it's faster to start fresh than debug:

```bash
# Nuclear option - removes EVERYTHING
docker-compose down -v
docker system prune -a --volumes
rm -rf data/

# Then start clean
docker-compose up -d
```

**Warning:** This deletes all data!

---

## Getting Help

If you're stuck:

1. **Check the logs** - 90% of problems are explained in logs
2. **Search the exact error** - Someone else has hit this
3. **Read the official docs** - Often has the answer
4. **Check GitHub issues** - Known bugs and solutions
5. **Simplify** - Remove complexity until it works, then add back

## Contributing

Found a problem and solution not listed here? Please submit a PR!

---

**Last Updated:** March 2026  
**Author:** Bayo
