# GRADESA German Grammar Interactive Learning and Exercising Website

GRADESA is a freely accessible website where language learners at language centres as well as university students of German studies can autonomously work on their German grammar skills and knowledge.

## Prerequisites

- **Rootless container runtime**: Docker (rootless) or Podman with compose support

## Install

To be able to use the container-based development environment, you need to be able to run **rootless** containers.

### For Linux

- If you are using a **Cubbli laptop** with version 22.04 or older, setting up rootless docker is recommended (because podman-compose can't be installed on Ubuntu 22.04 or older). Instructions [here](https://version.helsinki.fi/cubbli/cubbli-help/-/wikis/Docker). In addition to the cubbli-docker package you need to install docker-compose with `$ sudo apt install docker-compose`.
- If you are using anything else, podman is recommended. Install with `$ sudo apt install podman podman-compose`.

### For Windows & MacOS

**Note**: These instructions have not been tested on Windows or MacOS.

- **Windows**: Use [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) or [Podman Desktop](https://podman-desktop.io/)
- **MacOS**: Use [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/) or [Podman Desktop](https://podman-desktop.io/)

If you encounter permission issues, see the explanation section below about rootless containers.

For deeper explanation, see [DEV_ENVIRONMENT.md](./DEV_ENVIRONMENT.md).

## Running locally

1. Clone the repo to your machine: `$ git clone git@github.com:OHTU-German-learning-website/OHTU-German-learning-website.git`
2. cd into cloned repository: `$ cd OHTU-German-learning-website`
3. For docker: `$ docker-compose up -d`, or for Podman: `$ podman-compose up -d`

### VSCode Setup (Optional)

4. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
5. If using Podman, change "Dev › Containers: Docker Path" to "podman" in VSCode settings
6. Click the remote window icon (bottom left corner) → "Attach to Running Container" → select "node-dev-env"
7. In the container window, open folder `/host`

### Alternative: Terminal Access

Without VSCode, access the container with:

```bash
# Docker
docker exec -it node-dev-env bash

# Podman
podman exec -it node-dev-env bash
```

### Start Development

8. Inside the container at `/host`, install dependencies and set up the database:

```bash
npm install && npm run db:migrate
cd gradesa && npm install
```

9. Start the application: run `npm run dev` from the `gradesa/` folder (or run `npm run dev` at the repository root which forwards to the `gradesa` app).
10. Navigate to `http://localhost:3000` in your browser

### Environment Variables

Required environment variables are documented in `gradesa/src/backend/config.js`. The dev environment uses `.env` and `.env.development` files. See [Database Migrations](gradesa/data/DATABASE_MIGRATIONS.md) for database configuration.

## OpenShift

The project is currently hosted on University of Helsinki TIKE OpenShift cluster. The deployment is managed with the manifest files in the manifests folder. The CI/CD pipeline is set up so that when new commit(s) are merged to master, a GitHub actions pipeline runs and builds the new code into a container image which is then pushed to ghcr.io. OpenShift is configured to poll for new images automatically with an interval of 15 minutes. This means that after a change has been merged to master and the pipelines have run successfully, it should take max 15 minutes for the new version to appear in production.

All manifest files except secrets.yaml are under the manifests directory. The secrets.yaml file contains environment variables related to the database connection. A template for the file is as follows:

```
apiVersion: v1
kind: Secret
metadata:
  name: gradesa-secret
data:
  DB_PASSWORD: <base64 encoded data>
  MAILERSEND_API_KEY: <base64 encoded data>
  SESSION_SECRET: <base64 encoded data>
  DB_HOST: <base64 encoded data>
  DB_USER: <base64 encoded data>
  DB_PORT: <base64 encoded data>
  DB_NAME: <base64 encoded data>
```

When constructing the file remember that the encoded form can not contain a trailing newline, so instead of using `echo secret | base64` (echo adds new line automatically at the end), use `printf secret | base64` to encode the secrets into base64.

## Documentation

- [Product and Sprint Backlogs](https://github.com/orgs/OHTU-German-learning-website/projects/4)

- Migrations: check [the migration README](gradesa/data/DATABASE_MIGRATIONS.md)

## Appendix: Project Documentation

Organized documentation files throughout the repository:

- **[gradesa/NEXTJS_APP_GUIDE.md](gradesa/NEXTJS_APP_GUIDE.md)** – Next.js development server setup, testing with Vitest, and coverage UI
- **[gradesa/GLOBAL_MIDDLEWARE.md](gradesa/GLOBAL_MIDDLEWARE.md)** – Global Next.js middleware for route protection and auth redirects
- **[gradesa/data/DATABASE_MIGRATIONS.md](gradesa/data/DATABASE_MIGRATIONS.md)** – Database migration workflow using pgmigrate
- **[gradesa/playwright/e2e/E2E_TESTS.md](gradesa/playwright/e2e/E2E_TESTS.md)** – End-to-end testing documentation
- **[gradesa/src/SOURCE_OVERVIEW.md](gradesa/src/SOURCE_OVERVIEW.md)** – High-level source code organization, patterns, and conventions
- **[gradesa/src/backend/middleware/BACKEND_MIDDLEWARE.md](gradesa/src/backend/middleware/BACKEND_MIDDLEWARE.md)** – Backend middleware wrappers (withAuth, withInputValidation)
- **[gradesa/src/context/APP_CONTEXTS.md](gradesa/src/context/APP_CONTEXTS.md)** – React context providers (user auth, glossary)
- **[gradesa/src/shared/hooks/DATA_FETCHING_HOOKS.md](gradesa/src/shared/hooks/DATA_FETCHING_HOOKS.md)** – Custom data fetching hooks (useQuery, useRequest)
- **[gradesa/src/components/ui/layout/LAYOUT_COMPONENTS.md](gradesa/src/components/ui/layout/LAYOUT_COMPONENTS.md)** – Layout component system (Container, Row, Column)
- **[gradesa/src/components/ui/UI_COMPONENTS.md](gradesa/src/components/ui/UI_COMPONENTS.md)** – UI components quick reference (buttons, layout, exercises, glossary)
- **[DEV_ENVIRONMENT.md](./DEV_ENVIRONMENT.md)** – Explanation about dev containers workflow

## Definition of Done

"_The requirement has been analyzed, designed, programmed, tested, automated testing implemented, documented, integrated into other software, and deployed to the production environment._"
