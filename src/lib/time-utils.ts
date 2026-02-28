import { type Activity } from './itinerary-data';

/**
 * Parses a time string like "09:00 AM" or "14:30" into total minutes from midnight.
 */
export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;

  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Formats flat minutes back into a 12-hour time string "HH:MM AM/PM".
 */
export function formatTime(totalMinutes: number): string {
  const m = Math.round(totalMinutes);
  let hours = Math.floor(m / 60) % 24;
  const minutes = m % 60;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedMins = minutes.toString().padStart(2, '0');
  return `${hours}:${paddedMins} ${ampm}`;
}

export interface Conflict {
  type: 'overlap' | 'tight-transit';
  message: string;
}

/**
 * Checks a sorted array of activities for chronological conflicts.
 * Evaluates overlapping times and insufficient transit durations.
 * Returns a map of activityID -> Conflict object for the succeeding activity.
 */
export function calculateConflicts(activities: Activity[]): Record<string, Conflict> {
  const conflicts: Record<string, Conflict> = {};

  for (let i = 0; i < activities.length - 1; i++) {
    const current = activities[i];
    const next = activities[i + 1];

    const currentStartMins = parseTime(current.time);
    const currentEndMins = currentStartMins + current.duration;

    const transitDuration = current.transitToNext?.duration ?? 0;
    const requiredDepartureTime = currentEndMins + transitDuration;

    const nextStartMins = parseTime(next.time);

    // 1. Direct overlap: Current activity hasn't finished when the next starts (or very tight 0 min buffer)
    if (nextStartMins < currentEndMins) {
      const overlapMins = currentEndMins - nextStartMins;
      conflicts[next.id] = {
        type: 'overlap',
        message: `Overlaps by ${overlapMins} min with previous activity.`
      };
    }
    // 2. Tight transit: They don't overlap, but there's not enough time to commute
    else if (nextStartMins < requiredDepartureTime && transitDuration > 0) {
      const shortfall = requiredDepartureTime - nextStartMins;
      conflicts[next.id] = {
        type: 'tight-transit',
        message: `Tight transit: Need ${transitDuration}m for transport, but only have ${nextStartMins - currentEndMins}m gap.`
      };
    }
  }

  return conflicts;
}
