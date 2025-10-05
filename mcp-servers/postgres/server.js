const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    service: 'PostgreSQL MCP Server',
    status: 'running',
    endpoints: {
      '/': 'This info',
      '/health': 'Health check',
      '/db/status': 'Database connection status'
    }
  });
});

// Базовый маршрут для проверки здоровья сервера
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Статус базы данных
app.get('/db/status', (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  res.json({ 
    connected: !!dbUrl,
    status: dbUrl ? 'configured' : 'connection string missing'
  });
});

app.listen(port, () => {
  console.log(`PostgreSQL MCP Server running on port ${port}`);
});
