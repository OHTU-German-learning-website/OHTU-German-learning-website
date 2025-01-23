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
- Docker, either of these installation options work:
  - `brew install docker` + `brew install colima` (https://github.com/abiosoft/colima)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- psql: `brew install postgresql@15` + `echo '\nexport PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc`

## Documentation

- [Project Backlog](https://github.com/orgs/OHTU-German-learning-website/projects/1)
- [Sprint 0 Task Board](https://github.com/orgs/OHTU-German-learning-website/projects/2)

## Definition of Done

"_The requirement has been analyzed, designed, programmed, tested, automated testing implemented, documented, integrated into other software, and deployed to the production environment._"
