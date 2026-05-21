#!/usr/bin/env bash
set -e

flask db upgrade
gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120