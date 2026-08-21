import { eq, and } from "drizzle-orm";
import { status } from "elysia";
import { db } from "../../db";
import { categories } from "../../db/schema";
import type { CategoryModel } from "./model";

export abstract class CategoryService {
  static async getAll() {
    return db.select().from(categories);
  }

  static async getAllByUser(userId: number) {
    return db.select().from(categories).where(eq(categories.userId, userId));
  }

  static async getById(id: number, userId: number) {
    const result = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    return result[0] ?? null;
  }

  static async create(data: CategoryModel["create"], userId: number) {
    const existing = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.name, data.name), eq(categories.userId, userId)),
      );

    if (existing.length > 0)
      throw status(409, `Category "${data.name}" already exists`);

    const result = await db
      .insert(categories)
      .values({ ...data, userId })
      .returning();
    return result[0];
  }

  static async update(
    id: number,
    userId: number,
    data: CategoryModel["create"],
  ) {
    const existing = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.name, data.name),
          eq(categories.id, id),
          eq(categories.userId, userId),
        ),
      );

    if (existing.length > 0) {
      throw status(409, `Category "${data.name}" already exists`);
    }

    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();

    return result[0] ?? null;
  }

  static async delete(id: number, userId: number) {
    const result = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    return result[0] ?? null;
  }
}
