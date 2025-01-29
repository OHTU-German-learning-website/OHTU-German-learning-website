# Database Migration with pgmigrate

This project uses `pgmigrate` to manage database migrations. `pgmigrate` is a tool that helps apply, and manage database schema changes in a consistent and reliable manner. Ran migrations are tracked in the `pg_migrate_migrations` table.

Having a migration system that's based on sql files is good because it keeps track of schema changes in git and guarantees that everyone is using the same schema.

## Prerequisites

Ensure you have the following installed on your system:

- PostgreSQL
- `pgmigrate` (You can find more information and installation instructions on the [pgmigrate GitHub page](https://github.com/peterldowns/pgmigrate))

## Migration Script

The migration script is located at `data/migrate.sh`. This script uses `pgmigrate` to apply migrations to the database.

### Running Migrations

To run the migrations, execute the following command (in root): `npm run db:migrate`

### Resetting the database

To reset the database, you can use the following command: `npm run db:reset`
This will clear all tables, and rerun migrations.

### Adding migrations

To add a migration, creat a new SQL file with the migration you want to run and give it a name with the next number. (ex. `00042_create_user.sql`)
