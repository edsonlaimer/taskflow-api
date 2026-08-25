const express = require('express');

const app = express();
app.use(express.json());

// "Banco de dados" em memória — suficiente para os fins da disciplina.
let tasks = [];
let nextId = 1;

// Health check — usado pelo pipeline de CI e por monitoramento de infraestrutura.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
  }

  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  return res.status(201).json(task);
});

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  if (typeof req.body.done === 'boolean') {
    task.done = req.body.done;
  }
  if (typeof req.body.title === 'string' && req.body.title.trim() !== '') {
    task.title = req.body.title.trim();
  }

  return res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const lengthBefore = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === lengthBefore) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  return res.status(204).send();
});

// Exportado à parte do listen() para permitir testes com supertest sem abrir porta.
module.exports = app;
