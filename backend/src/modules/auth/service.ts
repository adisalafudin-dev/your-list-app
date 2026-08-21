import { eq } from "drizzle-orm";
import { status } from "elysia";
import { db } from "../../db";
import { users } from "../../db/schema";
import type { AuthModel } from "./model";

export abstract class AuthService {
  static async register(data: AuthModel["register"]) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (existing.length > 0) {
      throw status(409, "Email already registered");
    }

    const passwordHash = await Bun.password.hash(data.password);

    const result = await db
      .insert(users)
      .values({ email: data.email, passwordHash })
      .returning({ id: users.id, email: users.email });

    return result[0];
  }

  static async validateCredentials(data: AuthModel["signIn"]) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));
    const user = result[0];

    if (!user) throw status(401, "Invalid email or password");

    const isValid = await Bun.password.verify(data.password, user.passwordHash);
    if (!isValid) throw status(401, "Invalid email or password");

    return { id: user.id, email: user.email };
  }
}
