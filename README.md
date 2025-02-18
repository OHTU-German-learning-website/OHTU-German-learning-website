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
    - WSL 2: Enabling `systemd` is recommended
      - Install Docker Desktop on Windows
      - Turn on the WSL 2 feature during installation
      - Ensure **Use the WSL 2 based engine** is enabled in General Settings

- psql: `brew install postgresql@15`

## Running locally

- Run PostgreSQL:

  - Init .env files `./init-env.sh` — This will create the required .env files for environment variables. The local db credentials are

    - DB_HOST=localhost
    - DB_PORT=7742
    - DB_USER=ohtu
    - DB_PASSWORD=password
    - DB_NAME=gradesa

    Add session secret key to .env

    - SESSION_SECRET=your_secret_key

  - `docker compose up -d` — This command starts the services defined in the docker-compose.yml file in detached mode, meaning the services run in the background and the terminal is freed up for other tasks. For more information, checkout [Docker Compose docs](https://docs.docker.com/compose/)
  - `npm install` in project root
  - `cd ./gradesa && npm install`
  - `npm run dev` — Starts the dev server.
  - You can now find the NextJS app on localhost:3000

## Documentation

- [Product and Sprint Backlogs](https://github.com/orgs/OHTU-German-learning-website/projects/3)

- Migrations: check [the migration README](data/README.md)

## Definition of Done

"_The requirement has been analyzed, designed, programmed, tested, automated testing implemented, documented, integrated into other software, and deployed to the production environment._"
