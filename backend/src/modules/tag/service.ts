import { eq, and } from "drizzle-orm";
import { status } from "elysia";
import { db } from "../../db";
import { tags } from "../../db/schema";
import type { TagModel } from "./model";

export abstract class TagService {
  static async getAllByUser(userId: number) {
    return db.select().from(tags).where(eq(tags.userId, userId));
  }

  static async create(data: TagModel["create"], userId: number) {
    const existing = await db
      .select()
      .from(tags)
      .where(and(eq(tags.name, data.name), eq(tags.userId, userId)));

    if (existing.length > 0) {
      throw status(409, `Tag "${data.name}" already exists`);
    }

    const result = await db
      .insert(tags)
      .values({ ...data, userId })
      .returning();
    return result[0];
  }

  static async delete(id: number, userId: number) {
    const result = await db
      .delete(tags)
      .where(and(eq(tags.id, id), eq(tags.userId, userId)))
      .returning();

    return result[0] ?? null;
  }
}
