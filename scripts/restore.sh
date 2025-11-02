#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 backup_date (YYYYMMDD)"
    exit 1
fi

BACKUP_DIR="./backups/$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

# Останавливаем контейнеры
docker-compose stop

# Восстанавливаем базы данных
echo "Restoring Mattermost database..."
docker exec -i mattermost-db psql -U mmuser mattermost < $BACKUP_DIR/mattermost.sql

echo "Restoring MCP database..."
docker exec -i mcp-postgres psql -U mcpuser mcpdb < $BACKUP_DIR/mcp.sql

# Восстанавливаем данные Mattermost
echo "Restoring Mattermost data..."
docker run --rm --volumes-from mattermost -v $BACKUP_DIR:/backup alpine sh -c "cd /mattermost && tar xzf /backup/mattermost-data.tar.gz"

# Восстанавливаем конфигурацию
echo "Restoring configuration..."
docker run --rm --volumes-from mattermost -v $BACKUP_DIR:/backup alpine sh -c "cd /mattermost && tar xzf /backup/mattermost-config.tar.gz"

# Запускаем контейнеры
docker-compose start

echo "Restore completed!"