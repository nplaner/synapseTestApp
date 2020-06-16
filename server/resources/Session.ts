/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable lines-between-class-members */

import { Resource, State } from "synapse";
import { Email, Id, Text, Hash, Word, Password } from "synapse/lib/fields";
import { schema, expose } from "synapse/lib/abstract/Controllable";
import { field } from "synapse/lib/abstract/Validatable";

import User from "./User";

import db = require("../victoria");

export default class Session extends Resource {
  @field(new Id()) user_id: string;
  @field(new Id()) client_id: string;
  @expose("GET /")
  @schema(Session.schema.select("client_id"))
  static async getSession({ client_id }) {
    const query = `SELECT * FROM sessions WHERE client_id ='${client_id}'`;
    const sessionResult = await db.query(query);
    const session = sessionResult.rows[0];
    if (session) return Session.restore(session);
    return State.NOT_FOUND();
  }

  @expose("POST /")
  @schema(Session.union(User).select("username", "password", "client_id"))
  static async createSession({ username, password, client_id }) {
    const userResult = <User>await User.authenticate({ username, password });
    if (userResult.isError()) return userResult;
    const query = `INSERT INTO sessions (user_id, client_id) VALUES ($1, $2) RETURNING *`;
    const values = [`${userResult.user_id}`, `${client_id}`];
    const result = await db.query(query, values);

    return Session.create(result.rows[0]);
  }

  @expose("DELETE /:client_id")
  @schema(Session.schema.select("client_id"))
  static async deleteSession({ client_id }) {
    const query = `DELETE FROM sessions where client_id = '${client_id}'`;
    return db.query(query).then((res) => State.OK());
  }

  // @expose("GET /")
}
