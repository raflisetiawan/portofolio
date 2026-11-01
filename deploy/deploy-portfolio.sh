#!/bin/bash
# Installed to /home/deploy/deploy-portfolio.sh on the VPS.
#
#   deploy.cmd on the laptop pipes a build here:  ./deploy-portfolio.sh - <commit>
#   Roll back to an earlier build:                ./deploy-portfolio.sh ~/releases/portfolio-<...>.tar.gz
set -euo pipefail

APP=/var/www/portfolio
RELEASES="$HOME/releases"
LOG="$HOME/deploy.log"
KEEP=5
STEP=start

log() { echo "$(date '+%F %T') portfolio $*" >>"$LOG"; }
trap 'log "GAGAL step=$STEP"; echo "Deploy gagal pada langkah: $STEP" >&2' ERR

mkdir -p "$RELEASES"

case "${1:-}" in
  -)
    STEP=terima-arsip
    archive="$RELEASES/portfolio-$(date +%Y%m%d-%H%M%S)-${2:-unknown}.tar.gz"
    cat >"$archive"
    ;;
  "")
    echo "Pemakaian: $0 - <commit>  |  $0 <arsip.tar.gz>" >&2
    exit 2
    ;;
  *)
    archive="$1"
    ;;
esac

STEP=cek-arsip
gzip -t "$archive"

STEP=ekstrak
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT
tar -xzf "$archive" -C "$stage"
test -f "$stage/dist/index.html"
test -f "$stage/dist-server/standalone.mjs"

STEP=sinkron-server
rsync -rlt --delete --chmod=D2750,F640 "$stage/dist-server/" "$APP/server/"

STEP=restart-chat
sudo systemctl restart portfolio-chat
sleep 1
systemctl is-active --quiet portfolio-chat

# Files go live last, so a broken server build leaves the old pages in place.
STEP=sinkron-situs
rsync -rlt --delete --chmod=D2750,F640 "$stage/dist/" "$APP/public/"

STEP=bersihkan
# shellcheck disable=SC2012 # Names contain only digits, letters, and dashes.
ls -1t "$RELEASES"/portfolio-*.tar.gz | tail -n +"$((KEEP + 1))" | while read -r old; do
  rm -f -- "$old"
done

log "OK $(basename "$archive")"
echo "Deploy selesai: $(basename "$archive")"
