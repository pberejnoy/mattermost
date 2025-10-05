const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    service: 'Docker MCP Server',
    status: 'running',
    endpoints: {
      '/': 'This info',
      '/health': 'Health check',
      '/docker/status': 'Docker connection status'
    }
  });
});

// Базовый маршрут для проверки здоровья сервера
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Docker статус
app.get('/docker/status', (req, res) => {
  const fs = require('fs');
  const socketExists = fs.existsSync('/var/run/docker.sock');
  res.json({ 
    connected: socketExists,
    status: socketExists ? 'docker socket found' : 'docker socket not found'
  });
});

app.listen(port, () => {
  console.log(`Docker MCP Server running on port ${port}`);
});
