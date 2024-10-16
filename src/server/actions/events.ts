"use server";

import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean } | undefined> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || !userId) {
    return { error: true };
  }

  await db.insert(EventTable).values({ ...data, clerkUserId: userId });

  redirect("/events");
}

export async function updateEvent(
  id: string,
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean } | undefined> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || !userId) {
    return { error: true };
  }

  const { rowCount } = await db
    .update(EventTable)
    .set({ ...data })
    .where(and(eq(EventTable.clerkUserId, userId), eq(EventTable.id, id)));

  if (rowCount === 0) {
    return { error: true };
  }

  redirect("/events");
}

export async function deleteEvent(id: string) {
  const { userId } = auth();

  if (!userId) {
    return { error: true };
  }

  const { rowCount } = await db
    .delete(EventTable)
    .where(and(eq(EventTable.clerkUserId, userId), eq(EventTable.id, id)));

  if (rowCount === 0) {
    return { error: true };
  }

  redirect("/events");
}
