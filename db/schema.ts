import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const toDos = sqliteTable("to-dos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description"),
  done: integer("done", { mode: "boolean" }),
});
