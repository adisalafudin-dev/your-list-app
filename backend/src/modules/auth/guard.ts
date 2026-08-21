import { Elysia } from "elysia";
import { status } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const AuthGuard = new Elysia({ name: "Auth.Guard" }).macro({
  isSignIn: {
    async resolve({ cookie: { session } }) {
      if (!session.value) throw status(401, "Unauthorized — please sign in");

      const userId = Number(session.value);
      const result = await db.select().from(users).where(eq(users.id, userId));
      const user = result[0];

      if (!user) throw status(401, "Unauthorized — invalid session");

      return { user: { id: user.id, email: user.email } };
    },
  },
});
