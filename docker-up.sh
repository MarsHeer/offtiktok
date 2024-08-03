#!/bin/bash

# Build and start the Docker containers
docker-compose up --build -d

# Print the status of the running containers
docker-compose ps