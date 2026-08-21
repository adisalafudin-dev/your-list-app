import { Elysia, t } from "elysia";
import { ItemService } from "./service";
import { ItemModel } from "./model";

export const item = new Elysia({ prefix: "/items" })
  .get("/", () => ItemService.getAll())

  .get(
    "/:id",
    async ({ params, status }) => {
      const result = await ItemService.getById(params.id);
      if (!result) return status(404, "Item not found");
      return result;
    },
    {
      params: t.Object({ id: t.Number() }),
    },
  )

  .post(
    "/",
    async ({ body, status }) => {
      const result = await ItemService.create(body);
      if (!result)
        return status(400, "Invalid categoryId — category does not exist");
      return result;
    },
    {
      body: ItemModel.create,
    },
  )

  .get("/:id/tags", async ({ params }) => ItemService.getTags(params.id), {
    params: t.Object({ id: t.Number() }),
  })

  .post(
    "/:id/tags/:tagId",
    async ({ params }) => ItemService.addTag(params.id, params.tagId),
    { params: t.Object({ id: t.Number(), tagId: t.Number() }) },
  )

  .delete(
    "/:id/tags/:tagId",
    async ({ params }) => ItemService.removeTag(params.id, params.tagId),
    { params: t.Object({ id: t.Number(), tagId: t.Number() }) },
  )

  .patch(
    "/:id",
    async ({ params, body, status }) => {
      const result = await ItemService.update(params.id, body);
      if (!result) return status(404, "Item not found");
      return result;
    },
    { params: t.Object({ id: t.Number() }), body: ItemModel.update },
  )

  .delete(
    "/:id",
    async ({ params, status }) => {
      const result = await ItemService.delete(params.id);
      if (!result) return status(404, "Item not found");
      return result;
    },
    {
      params: t.Object({ id: t.Number() }),
    },
  );
