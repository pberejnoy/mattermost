const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    service: 'GitHub MCP Server',
    status: 'running',
    endpoints: {
      '/': 'This info',
      '/health': 'Health check',
      '/github/status': 'GitHub connection status'
    }
  });
});

// Базовый маршрут для проверки здоровья сервера
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// GitHub статус
app.get('/github/status', (req, res) => {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  res.json({ 
    connected: !!token,
    status: token ? 'configured' : 'token missing'
  });
});

app.listen(port, () => {
  console.log(`GitHub MCP Server running on port ${port}`);
});
