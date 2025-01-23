# GRADESA German Grammar Interactive Learning and Exercising Website

GRADESA is a freely accessible website where language learners at language centres as well as university students of German studies can autonomously work on their German grammar skills and knowledge.

## Install

This should be all that's needed:

- `node`
- `npm`
- https://github.com/peterldowns/pgmigrate
  - MAC: Install the newest version with `brew install peterldowns/tap/pgmigrate`
  - Linux: # Install pgmigrate
    - `wget https://github.com/peterldowns/pgmigrate/releases/download/v0.0.6%2Bcommit.4f90829/pgmigrate-linux-amd64 -O /usr/local/bin/pgmigrate`
    - `chmod +x /usr/local/bin/pgmigrate`
- Docker, either of these installation options work (if you're new to docker, I recommend Docker Desktop):
  - `brew install docker` + `brew install colima` (https://github.com/abiosoft/colima)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- psql: `brew install postgresql@15`

## Running locally

- Run PostgreSQL:
  - `docker-compose up -d` — This command starts the services defined in the docker-compose.yml file in detached mode, meaning the services run in the background and the terminal is freed up for other tasks. For more information, checkout [Docker Compose docs](https://docs.docker.com/compose/)
  - `npm run dev` — Starts the dev server.
  - You can now find the NextJS app on localhost:3000

## Documentation

- [Project Backlog](https://github.com/orgs/OHTU-German-learning-website/projects/1)
- [Sprint 0 Task Board](https://github.com/orgs/OHTU-German-learning-website/projects/2)

- Migrations: check [the migration README](data/README.md)

## Definition of Done

"_The requirement has been analyzed, designed, programmed, tested, automated testing implemented, documented, integrated into other software, and deployed to the production environment._"
