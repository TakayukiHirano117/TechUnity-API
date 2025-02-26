import { Hono } from "hono";
import { app } from "./index.js";
import prisma from "./lib/db.js";

export const recruits = new Hono();

// 募集一覧取得
recruits.get("/", async (c) => {
    console.log("fetched")
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
});

// 募集詳細取得
recruits.get("/:id", async (c) => {
  const recruit = await prisma.recruit.findUnique({
    where: {
      id: c.req.param("id"),
    },
    include: {
      creator: true,
      likes: true,
      applications: true,
      hires: true,
    },
  });

  if (!recruit) {
    return c.json({ error: "Recruit not found" }, 404);
  }

  return c.json(recruit);
});

// 募集作成
// recruits.post("/", async (c) => {
//   const {title, content, isPublished, repositoryUrl, creator} = c.req.param();

//   const recruit = await prisma.recruit.create({
//     data: {
//       title,
//       content,
//       isPublished,
//       repositoryUrl,
//       creator: {
//         connect: {
//           id: creatorId,
//         },
//       },
//     },
//   });

//   return c.json(recruit);
// });