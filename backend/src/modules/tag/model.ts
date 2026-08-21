import { t } from "elysia";

export const TagModel = {
  create: t.Object({
    name: t.String({ minLength: 1 }),
  }),
  response: t.Object({
    id: t.Number(),
    name: t.String(),
    createdAt: t.Date(),
  }),
};

export type TagModel = {
  create: typeof TagModel.create.static;
  response: typeof TagModel.response.static;
};
