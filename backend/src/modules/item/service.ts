import { eq, and, ilike } from "drizzle-orm";
import { db } from "../../db";
import { items, itemTags, tags, categories } from "../../db/schema";
import type { ItemModel } from "./model";

export abstract class ItemService {
  static async getAll() {
    return db.select().from(items);
  }

  static async getByCategory(categoryId: number) {
    return db.select().from(items).where(eq(items.categoryId, categoryId));
  }

  static async getById(id: number) {
    const result = await db.select().from(items).where(eq(items.id, id));
    return result[0] ?? null;
  }

  static async search(
    categoryId: number,
    filters: { status?: string; search?: string },
  ) {
    const conditions = [eq(items.categoryId, categoryId)];

    if (filters.status) {
      conditions.push(eq(items.status, filters.status as any));
    }

    if (filters.search) {
      conditions.push(ilike(items.title, `%${filters.search}%`));
    }

    return db
      .select()
      .from(items)
      .where(and(...conditions));
  }

  static async create(data: ItemModel["create"]) {
    // Pastikan categoryId yang dikirim beneran ada
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, data.categoryId));

    if (category.length === 0) return null;

    const result = await db.insert(items).values(data).returning();
    return result[0];
  }

  static async update(id: number, data: ItemModel["update"]) {
    const result = await db
      .update(items)
      .set(data)
      .where(eq(items.id, id))
      .returning();

    return result[0] ?? null;
  }

  static async delete(id: number) {
    const result = await db.delete(items).where(eq(items.id, id)).returning();
    return result[0] ?? null;
  }

  static async getByCategoryAndStatus(categoryId: number, status?: string) {
    if (status) {
      return db
        .select()
        .from(items)
        .where(
          and(
            eq(items.categoryId, categoryId),
            eq(items.status, status as any),
          ),
        );
    }
    return db.select().from(items).where(eq(items.categoryId, categoryId));
  }

  static async getTags(itemId: number) {
    const result = await db
      .select({ id: tags.id, name: tags.name })
      .from(itemTags)
      .innerJoin(tags, eq(itemTags.tagId, tags.id))
      .where(eq(itemTags.itemId, itemId));

    return result;
  }

  static async addTag(itemId: number, tagId: number) {
    await db.insert(itemTags).values({ itemId, tagId }).onConflictDoNothing();

    return this.getTags(itemId);
  }

  static async removeTag(itemId: number, tagId: number) {
    await db
      .delete(itemTags)
      .where(and(eq(itemTags.itemId, itemId), eq(itemTags.tagId, tagId)));

    return this.getTags(itemId);
  }
}
