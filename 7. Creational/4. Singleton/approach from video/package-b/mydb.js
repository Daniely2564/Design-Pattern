import { Database } from "../Database.js";

export function getDbInstance() {
  return new Database("my-app-db", {
    url: "localhost:543",
    username: "user",
    password: "password",
  });
}
