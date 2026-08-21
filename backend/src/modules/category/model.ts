import { t } from "elysia";

export const CategoryModel = {
  create: t.Object({
    name: t.String({ minLength: 1 }),
  }),
  update: t.Object({
    name: t.String({ minLength: 1 }),
  }),
  response: t.Object({
    id: t.Number(),
    name: t.String(),
    createdAt: t.Date(),
  }),
};
export type CategoryModel = {
  create: typeof CategoryModel.create.static;
  response: typeof CategoryModel.response.static;
};
