import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

export const itemStatusEnum = pgEnum("item_status", [
  "planning",
  "in_progress",
  "completed",
  "dropped",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    status: itemStatusEnum("status").default("planning").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    categoryIdx: index("items_category_id_idx").on(table.categoryId),
    statusIdx: index("items_status_idx").on(table.status),
  }),
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdx: index("categories_user_id_idx").on(table.userId),
  }),
);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // random token, BUKAN userId
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ...users, categories, items, itemStatusEnum yang sudah ada...

export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("tags_user_id_idx").on(table.userId),
  }),
);

export const itemTags = pgTable(
  "item_tags",
  {
    itemId: integer("item_id")
      .references(() => items.id, { onDelete: "cascade" })
      .notNull(),
    tagId: integer("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.itemId, table.tagId] }),
  }),
);
