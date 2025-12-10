# Gradesa Development Environment

## Overview

The current setup uses a container as a fully-fledged development environment. This ensures that:

- Everyone works with the same tools and versions.
- Only Docker or Podman needs to be installed (in theory, even Git is optional).

In other words, the docker-compose.yml file starts the **development environment**, not the application itself.

## Containers

- **node-dev-env**: This is the main development environment. It’s based on a standard Node.js Debian image with an added PostgreSQL CLI client (psql). When you start the container, the project’s root directory is mounted inside the container (/host), giving you full access to your code. To open a shell inside the container, run `$ docker exec -it node-dev-env bash` (replace docker with podman if you’re using Podman). From here, you can run commands like:

  - Start the app: `$ npm run dev`
  - Update dependencies: `$ npm audit fix`

  All changes inside the container are reflected in your local project files.

- **gradesa-db & gradesa-pgtestdb**: These containers run the application’s databases:
  - gradesa-db is for local development and testing.
  - gradesa-pgtestdb is for automated tests.

## VS Code Debugger

You can use VS Code’s integrated debugger by connecting your editor to the node-dev-env container via the Dev Containers extension.

**Steps**:

- Start the containers using docker-compose or podman-compose.
- Attach VS Code to the node-dev-env container.
- Configure a valid launch.json file (search online for examples).

Once set up, you can debug your app directly from VS Code.

## Why Podman / Rootless Docker?

The main reason is file ownership when sharing volumes. Users inside the container differ from users outside. For example:

- Inside the container, you’re root.
- Outside, files created by root inside the container appear as owned by the Docker daemon user (often root), which can clutter your home directory with root-owned files.

Podman and rootless Docker solve this by running the daemon as your normal user. This way, files created inside the container appear as owned by your regular user outside.

(In theory, you could avoid volume sharing and clone the project each time inside the container, but that’s not recommended 😀)
