const express = require('express');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const diff = require('diff');
const fs = require('fs').promises;

const app = express();
const wss = new WebSocket.Server({ noServer: true });

// Храним последнее состояние файлов
const fileStates = new Map();

// Отслеживаем изменения в директории mcp-servers
const watcher = chokidar.watch('/mcp-servers', {
  ignored: /(^|[\/\\])\../, // Игнорируем скрытые файлы
  persistent: true
});

// Обработка WebSocket подключений
wss.on('connection', (ws) => {
  console.log('Новое WebSocket подключение');

  ws.on('close', () => {
    console.log('WebSocket подключение закрыто');
  });
});

// Отслеживание изменений файлов
watcher.on('all', async (event, path) => {
  try {
    if (event === 'add' || event === 'change') {
      const content = await fs.readFile(path, 'utf8');
      const oldContent = fileStates.get(path);
      
      // Создаем diff для изменений
      let diffResult = '';
      if (oldContent) {
        diffResult = diff.createPatch(path, oldContent, content);
      }

      // Сохраняем новое состояние файла
      fileStates.set(path, content);

      // Отправляем информацию об изменениях всем подключенным клиентам
      const change = {
        type: event,
        file: path,
        timestamp: Date.now(),
        diff: diffResult
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(change));
        }
      });
    }
  } catch (error) {
    console.error('Ошибка при обработке изменения файла:', error);
  }
});

const server = app.listen(3006, () => {
  console.log('Сервер отслеживания изменений запущен на порту 3006');
});

// Интеграция WebSocket с HTTP сервером
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});