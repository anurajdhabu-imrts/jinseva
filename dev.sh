#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  dev.sh — start the apps in dev mode.
#
#  Usage:
#    ./dev.sh              # frontend + backend together
#    ./dev.sh frontend     # only the frontend (web + dashboard)
#    ./dev.sh backend       # only the API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
set -euo pipefail

cd "$(dirname "$0")"

target="${1:-all}"

case "$target" in
  all)
    npm run dev
    ;;
  frontend|fe|web|dashboard)
    npm run dev:frontend
    ;;
  backend|be|api)
    npm run dev:backend
    ;;
  *)
    echo "Unknown target: $target"
    echo "Usage: ./dev.sh [all|frontend|backend]"
    exit 1
    ;;
esac
