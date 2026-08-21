import { t } from "elysia";

const statusEnum = t.Union([
  t.Literal("planning"),
  t.Literal("in_progress"),
  t.Literal("completed"),
  t.Literal("dropped"),
]);

export const ItemModel = {
  create: t.Object({
    title: t.String({ minLength: 1 }),
    categoryId: t.Number(),
    status: t.Optional(statusEnum),
  }),
  update: t.Object({
    title: t.Optional(t.String({ minLength: 1 })),
    status: t.Optional(statusEnum),
  }),
  response: t.Object({
    id: t.Number(),
    title: t.String(),
    categoryId: t.Number(),
    status: statusEnum,
    createdAt: t.Date(),
  }),
};

export type ItemModel = {
  create: typeof ItemModel.create.static;
  update: typeof ItemModel.update.static;
  response: typeof ItemModel.response.static;
};
