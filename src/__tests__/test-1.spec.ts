import request from 'supertest';
import { server } from '../index';
import {User} from "../router/router";

export const userRain: User = {
  username: 'Rain',
  age: 32,
  hobbies: [],
};

const updatedUser = {
  username: 'Broky',
  age: 25,
  hobbies: ['painting'],
};

describe('first test', () => {
  test('get all users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('create a new user', async () => {
    const res = await request(server).post('/api/users').send(userRain);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(userRain);
    userRain.id = res.body.id;
  });

  test('get user by id', async () => {
    const res = await request(server).get(`/api/users/${userRain.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(userRain);
  });

  test('update user', async () => {
    const res = await request(server)
      .put(`/api/users/${userRain.id}`)
      .send(updatedUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(updatedUser);
  });

  test('delete user', async () => {
    const res = await request(server).delete(`/api/users/${userRain.id}`);
    expect(res.statusCode).toBe(204);
  });

  test('get non-existent user', async () => {
    const res = await request(server).get(`/api/users/${userRain.id}`);
    expect(res.statusCode).toBe(404);
  });
  server.close();
});
