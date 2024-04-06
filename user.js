import { db } from "./db.js";
import { v4 as uuidv4 } from "uuid";
/**
 * @param {Object} user - The employee who is responsible for the project.
 * @param {string} user.username - The name of the employee.
 * @param {string} user.email
 * @param {string} user.password
 * @param {string} user.confirmpassword
 */
export async function register(user) {
  console.log(user);
  if (user.password !== user.confirmpassword) {
    return false;
  }
  const res = new Promise((res, rej) => {
    db.run(
      "INSERT INTO users(username, email, password) VALUES ($username, $email, $password)",
      {
        $username: user.username,
        $email: user.email,
        $password: user.password,
      },
      (result, error) => {
        if (error) {
          rej(error);
        } else {
          res(result);
        }
      }
    );
  });
  try {
    await res;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * @param {Object} user - The employee who is responsible for the project.
 * @param {string} user.username - The name of the employee.
 * @param {string} user.password
 */
export async function login(user) {
  const res = new Promise((res, rej) => {
    db.get(
      "SELECT username,id FROM users WHERE username=$username AND password=$password;",
      {
        $username: user.username,
        $password: user.password,
      },
      (error, result) => {
        if (result !== undefined) {
          res(result);
        } else {
          rej();
        }
      }
    );
  });
  try {
    const user = await res;
    return user;
  } catch {
    return null;
  }
}

export async function createSession(id) {
  const res = new Promise((res, rej) => {
    const uuid = uuidv4();
    db.run(
      `INSERT INTO session(uuid,userid) VALUES ($uuid, $userid);`,
      {
        $uuid: uuid,
        $userid: id,
      },
      () => {
        res(uuid);
      }
    );
  });
  const uuid = await res;
  return uuid;
}
/**
 *
 * @param {string} session
 */

export async function matchSessionToUser(session) {
  const res = new Promise((resolve, reject) => {
    db.get(
      `SELECT users.id, users.username, users.email, users.isadmin
      FROM session
      JOIN users ON session.userid = users.id
      WHERE session.uuid = $uuid;
      `,
      {
        $uuid: session,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else resolve(result);
      }
    );
  });
  try {
    const user = await res;
    if (user !== undefined) {
      return user;
    } else return null;
  } catch (error) {
    console.log("Session is, ", session);
    console.log("Session is invalid");
    return null;
  }
}
