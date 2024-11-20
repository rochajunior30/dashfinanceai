"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { upsertUserSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertUserParams {
  userId?: string;
  name: string;
  whatsapp: string;
  email: string;
  credits: number;
}

export const upsertUser = async (params: UpsertUserParams) => {
  upsertUserSchema.parse(params);

  const { userId: authUserId } = await auth();
  if (!authUserId) {
    throw new Error("Unauthorized");
  }

  await db.users.upsert({
    update: { ...params },
    create: { ...params },
    where: {
      userId: params?.userId ?? "",
    },
  });

  revalidatePath("/users");
};
