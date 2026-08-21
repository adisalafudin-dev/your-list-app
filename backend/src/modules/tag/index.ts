import { Elysia, t } from "elysia";
import { TagService } from "./service";
import { TagModel } from "./model";
import { AuthGuard } from "../auth/guard";

export const tag = new Elysia({ prefix: "/tags" })
  .use(AuthGuard)
  .guard({ isSignIn: true }, (app) =>
    app
      .get("/", ({ user }) => TagService.getAllByUser(user.id))

      .post("/", ({ body, user }) => TagService.create(body, user.id), {
        body: TagModel.create,
        response: { 200: TagModel.response },
      })

      .delete(
        "/:id",
        async ({ params, user, status }) => {
          const result = await TagService.delete(params.id, user.id);
          if (!result) return status(404, "Tag not found");
          return result;
        },
        { params: t.Object({ id: t.Number() }) },
      ),
  );
