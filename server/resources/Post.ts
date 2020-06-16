/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable lines-between-class-members */

import { Resource, State } from "synapse";
import { Email, Id, Text, Hash, Word, Password } from "synapse/lib/fields";
import { schema, expose, uses, affects } from "synapse/lib/abstract/Controllable";
import { field } from "synapse/lib/abstract/Validatable";
import User from "./User";
import Session from "./Session";

import db = require("../victoria");

export default class Message extends Resource {
  @field(new Id()) message_id: string;
  @field(new Text()) message: string;
  @field(new Id()) posted_by: string;
  @field(new Text()) created_at: string;
  @field(new Text()) tag_name: string;
  @field(new Word(3, 16, "null")) username: string;

  @schema(Message.union(Session).select("message_id", "client_id"))
  static async verifyAuthor({ message_id, client_id }) {
    const messageQuery = `SELECT * FROM messages WHERE message_id = '${message_id}'`;
    const sessionQuery = `SELECT * FROM sessions WHERE client_id = '${client_id}'`;
    const sessionResult = await db.query(sessionQuery);
    const messageResult = await db.query(messageQuery);
    const { posted_by } = messageResult.rows[0];
    const { user_id } = sessionResult.rows[0];
    if (user_id === posted_by) return State.OK();
    return State.UNAUTHORIZED();
  }

  @expose("DELETE /:message_id")
  @schema(Message.union(Session).select("message_id", "client_id"))
  static async remove({ message_id, client_id }) {
    const allowed = await Message.verifyAuthor({ message_id, client_id });
    if (!allowed.isError()) {
      const query = `DELETE FROM messages WHERE message_id = '${message_id}'`;
      return db.query(query).then((res) => State.OK());
    }
    return State.UNAUTHORIZED();
  }

  @expose("PATCH /:message_id")
  @schema(Message.union(Session).select("message_id", "message", "client_id"))
  static async update({ message_id, message, client_id }) {
    const allowed = await Message.verifyAuthor({ message_id, client_id });
    if (!allowed.isError()) {
      const query = `UPDATE messages
                     SET message = '${message}'
                     WHERE message_id = '${message_id}'
                     RETURNING *`;
      const result = await db.query(query);
      const tagQuery = `SELECT tag_name FROM tags WHERE message_id = '${message_id}'`;
      const tagResult = await db.query(tagQuery);
      const { tag_name } = tagResult.rows[0];
      return Message.create({ ...result.rows[0], tag_name });
    }
    return State.UNAUTHORIZED();
  }

  @expose("POST /")
  @schema(Message.union(Session).select("message", "client_id", "tag_name"))
  @affects("/:tag_name")
  static async post({ message, client_id, tag_name }) {
    // const userQuery = `SELECT user_id FROM sessions WHERE client_id = '${client_id}'`;
    // const userResult = await db.query(userQuery);
    // const { user_id } = userResult.rows[0];
    // const query = `BEGIN TRANSACTION
    //                INSERT INTO messages (message, posted_by)
    //                  VALUES (`${message}`, `${user_id}`);
    //                INSERT INTO tags (message_id, tag_name)
    //                  VALUES(`${message_id}`, `${tag_name}`);
    //                 COMMIT;
    //                `
    const userQuery = `SELECT user_id FROM sessions WHERE client_id = '${client_id}'`;
    const userResult = await db.query(userQuery);
    const { user_id } = userResult.rows[0];
    const messageQuery = `INSERT INTO messages (message, posted_by) VALUES ($1, $2) RETURNING *`;
    const messageValues = [`${message}`, `${user_id}`];
    const messageResult = await db.query(messageQuery, messageValues);
    const { message_id, created_at, posted_by } = messageResult.rows[0];
    const tagQuery = `INSERT INTO tags (message_id, tag_name) VALUES($1, $2) RETURNING *`;
    const tagValues = [`${message_id}`, `${tag_name}`];
    const tagResult = await db.query(tagQuery, tagValues);
    return Message.create({ message_id, message, posted_by, created_at, tag_name });
  } // username
  /*
 @field(new Id()) message_id: string; 
  @field(new Text()) message: string; ++ 
  @field(new Id()) posted_by: string;
  @field(new Text()) created_at: string; 
  @field(new Text()) tag_name: string; ++
*/ @expose(
    "GET /:tag_name"
  )
  @schema(Message.schema.select("tag_name"))
  static async getByTag({ tag_name }) {
    const query = `SELECT * FROM messages m INNER JOIN tags t ON m.message_id = t.message_id INNER JOIN users u ON m.posted_by = u.user_id WHERE t.tag_name = '${tag_name}'`;
    const messages = await db.query(query);
    return Message.collection(<Array<object>>messages.rows);
  }
}
