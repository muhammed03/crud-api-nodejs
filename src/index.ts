import dotenv from 'dotenv';
import http from 'http';

import controller from './controller'

dotenv.config();

const PORT = process.env.PORT || 5000;

export const server = http.createServer((req, res) => {
  controller(req, res);
});

server.listen(+PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
