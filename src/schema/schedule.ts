import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { timeToInt } from "@/lib/utils";
import { z } from "zod";

export const scheduleFormSchema = z.object({
  timezone: z.string().min(1, "Required"),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in HH:MM format"
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in HH:MM format"
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availbility, index) => {
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index &&
            a.dayOfWeek !== availbility.dayOfWeek &&
            timeToInt(a.startTime) < timeToInt(availbility.endTime) &&
            timeToInt(a.endTime) > timeToInt(availbility.startTime)
          );
        });

        if (overlaps) {
          ctx.addIssue({
            code: "custom",
            message: "Availability overlaps with another",
            path: [index],
          });
        }

        if (
          timeToInt(availbility.startTime) >= timeToInt(availbility.endTime)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "End time must be after Start time",
            path: [index],
          });
        }
      });
    }),
});
