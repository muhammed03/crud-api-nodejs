import { IncomingMessage, ServerResponse } from 'http';
import { v4 , validate } from 'uuid';

import { sendResponse, validateUserData} from '../utils/helpers'

export const router = {
  get: (req: IncomingMessage, res: ServerResponse) => {
    try {
      const id = req.url?.match(/\/api\/users\/(.*)/);
      const isValidURL = id && !id?.[1].includes('/');
      if (req.url === '/api/users') {
        sendResponse(usersDB, res, 200);
      } else if (isValidURL) {
        const idFromReq = id[1];
        const userFromDb = usersDB.find((user) => user.id === idFromReq);
        if (validate(idFromReq)) {
          if (userFromDb) {
            sendResponse(userFromDb, res, 200);
          } else {
            sendResponse(`User with id ${idFromReq} does not exist`, res, 404);
          }
        } else {
          sendResponse(`User id ${idFromReq} is invalid`, res, 400);
        }
      } else {
        sendResponse('Non-existent endpoints', res, 404);
      }
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },

  post: (req: IncomingMessage, res: ServerResponse) => {
    try {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        const userData = JSON.parse(data);
        const isValidProp = validateUserData(userData as unknown as User);
        if (isValidProp) {
          const userId = v4();
          const userObj: User = { ...userData, id: userId };
          usersDB.push(userObj);
          process?.send?.(JSON.stringify(usersDB));
          sendResponse(userObj, res, 201);
        } else {
          sendResponse('Body does not contain required fields', res, 400);
        }
      });

      req.on('error', () => {
        sendResponse('Internal Server Error', res, 500);
      });
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },

  put: (req: IncomingMessage, res: ServerResponse) => {
    try {
      const id = req.url?.match(/\/api\/users\/(.*)/);
      const isValidURL = id && !id?.[1].includes('/');

      if (isValidURL) {
        const idFromReq = id[1];
        const userFromDb = usersDB.find((user) => user.id === idFromReq);

        if (validate(idFromReq)) {
          if (userFromDb) {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              const userData = JSON.parse(data);
              const isValidProp = validateUserData(userData as unknown as User);
              if (isValidProp) {
                const userObj: User = { ...userData, id: userFromDb.id };
                usersDB = usersDB.map((user) => {
                  if (user.id === idFromReq) {
                    return userObj;
                  }
                  return user;
                });
                process?.send?.(JSON.stringify(usersDB));
                sendResponse(userObj, res, 200);
              } else {
                sendResponse('Body does not contain required fields', res, 400);
              }
            });
          } else {
            sendResponse(`User with id ${idFromReq} does not exist`, res, 404);
          }
        } else {
          sendResponse(`User id ${idFromReq} is invalid`, res, 400);
        }
      } else {
        sendResponse('Non-existent endpoints', res, 404);
      }
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },

  delete: (req: IncomingMessage, res: ServerResponse) => {
    try {
      const id = req.url?.match(/\/api\/users\/(.*)/);
      const isValidURL = id && !id?.[1].includes('/');
      if (isValidURL) {
        const idFromReq = id[1];
        const userFromDb = usersDB.find((user) => user.id === idFromReq);

        if (validate(idFromReq)) {
          if (userFromDb) {
            usersDB = usersDB.filter((user) => user.id !== idFromReq);
            process?.send?.(JSON.stringify(usersDB));
            sendResponse(
              `user with id ${idFromReq} has been deleted`,
              res,
              204,
            );
          } else {
            sendResponse(`User with id ${idFromReq} does not exist`, res, 404);
          }
        } else {
          sendResponse(`User id ${idFromReq} is invalid`, res, 400);
        }
      } else {
        sendResponse('Non-existent endpoints', res, 404);
      }
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },
};


export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

let usersDB: User[] = [];
