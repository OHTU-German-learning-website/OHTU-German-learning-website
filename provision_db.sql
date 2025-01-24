DO $do$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ohtu') THEN
          CREATE ROLE ohtu;
        END IF;
        ALTER ROLE ohtu WITH LOGIN PASSWORD 'password' NOSUPERUSER CREATEDB NOCREATEROLE;
    END
$do$;

DROP DATABASE IF EXISTS gradesa;
CREATE DATABASE gradesa OWNER ohtu;
GRANT ALL ON DATABASE gradesa TO ohtu;
