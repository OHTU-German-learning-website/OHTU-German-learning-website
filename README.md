# GRADESA German Grammar Interactive Learning and Exercising Website

GRADESA is a freely accessible website where language learners at language centres as well as university students of German studies can autonomously work on their German grammar skills and knowledge.

## Install

- Docker, either of these installation options work (if you're new to docker, I recommend Docker Desktop):

  - `brew install docker` + `brew install colima` (https://github.com/abiosoft/colima)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
    - WSL 2: Enabling `systemd` is recommended
      - Install Docker Desktop on Windows
      - Turn on the WSL 2 feature during installation
      - Ensure **Use the WSL 2 based engine** is enabled in General Settings

## Running locally

- `docker-compose up -d` — This command starts the development enviroment which includes two databases (one for development, one for automatic tests) and a development container named node-dev-env. If using VSCode dev-containers extension can be used to attach VSCode to the running container (see dev-containers documentation). It is also possible to run the commands with `docker-exec -it node-dev-env bash`. The codebase is mounted at /host. The next actions should be run inside node-dev-env.
- `npm install` in project root
- `npm run db:migrate`
- `cd ./gradesa && npm install`
- `npm run dev` — Starts the dev server.
- You can now find the NextJS app on localhost:3000

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

- [Product and Sprint Backlogs](https://github.com/orgs/OHTU-German-learning-website/projects/3)

- Migrations: check [the migration README](data/README.md)

## Definition of Done

"_The requirement has been analyzed, designed, programmed, tested, automated testing implemented, documented, integrated into other software, and deployed to the production environment._"
