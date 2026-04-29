import { pgTable, timestamp, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
});

export const feed_follows = pgTable("feedFollows",
    {
        id: uuid("id").primaryKey().defaultRandom().notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
        user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
    },
    (t) => ({
        uniqueUserFeed: uniqueIndex("unique_user_feed").on(t.user_id, t.feed_id),
    })
);


export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

