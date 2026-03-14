# How to Upload Your Project to GitHub

Follow these steps to get your DevOps homelab project on GitHub.

## Step 1: Prepare Your Project

### Organize Your Files

Your homelab directory structure should look like this:

```
~/homelab/
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── provisioning/
│   └── docker-compose.yml
├── cicd/
│   ├── gitea/
│   │   └── docker-compose.yml
│   ├── drone/
│   │   └── docker-compose.yml
│   └── harbor/
│       └── docker-compose.yml
├── apps/
│   ├── sample-app/
│   └── portfolio-website/
└── scripts/
```

### Add the GitHub Files

1. Copy the README.md to your homelab directory:
   ```bash
   cd ~/homelab
   # Download the README.md I created
   ```

2. Copy the .gitignore file:
   ```bash
   # Download the .gitignore I created
   ```

3. Copy the LICENSE file:
   ```bash
   # Download the LICENSE I created
   ```

4. Copy TROUBLESHOOTING.md:
   ```bash
   # Download TROUBLESHOOTING.md I created
   ```

## Step 2: Create GitHub Repository

### On GitHub Website

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `devops-homelab`
   - **Description:** "Production-grade DevOps infrastructure with CI/CD, monitoring, and cloud deployment"
   - **Visibility:** Public (to showcase your work)
   - **DO NOT** initialize with README (we have one)
4. Click **"Create repository"**

## Step 3: Initialize Git in Your Project

```bash
cd ~/homelab

# Initialize git (if not already done)
git init

# Set default branch to main
git branch -M main

# Add your GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/devops-homelab.git
```

## Step 4: Sanitize Sensitive Data

**IMPORTANT:** Remove any secrets before pushing!

### Check for Sensitive Data

```bash
# Search for passwords
grep -r "password" . --exclude-dir=".git"

# Search for API keys
grep -r "api_key\|secret" . --exclude-dir=".git"

# Search for IP addresses (if you want to hide them)
grep -r "[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}" . --exclude-dir=".git"
```

### Replace Sensitive Values

Replace actual values with placeholders:

```yaml
# Example: In docker-compose.yml
environment:
  # Replace:
  DRONE_RPC_SECRET: abc123secretkey456
  
  # With:
  DRONE_RPC_SECRET: YOUR_RPC_SECRET_HERE
```

```yaml
# Example: Harbor password
harbor_admin_password: Harbor12345

# Becomes:
harbor_admin_password: YOUR_HARBOR_PASSWORD
```

### Create Environment Variable Examples

```bash
# Create .env.example file
cat > .env.example << 'EOF'
# Drone Configuration
DRONE_RPC_SECRET=generate_with_openssl_rand_hex_16
DRONE_GITEA_CLIENT_ID=your_gitea_oauth_client_id
DRONE_GITEA_CLIENT_SECRET=your_gitea_oauth_client_secret

# Harbor Configuration
HARBOR_ADMIN_PASSWORD=your_secure_password

# Database Configuration
POSTGRES_PASSWORD=your_database_password
EOF
```

## Step 5: Stage and Commit Files

```bash
# Check what will be committed
git status

# Add all files
git add .

# Check what's staged (make sure no secrets!)
git status

# Create initial commit
git commit -m "Initial commit: Complete DevOps homelab infrastructure

- Self-hosted Git server (Gitea)
- CI/CD pipeline (Drone)
- Container registry (Harbor)
- Monitoring stack (Prometheus + Grafana)
- Logging (Loki + Promtail)
- Secrets management (Vault)
- VPN tunnel (WireGuard)
- Production deployment to Oracle Cloud
- Complete documentation and troubleshooting guide"
```

## Step 6: Push to GitHub

```bash
# Push to GitHub
git push -u origin main
```

If you get an authentication error, you need to set up authentication:

### Option A: Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Give it a name: "Homelab Project"
4. Select scopes: `repo` (full control of private repositories)
5. Generate token
6. **Copy the token** (you won't see it again!)

Then push using the token:
```bash
git push https://YOUR_TOKEN@github.com/YOUR-USERNAME/devops-homelab.git main
```

### Option B: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Change remote to SSH
git remote set-url origin git@github.com:YOUR-USERNAME/devops-homelab.git

# Push
git push -u origin main
```

## Step 7: Verify on GitHub

1. Go to https://github.com/YOUR-USERNAME/devops-homelab
2. Check that all files are there
3. Verify README renders correctly
4. Make sure no secrets are visible!

## Step 8: Customize README

Update these placeholders in README.md:

```markdown
# Find and replace:
yourusername → your-actual-github-username
your-site-url → your actual portfolio URL
your-blog-post-url → link to your blog post
http://your-website.com → your actual site
```

Commit the changes:
```bash
git add README.md
git commit -m "Update README with actual URLs"
git push
```

## Step 9: Add Topics/Tags

On GitHub repository page:

1. Click ⚙️ (gear icon) next to "About"
2. Add topics:
   - `devops`
   - `docker`
   - `ci-cd`
   - `prometheus`
   - `grafana`
   - `harbor`
   - `drone-ci`
   - `gitea`
   - `infrastructure`
   - `homelab`
3. Save changes

## Step 10: Add Badges (Optional)

Add status badges to your README:

```markdown
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Drone-blue)](https://www.drone.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Common Issues

### "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH, or set up SSH keys properly.

```bash
# Switch to HTTPS
git remote set-url origin https://github.com/YOUR-USERNAME/devops-homelab.git
```

### "Repository not found"

**Causes:**
- Typo in repository name
- Repository not created on GitHub
- Wrong username

**Solution:** Double-check the remote URL:
```bash
git remote -v
```

### "Failed to push some refs"

**Solution:** Pull first if repository has changes:
```bash
git pull origin main --rebase
git push origin main
```

## Ongoing Updates

### Making Changes

```bash
# Make your changes to files

# Check what changed
git status
git diff

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add HTTPS support with Let's Encrypt"

# Push to GitHub
git push
```

### Creating Branches for Features

```bash
# Create new branch
git checkout -b feature/add-kubernetes

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "Add Kubernetes deployment configs"

# Push branch
git push -u origin feature/add-kubernetes

# Then create Pull Request on GitHub
```

## Final Checklist

Before making repository public:

- [ ] No passwords or API keys in code
- [ ] No real IP addresses (use placeholders)
- [ ] README is complete and accurate
- [ ] .gitignore is in place
- [ ] LICENSE file added
- [ ] All links in README work
- [ ] Repository description added
- [ ] Topics/tags added
- [ ] Code is well-commented

## Sharing Your Work

Once on GitHub:

1. **LinkedIn Post:**
   ```
   I just open-sourced my complete DevOps homelab project! 
   
   ✅ 18+ containers
   ✅ Full CI/CD automation
   ✅ Production deployment
   ✅ Complete documentation
   
   Check it out: github.com/YOUR-USERNAME/devops-homelab
   
   #DevOps #OpenSource #Docker
   ```

2. **Twitter:**
   ```
   Just open-sourced my DevOps homelab! 🚀
   
   Complete infrastructure from scratch:
   - Self-hosted Git
   - CI/CD pipeline
   - Container registry  
   - Monitoring stack
   
   https://github.com/YOUR-USERNAME/devops-homelab
   
   #DevOps #100DaysOfCode
   ```

3. **Add to Resume:**
   ```
   DevOps Infrastructure Platform (Open Source)
   - github.com/YOUR-USERNAME/devops-homelab
   - Production-grade CI/CD with 18+ containerized services
   - Complete automation from git push to cloud deployment
   ```

---

**Congratulations! Your project is now on GitHub!** 🎉

Now you can:
- Share it with employers
- Get stars and recognition
- Contribute to your GitHub profile
- Accept contributions from others
- Use it in your portfolio

---

**Need Help?**

If you run into issues:
1. Check GitHub's documentation: https://docs.github.com
2. Review this guide again
3. Search for the specific error message
4. Ask in GitHub discussions or Stack Overflow

**Good luck!** 🚀
