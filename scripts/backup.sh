#!/bin/bash

# Создаем директорию для бэкапов
mkdir -p ./backups/$(date +%Y%m%d)

# Бэкап баз данных
echo "Backing up Mattermost database..."
docker exec mattermost-db pg_dump -U mmuser mattermost > ./backups/$(date +%Y%m%d)/mattermost.sql

echo "Backing up MCP databases..."
docker exec mcp-postgres pg_dump -U mcpuser mcpdb > ./backups/$(date +%Y%m%d)/mcp.sql

# Бэкап данных Mattermost
echo "Backing up Mattermost data..."
docker run --rm --volumes-from mattermost -v $(pwd)/backups/$(date +%Y%m%d):/backup alpine tar czf /backup/mattermost-data.tar.gz /mattermost/data

# Бэкап конфигурации
echo "Backing up configuration..."
docker run --rm --volumes-from mattermost -v $(pwd)/backups/$(date +%Y%m%d):/backup alpine tar czf /backup/mattermost-config.tar.gz /mattermost/config

echo "Backup completed: ./backups/$(date +%Y%m%d)/"