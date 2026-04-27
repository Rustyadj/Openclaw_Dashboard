#!/usr/bin/env bash
# Run this on the Hostinger VPS as root to deploy / redeploy OpenClaw.
set -e

REPO_DIR="/opt/openclaw"
REPO_URL="https://github.com/Rustyadj/Openclaw.git"
BRANCH="claude/access-hostinger-vps-Rugpg"

echo "==> Pulling latest code..."
if [ -d "$REPO_DIR/.git" ]; then
  git -C "$REPO_DIR" fetch origin "$BRANCH"
  git -C "$REPO_DIR" checkout "$BRANCH"
  git -C "$REPO_DIR" reset --hard "origin/$BRANCH"
else
  git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

echo "==> Stopping old container (if any)..."
docker compose down --remove-orphans || true

echo "==> Building and starting OpenClaw..."
docker compose up -d --build

echo "==> OpenClaw is running."
docker compose ps
