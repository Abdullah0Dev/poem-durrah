#!/usr/bin/env bash
# Re-encodes every .mp4 under public/media for the web and makes a poster frame next to it.
#   - 720p H.264, AAC audio, +faststart (playback starts before the file is fully downloaded)
#   - writes  name.poster.jpg  (picked up automatically by the player)
# BACK UP YOUR ORIGINALS FIRST – files are replaced in place.
# Needs ffmpeg:  brew install ffmpeg  /  apt install ffmpeg
set -euo pipefail
dir="${1:-public/media}"

find "$dir" -type f -name '*.mp4' ! -name '*.opt.mp4' | while read -r f; do
  tmp="${f%.mp4}.opt.mp4"
  ffmpeg -y -loglevel error -i "$f" \
    -vf "scale=-2:'min(720,ih)'" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 96k -movflags +faststart "$tmp"
  mv "$tmp" "$f"
  ffmpeg -y -loglevel error -ss 0.3 -i "$f" -frames:v 1 -vf "scale=1280:-2" -q:v 3 "${f%.mp4}.poster.jpg"
  echo "✓ $f"
done