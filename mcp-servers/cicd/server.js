const express = require('express');
const { Octokit } = require('@octokit/rest');
const winston = require('winston');
const yaml = require('yaml');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3004;

// Настройка логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// GitHub клиент
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

app.use(express.json());

// Маршруты API
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Получение статуса CI/CD
app.get('/api/status', async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const workflows = await octokit.actions.listRepoWorkflows({
      owner,
      repo
    });
    res.json(workflows.data);
  } catch (error) {
    logger.error('Error fetching CI/CD status:', error);
    res.status(500).json({ error: 'Failed to fetch CI/CD status' });
  }
});

// Создание нового воркфлоу
app.post('/api/workflow', async (req, res) => {
  try {
    const { owner, repo, name, config } = req.body;
    const workflowYaml = yaml.stringify(config);
    
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `.github/workflows/${name}.yml`,
      message: `Add ${name} workflow`,
      content: Buffer.from(workflowYaml).toString('base64')
    });

    res.json({ message: 'Workflow created successfully' });
  } catch (error) {
    logger.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Триггер workflow
app.post('/api/trigger', async (req, res) => {
  try {
    const { owner, repo, workflow_id } = req.body;
    await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id,
      ref: 'master'
    });
    res.json({ message: 'Workflow triggered successfully' });
  } catch (error) {
    logger.error('Error triggering workflow:', error);
    res.status(500).json({ error: 'Failed to trigger workflow' });
  }
});

// Получение логов
app.get('/api/logs/:run_id', async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { run_id } = req.params;
    const logs = await octokit.actions.downloadJobLogsForWorkflowRun({
      owner,
      repo,
      run_id
    });
    res.json(logs.data);
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Интеграция с Mattermost
app.post('/api/notify', async (req, res) => {
  try {
    const { channel, message } = req.body;
    await axios.post(process.env.MATTERMOST_WEBHOOK_URL, {
      channel,
      text: message
    });
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    logger.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.listen(port, () => {
  logger.info(`MCP CI/CD Server running on port ${port}`);
  console.log(`MCP CI/CD Server running on port ${port}`);
});