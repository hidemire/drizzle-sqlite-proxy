import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  cityId: int('city_id'),
});

export const usersRelations = relations(users, ({ one }) => ({
  city: one(cities, {
    fields: [users.cityId],
    references: [cities.id],
  })
}))

export const cities = sqliteTable('cities', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});

export const citiesRelations = relations(cities, ({ many }) => ({
  users: many(users),
}));