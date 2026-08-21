import { Elysia, t } from "elysia";
import { AuthService } from "./service";
import { AuthModel } from "./model";
import { AuthGuard } from "./guard";
import { checkRateLimit } from "./rateLimiter";

export const auth = new Elysia({ prefix: "/auth" })
  .post("/register", async ({ body }) => AuthService.register(body), {
    body: AuthModel.register,
    response: { 200: AuthModel.userResponse },
  })

  .post(
    "/sign-in",
    async ({ body, cookie: { session }, request, status }) => {
      const ip = request.headers.get("x-forwarded-for") ?? "unknown";

      if (!checkRateLimit(ip)) {
        return status(429, "Too many sign-in attempts. Try again later.");
      }

      const user = await AuthService.validateCredentials(body);
      session.value = String(user.id);
      session.httpOnly = true;
      session.maxAge = 7 * 24 * 60 * 60;
      return user;
    },
    {
      body: AuthModel.signIn,
      response: { 200: AuthModel.userResponse, 429: t.String() },
    },
  )
  .post("/sign-out", ({ cookie: { session } }) => {
    session.remove();
    return { message: "Signed out" };
  })

  .use(AuthGuard)
  .guard({ isSignIn: true }, (app) => app.get("/me", ({ user }) => user));
