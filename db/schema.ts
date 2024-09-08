import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from 'drizzle-orm';

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userName: text("userName"),
  email: text("email"),
  password: text("password")
});

export const usersRelations = relations(users, ({ many }) => ({
  toDos: many(toDos),
}));


export const toDos = sqliteTable("to-dos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description"),
  done: integer("done", { mode: "boolean" }),
  userId: integer('userId')
});

export const toDosRelations = relations(toDos, ({ one }) => ({
  user: one(users, {
    fields: [toDos.userId],
    references: [users.id],
  }),
}));
