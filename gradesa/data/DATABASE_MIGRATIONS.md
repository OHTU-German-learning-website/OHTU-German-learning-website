# Database Migrations

_Last Updated: November 30, 2025_

This project uses `pgmigrate` to manage schema changes. Applied migrations are tracked in the `pg_migrate_migrations` table.

Location and scripts

- Migration files: `gradesa/data/migrations/`
- Helper scripts: `gradesa/data/migrate.sh`, `gradesa/data/reset-db.sh`

Connection configuration is read from environment variables (see `gradesa/src/backend/config.js`): `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

Note: the development `docker-compose.yml` and the migration scripts use port `7742` for the main database by default.

Quick commands (run from project root `/host`):

```bash
# Apply pending migrations
npm run db:migrate

# Reset DB (drops data) and reapply all migrations
npm run db:reset
```

Naming and workflow

- File pattern: `<5-digit-number>_<descriptive_name>.sql` (e.g. `00002_add_users_table.sql`). Numbers must be sequential and zero-padded.
- Never edit a migration that has already been applied in any environment—create a new migration to make changes.

Adding a migration (summary):

1. Add `00027_your_description.sql` to `gradesa/data/migrations/`.
2. Test locally: `npm run db:migrate`.
3. Commit the new file and push.

Best practices

- Prefer idempotent statements (e.g. `IF NOT EXISTS`).
- Use transactions where appropriate.
- For destructive fixes in production, prefer new compensating migrations over editing old files.
- Document complex migrations with comments.

Rollback strategy

- `pgmigrate` does not provide automatic rollbacks. To reverse a change, author a new migration that undoes the previous change (e.g. `00028_rollback_xyz.sql`).
- For local development, `npm run db:reset` recreates the schema from scratch.

Troubleshooting pointers

- If a migration fails partway, inspect `pg_migrate_migrations` to see what applied and author a corrective migration.
- Check environment variables and ensure the DB container is running (`docker ps` / `podman ps`).
- Pull latest migrations before creating new ones to avoid numbering conflicts.
