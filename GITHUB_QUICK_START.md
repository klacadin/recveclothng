# Quick GitHub Setup

## Step-by-Step Instructions

### 1. Initialize Git (if not already done)
```bash
git init
```

### 2. Add Environment Files to .gitignore
✅ Already done! `.env` files are now in `.gitignore`

### 3. Stage All Files
```bash
git add .
```

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: REVE Clothing website - Performance apparel e-commerce"
```

### 5. Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `reveclothing` (or your choice)
3. Description: "REVE Clothing - Performance Apparel E-commerce Website"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

**Option B: Via GitHub CLI** (if installed)
```bash
gh repo create reveclothing --public --source=. --remote=origin --push
```

### 6. Connect to GitHub

After creating the repo, GitHub will show you the commands. Use:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/reveclothing.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Complete Command Sequence

Copy and paste these commands (replace `YOUR_USERNAME`):

```bash
# Initialize
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: REVE Clothing website"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/reveclothing.git

# Push
git branch -M main
git push -u origin main
```

---

## Authentication

If prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a GitHub Personal Access Token (not your password)
  - Create token: https://github.com/settings/tokens
  - Select scope: `repo`

---

## Verify Connection

```bash
# Check remote
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/reveclothing.git (fetch)
# origin  https://github.com/YOUR_USERNAME/reveclothing.git (push)
```

---

**Ready to connect! Follow the steps above.** 🚀

