import { t } from "elysia";

export const AuthModel = {
  register: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
  }),
  signIn: t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
  }),
  userResponse: t.Object({
    id: t.Number(),
    email: t.String(),
  }),
};

export type AuthModel = {
  register: typeof AuthModel.register.static;
  signIn: typeof AuthModel.signIn.static;
  userResponse: typeof AuthModel.userResponse.static;
};
