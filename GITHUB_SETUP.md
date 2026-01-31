# GitHub Setup Guide

## Steps to Connect to GitHub

### 1. Initialize Git Repository (if not already done)

```bash
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: REVE Clothing website"
```

### 4. Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Repository name: `reveclothing` (or your preferred name)
5. Description: "REVE Clothing - Performance Apparel E-commerce Website"
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **"Create repository"**

### 5. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/reveclothing.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/reveclothing.git
```

### 6. Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

---

## Important Files to Commit

✅ **Commit these files:**
- All source code (`src/`)
- Configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`, etc.)
- Public assets (`public/`)
- Documentation files (`.md` files)
- `.gitignore`

❌ **DO NOT commit:**
- `node_modules/` (already in .gitignore)
- `dist/` (build output, already in .gitignore)
- `.env` (environment variables with secrets)
- `.env.local` (local environment variables)

---

## .gitignore Status

Your `.gitignore` already includes:
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ `*.local` files
- ✅ Log files
- ✅ Editor files

**Make sure `.env` is also ignored!** Add it if not present.

---

## Quick Setup Commands

```bash
# 1. Initialize (if needed)
git init

# 2. Check status
git status

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: REVE Clothing website"

# 5. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/reveclothing.git

# 6. Push
git branch -M main
git push -u origin main
```

---

## After Setup

Once connected, you can:
- Push changes: `git push`
- Pull changes: `git pull`
- Check status: `git status`
- View commits: `git log`

---

## Troubleshooting

### If you get "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/reveclothing.git
```

### If you need to update .gitignore
Make sure `.env` is in `.gitignore`:
```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### Authentication Issues
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys for easier authentication

---

**Ready to connect! Follow the steps above to set up your GitHub repository.** 🚀

