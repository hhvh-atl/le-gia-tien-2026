import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const registrations = sqliteTable("registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  registrantName: text("registrant_name").notNull(),
  deceasedName: text("deceased_name").notNull(),
  relationship: text("relationship").notNull(),
  prayerYear: integer("prayer_year").notNull(),
  groupName: text("group_name").notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const administrators = sqliteTable("administrators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["master", "group"] }).notNull(),
  groupName: text("group_name"),
  createdAt: text("created_at").notNull(),
});
