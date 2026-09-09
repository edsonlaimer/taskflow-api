const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('retorna status ok com uptime do processo', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime_s).toBe('number');
  });
});

describe('POST /tasks', () => {
  it('cria uma tarefa válida', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Estudar IaC' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ title: 'Estudar IaC', done: false });
  });

  it('rejeita tarefa sem título', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /tasks', () => {
  it('lista as tarefas criadas', async () => {
    await request(app).post('/tasks').send({ title: 'Ler documentação' });
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('PATCH /tasks/:id', () => {
  it('atualiza o status de uma tarefa existente', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Configurar pipeline' });
    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it('retorna 404 para tarefa inexistente', async () => {
    const res = await request(app).patch('/tasks/9999').send({ done: true });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('remove uma tarefa existente', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Remover depois' });
    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  it('retorna 404 ao remover tarefa inexistente', async () => {
    const res = await request(app).delete('/tasks/9999');
    expect(res.statusCode).toBe(404);
  });
});
