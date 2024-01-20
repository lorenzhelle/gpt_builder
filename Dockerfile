# ---- Build Stage ----
# Use an official Python runtime as a parent image
FROM python:3.11 as builder

# Set the working directory to /backend
WORKDIR /backend

# Copy the current directory contents into the container at /backend
COPY ./backend .

# Install any needed packages specified in requirements.txt
RUN pip install .

# ---- Frontend Stage ----
# Frontend Dockerfile
FROM node:16 as frontend

# Set the working directory
WORKDIR /frontend

# Copy the package.json and yarn.lock
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./

RUN yarn install

COPY ./frontend .
# Install Yarn and dependencies
RUN yarn build


# ---- Release Stage ----
FROM python:3.11 as release

# Install system dependencies
RUN apt-get update && apt-get install -y libmagic1 && rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy the backend from the builder stage
COPY --from=builder /backend .

# Install any needed packages specified in requirements.txt
RUN pip install .

# Copy the frontend build directory to the static assets directory
COPY --from=frontend /frontend/dist ./ui

# Run the application
# CMD exec uvicorn app.server:app --host 0.0.0.0 --port 8100