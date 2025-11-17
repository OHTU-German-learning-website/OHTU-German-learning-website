# GRADESA German Grammar Interactive Learning and Exercising Website

GRADESA is a freely accessible website where language learners at language centres as well as university students of German studies can autonomously work on their German grammar skills and knowledge.

## Install

To be able to use the container-based development environment, you need to be able to run **rootless** containers.

### For Linux

- If you are using a **Cubbli laptop** with version 22.04 or older, setting up rootless docker is recommended (because podman-compose can't be installed on Ubuntu 22.04 or older). Instructions [here](https://version.helsinki.fi/cubbli/cubbli-help/-/wikis/Docker). In addition to the cubbli-docker package you need to install docker-compose with `$ sudo apt install docker-compose`.
- If you are using anything else, podman is recommended. Install with `$ sudo apt install podman podman-compose`.

### For Windows & MacOS

Since none of us has a MacOS or Windows machine available, we are not able to test this. But most likely using podman would be suitable. If not, see the explanation section below to make debugging easier.

### Explanation

The development environment includes a container named node-dev-env which can be used as a development environment. When the container is created, a bind mount is created and the code base folder is mounted to the container. All development is done inside the container as root. If for example podman is used, this root user inside the container maps to your own user outside the container and there are no problems. If however the container process is running as root, the root user inside the container gets mapped to root user outside the container. This is not only insecure but also creates problems with file permissions. If you now for example create a new file inside the container (by for example running `$ npm install`), the newly created files are owned by root both inside the container but also outside of it.

## Running locally

1. Clone the repo to your machine: `$ git clone git@github.com:OHTU-German-learning-website/OHTU-German-learning-website.git`
2. Cd into cloned repository: `$ cd OHTU-German-learning-website`
3. For docker: `$ docker-compose up -d`, or for Podman: `$ podman-compose up -d`
4. Steps 4-8 for VScode only
5. Install dev-containers extension
6. If you are using podman, change the value of "Dev › Containers: Docker Path" to "podman" in settings
7. In the bottom left corner, press "open a remote window" and select "attach to running container" and select "node-dev-env"
8. Open folder /host in VScode in the remote window
9. The next actions should be run inside the container at /host
10. Run inside the container: `$ npm install && npm run db:migrate`, `$ cd gradesa && npm install`
11. Start the application: `$ npm run dev`
12. Navigate to localhost:3000 in your browser

### Explanation

`docker-compose up -d` (or podman) — This command starts the development environment which includes two databases (one for development, one for automatic tests) and a development container named node-dev-env. VSCode dev-containers can be used to attach to the running container (see [dev-containers documentation](https://code.visualstudio.com/docs/devcontainers/attach-container)). It is also possible to run commands inside the container with `docker exec -it node-dev-env bash` (or with Podman). The codebase is mounted at /host.

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

- Migrations: check [the migration README](data/README.md)

## Definition of Done

"_The requirement has been analyzed, designed, programmed, tested, automated testing implemented, documented, integrated into other software, and deployed to the production environment._"
