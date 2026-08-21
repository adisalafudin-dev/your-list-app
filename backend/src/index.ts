import { Elysia } from "elysia";
import { category } from "./modules/category";
import { item } from "./modules/item";
import { auth } from "./modules/auth";
import { tag } from "./modules/tag";

const app = new Elysia()
  .onError(({ code, error, status }) => {
    console.error(`[${code}]`, error);

    switch (code) {
      case "VALIDATION":
        return status(422, {
          error: "Validation failed",
          details: error.message,
        });
      case "NOT_FOUND":
        return status(404, { error: "Resource not found" });
      case "PARSE":
        return status(400, { error: "Invalid request body" });
      default:
        // Kalau error ini berasal dari status() yang di-throw manual,
        // dia biasanya bawa properti `status`/`code` sendiri — pakai itu kalau ada.
        if (typeof error === "object" && error !== null && "status" in error) {
          const httpStatus = (error as any).status;
          const message =
            (error as any).response ?? (error as any).message ?? "Error";
          return status(
            httpStatus,
            typeof message === "string" ? { error: message } : message,
          );
        }
        return status(500, { error: "Internal server error" });
    }
  })
  .get("/", () => ({ status: "ok", message: "Listing Tracker API is running" }))
  .use(auth)
  .use(category)
  .use(item)
  .use(tag)
  .listen(3000);

console.log(
  `🦊 Listing Tracker is running at http://${app.server?.hostname}:${app.server?.port}`,
);
