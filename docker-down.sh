#!/bin/bash

# Stop and remove the Docker containers
docker-compose down

# Optionally, remove all stopped containers and unused images
docker system prune -f