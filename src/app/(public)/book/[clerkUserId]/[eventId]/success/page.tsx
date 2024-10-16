import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { formatDateTime } from "@/lib/formatters";
import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function SuccessPage({
  params: { clerkUserId, eventId },
  searchParams: { startTime },
}: {
  params: { clerkUserId: string; eventId: string };
  searchParams: { startTime: string };
}) {
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, id, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(id, eventId), eq(isActive, true)),
  });

  if (event == null) {
    return notFound();
  }

  const calendarUser = await clerkClient().users.getUser(clerkUserId);
  const startTimeDate = new Date(startTime);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          Successfully booked <span className="text-primary">{event.name}</span>{" "}
          with <span className="text-primary">{calendarUser.fullName}</span>
        </CardTitle>
        <CardDescription>{formatDateTime(startTimeDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        You should receive an email confirmation shortly. You can safely close
        this page now.
      </CardContent>
    </Card>
  );
}
