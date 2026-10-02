import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  icon: varchar("icon", { length: 60 }).default("package").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  activeOrderIdx: index("categories_active_order_idx").on(table.isActive, table.sortOrder),
}));

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").references(() => categories.id),
  name: varchar("name", { length: 220 }).notNull(),
  code: varchar("code", { length: 120 }),
  brand: varchar("brand", { length: 120 }),
  description: text("description"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 300 }),
  imageWidth: int("imageWidth"),
  imageHeight: int("imageHeight"),
  status: mysqlEnum("status", ["available", "limited", "check", "unavailable"]).default("check").notNull(),
  tag: varchar("tag", { length: 80 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  activeFeaturedOrderIdx: index("products_active_featured_order_idx").on(table.isActive, table.isFeatured, table.sortOrder, table.id),
}));

export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").references(() => products.id).notNull(),
  url: text("url").notNull(),
  fileKey: varchar("fileKey", { length: 300 }).notNull(),
  width: int("width"),
  height: int("height"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const banners = mysqlTable("banners", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  text: text("text"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 300 }),
  linkUrl: text("linkUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").primaryKey(),
  companyName: varchar("companyName", { length: 180 }).notNull(),
  phone1: varchar("phone1", { length: 30 }),
  phone2: varchar("phone2", { length: 30 }),
  whatsapp1: varchar("whatsapp1", { length: 30 }),
  whatsapp2: varchar("whatsapp2", { length: 30 }),
  mapsUrl: text("mapsUrl"),
  address: text("address"),
  openingHours: varchar("openingHours", { length: 180 }),
  deliveryText: text("deliveryText"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;
export type Banner = typeof banners.$inferSelect;
export type InsertBanner = typeof banners.$inferInsert;
export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = typeof faqs.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;
