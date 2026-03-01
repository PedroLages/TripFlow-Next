"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CITY_CONFIGS, type CitySlug } from '@/lib/city-colors'
import { activitySchema, defaultActivityValues, type ActivityFormData } from '@/lib/schemas/activity-schema'
import { toasts } from '@/lib/toast-helpers'
import { Camera, MapPin, Clock, DollarSign } from 'lucide-react'

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  dayLabel: string
  citySlug: CitySlug
  onSubmit?: (data: ActivityFormData) => void | Promise<void>
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  dayLabel,
  citySlug,
  onSubmit: onSubmitProp,
}) => {
  const config = CITY_CONFIGS[citySlug]
  const Icon = config.icon

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: defaultActivityValues,
  })

  const handleSubmit = async (data: ActivityFormData) => {
    try {
      if (onSubmitProp) {
        await onSubmitProp(data)
      }
      toasts.activityAdded(data.title)
      form.reset()
      onClose()
    } catch (error) {
      toasts.error("Failed to add activity", "Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            <span className="inline-flex items-center gap-1.5">
              <Icon size={14} style={{ color: `var(${config.cssVar})` }} />
              <span>{config.name} — {dayLabel}</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Visit The Bund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Cost Grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sightseeing">🏛️ Sightseeing</SelectItem>
                        <SelectItem value="dining">🍜 Dining</SelectItem>
                        <SelectItem value="transport">🚇 Transport</SelectItem>
                        <SelectItem value="accommodation">🏨 Accommodation</SelectItem>
                        <SelectItem value="other">📌 Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Helps organize your itinerary
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <DollarSign size={14} />
                      Estimated Cost (USD)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: helps track total trip expenses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location & Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MapPin size={14} />
                      Location (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="The Bund, Shanghai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Clock size={14} />
                      Start Time (optional)
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this activity..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Max 500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Placeholder */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Camera size={14} />
                    Photo URL (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add Activity"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
