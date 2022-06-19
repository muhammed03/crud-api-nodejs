import request from 'supertest';
import { server } from '../index';
import {User} from "../router/router";

const rain: User = {
  username: 'Rain',
  age: 24,
  hobbies: [],
};

const alfred: User = {
  username: 'Niko',
  age: 25,
  hobbies: ['reading'],
};

const users = [rain, alfred];

describe('second test', () => {
  test('add two users', async () => {
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      const res = await request(server).post('/api/users').send(user);
      user.id = res.body.id;
      expect(res.statusCode).toBe(201);
    }
  });

  test('there are two users in the database', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('request non-valid uuid', async () => {
    const res = await request(server).get('/api/users/non-valid-uuid');
    expect(res.statusCode).toBe(400);
  });

  test('request for a non-existent user', async () => {
    const res = await request(server).get(
      '/api/users/123e4567-e89b-12d3-a456-426614174000',
    );
    expect(res.statusCode).toBe(404);
  });

  test('delete user after response errors', async () => {
    const res = await request(server).delete(`/api/users/${rain.id}`);
    expect(res.statusCode).toBe(204);
  });

  test('there should be only one user in the database', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
  server.close();
});
