import { z } from "zod"

export const activitySchema = z.object({
  title: z
    .string()
    .min(3, "Activity name must be at least 3 characters")
    .max(100, "Activity name is too long"),

  category: z.enum(["sightseeing", "dining", "transport", "accommodation", "other"], {
    message: "Please select a category",
  }),

  startTime: z.string().optional(),

  duration: z
    .number()
    .min(15, "Minimum duration is 15 minutes")
    .max(1440, "Maximum duration is 24 hours")
    .optional(),

  estimatedCost: z
    .number()
    .min(0, "Cost cannot be negative")
    .max(100000, "Cost seems unrealistic")
    .optional(),

  location: z.string().optional(),

  notes: z.string().max(500, "Notes are too long").optional(),

  imageUrl: z.string().url().optional().or(z.literal("")),
})

export type ActivityFormData = z.infer<typeof activitySchema>

export const defaultActivityValues: Partial<ActivityFormData> = {
  category: "sightseeing",
  title: "",
  notes: "",
  imageUrl: "",
}
