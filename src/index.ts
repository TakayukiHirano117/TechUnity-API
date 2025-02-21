import { serve } from "@hono/node-server";
import { Hono } from "hono";
import prisma from "./lib/db.js";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/recruits", async (c) => {
  const recruits = await prisma.recruit.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    include: {
      creator: true,
      likes: true,
      applications: true,
      hires: true,
    },
  });

  return c.json(recruits);
})

const port = 8787;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: 8787,
});
