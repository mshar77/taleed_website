import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertCategory,
  InsertProduct,
  InsertUser,
  banners,
  categories,
  faqs,
  products,
  siteSettings,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listCategories(includeInactive = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).where(includeInactive ? undefined : eq(categories.isActive, true)).orderBy(asc(categories.sortOrder), asc(categories.id));
}

export async function listProducts(includeInactive = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(includeInactive ? undefined : eq(products.isActive, true))
    .orderBy(desc(products.isFeatured), asc(products.sortOrder), desc(products.id));
}

export async function createCategory(input: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(categories).values(input);
  return result[0]?.insertId;
}

export async function updateCategory(id: number, input: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(categories).set(input).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
}

export async function createProduct(input: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(products).values(input);
  return result[0]?.insertId;
}

export async function updateProduct(id: number, input: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(products).set(input).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(products).set({ isActive: false }).where(eq(products.id, id));
}

export async function listBanners(includeInactive = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(banners).where(includeInactive ? undefined : eq(banners.isActive, true)).orderBy(asc(banners.sortOrder), asc(banners.id));
}

export async function listFaqs(includeInactive = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqs).where(includeInactive ? undefined : eq(faqs.isActive, true)).orderBy(asc(faqs.sortOrder), asc(faqs.id));
}

export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return result[0];
}
