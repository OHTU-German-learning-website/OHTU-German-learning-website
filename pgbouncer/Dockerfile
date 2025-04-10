FROM alpine:3.18

# Install pgbouncer and dependencies
RUN apk add --no-cache pgbouncer ca-certificates

# Create pgbouncer user and directories
RUN adduser -D -u 1000 pgbouncer && \
    mkdir -p /etc/pgbouncer /var/log/pgbouncer /var/run/pgbouncer && \
    chown -R pgbouncer:pgbouncer /etc/pgbouncer /var/log/pgbouncer /var/run/pgbouncer

# Copy configuration files
COPY pgbouncer.ini /etc/pgbouncer/

# Set proper permissions
RUN chown pgbouncer:pgbouncer /etc/pgbouncer/pgbouncer.ini

# Expose the default pgbouncer port
EXPOSE 6432

# Switch to pgbouncer user
USER pgbouncer

# Start pgbouncer
CMD ["pgbouncer", "/etc/pgbouncer/pgbouncer.ini"]
