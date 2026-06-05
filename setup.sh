#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  setup.sh — first-time repository setup.
#
#  - Checks Node version against .nvmrc
#  - Installs workspace dependencies
#  - Copies .env.example -> .env for each app that has one
#  - Prints next-step hints
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
set -euo pipefail

cd "$(dirname "$0")"

echo "🪔 Shree Jinalaya — first-time setup"
echo

required_node=$(cat .nvmrc 2>/dev/null || echo "20")
current_node=$(node --version | sed 's/^v//')
echo "Node required: $required_node  |  detected: $current_node"

echo
echo "📦 Installing workspace dependencies…"
npm install

echo
echo "🔐 Copying .env.example files…"
for envfile in apps/*/.env.example; do
  app_dir=$(dirname "$envfile")
  if [ ! -f "$app_dir/.env" ]; then
    cp "$envfile" "$app_dir/.env"
    echo "  ✓ created $app_dir/.env"
  else
    echo "  ⏭  $app_dir/.env already exists"
  fi
done

echo
echo "✅ Setup complete."
echo
echo "Next steps:"
echo "  • Fill in env values:    code apps/backend/.env"
echo "  • Start all apps:        npm run dev   (or ./dev.sh)"
echo "  • Or one at a time:      ./dev.sh frontend | backend"
echo
echo "Jai Jinendra 🙏"
