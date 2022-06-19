import {ServerResponse} from "http";
import {User} from "../router/router";

function sendResponse(message: unknown, res: ServerResponse, statusCode: number) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(message));
}


function validateUserData(user: User) {
  let count = 0;
  let isValid = true;
  Object.entries(user).forEach(([key, value]) => {
    switch (key) {
      case 'username':
        if (typeof value !== 'string') {
          return false;
        }
        count += 1;
        break;
      case 'age':
        if (typeof value !== 'number') {
          return false;
        }
        count += 1;
        break;

      case 'hobbies':
        if (!Array.isArray(value)) {
          return false;
        }
        count += 1;
        break;
      default:
        isValid = false;
        return false;
    }
  });

  return count === 3 && isValid;


}

export {
  sendResponse,
  validateUserData
}
