#!/usr/bin/env bash

flask db upgrade
gunicorn app:app