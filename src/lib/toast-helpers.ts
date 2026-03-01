import { toast } from "sonner"

export const toasts = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 3000,
    })
  },

  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 5000,
    })
  },

  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 4000,
    })
  },

  budgetSaved: () => {
    toast.success("Budget saved privately", {
      description: "Your budget is encrypted and only you can see it.",
      duration: 3000,
    })
  },

  activityAdded: (activityName: string) => {
    toast.success("Activity added", {
      description: `${activityName} has been added to your itinerary.`,
      duration: 3000,
    })
  },

  activityDeleted: () => {
    toast.error("Activity removed", {
      description: "The activity has been deleted from your itinerary.",
      duration: 3000,
    })
  },
}
