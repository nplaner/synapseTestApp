/* eslint-disable import/extensions */
/* eslint-disable lines-between-class-members */

import { Resource, State } from "synapse";
import { Email, Id, Text, Hash, Word, Password } from "synapse/build/lib/fields";
import { schema, expose } from "synapse/build/lib/abstract/Controllable";
import { field } from "synapse/build/lib/abstract/Validatable";

import db from "../victoria";

export default class User extends Resource {
  @field(new Id()) user_id: string;
  @field(new Word(3, 16)) username: string;
  @field(new Text()) password: string;

  @schema(User.schema.select("username", "password"))
  static async authenticate({ username, password }) {
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    const result = await db.query(query);
    const user = result.rows[0];
    if (user) {
      const instance = await User.restore(user);
      if (await Hash.validate(password, user.password)) return instance;
    }
    return State.FORBIDDEN("Incorrect username/password.");
  }

  @expose("POST /")
  @schema(User.schema.exclude("user_id", "password").extend({ password: new Hash(6) }))
  static async register({ username, password }) {
    const findQuery = `SELECT username FROM users WHERE username = '${username}'`;
    const findResult = await db.query(findQuery);
    if (!findResult.rows[0]) {
      const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
      const values = [`${username}`, `${password}`];
      const result = await db.query(query, values); //
      const toReturn = await User.create(result.rows[0]);
      return toReturn;
    }
    return State.FORBIDDEN("USERNAME MUST BE UNIQUE");
  }
}
