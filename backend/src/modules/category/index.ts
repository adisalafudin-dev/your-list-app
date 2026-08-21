import { Elysia, t } from "elysia";
import { CategoryService } from "./service";
import { CategoryModel } from "./model";
import { AuthGuard } from "../auth/guard";
import { ItemService } from "../item/service";

export const category = new Elysia({ prefix: "/categories" })
  .use(AuthGuard)
  .guard({ isSignIn: true }, (app) =>
    app
      .get("/", ({ user }) => CategoryService.getAllByUser(user.id))

      .get(
        "/:id",
        async ({ params, user, status }) => {
          const result = await CategoryService.getById(params.id, user.id);
          if (!result) return status(404, "Category not found");
          return result;
        },
        { params: t.Object({ id: t.Number() }) },
      )

      .post("/", ({ body, user }) => CategoryService.create(body, user.id), {
        body: CategoryModel.create,
        response: { 200: CategoryModel.response },
      })

      .patch(
        "/:id",
        async ({ params, body, user, status }) => {
          const result = await CategoryService.update(params.id, user.id, body);
          if (!result) return status(404, "Category not found");
          return result;
        },
        { params: t.Object({ id: t.Number() }), body: CategoryModel.update },
      )

      .delete(
        "/:id",
        async ({ params, user, status }) => {
          const result = await CategoryService.delete(params.id, user.id);
          if (!result) return status(404, "Category not found");
          return result;
        },
        { params: t.Object({ id: t.Number() }) },
      )

      .get(
        "/:id/items",
        async ({ params, query, user, status }) => {
          const cat = await CategoryService.getById(params.id, user.id);
          if (!cat) return status(404, "Category not found");
          return ItemService.search(params.id, {
            status: query.status,
            search: query.search,
          });
        },
        {
          params: t.Object({ id: t.Number() }),
          query: t.Object({
            status: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
        },
      ),
  );
