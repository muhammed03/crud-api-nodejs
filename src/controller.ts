import { IncomingMessage, ServerResponse } from 'http';
import { router } from './router/router';

const controller = (req: IncomingMessage, res: ServerResponse) => {
  const existingPath = req.url?.startsWith('/api/users');

  if (req.method === 'GET' && existingPath) {
    router.get(req, res);
  } else if (req.method === 'PUT' && existingPath) {
    router.put(req, res);
  } else if (req.method === 'POST' && req.url === '/api/users') {
    router.post(req, res);
  } else if (req.method === 'DELETE' && existingPath) {
    router.delete(req, res);
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify('Non-existent endpoints'));
  }
}

export default controller;
