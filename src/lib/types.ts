import type { InsertSet, SelectSet, SelectWorkout } from '$lib/db/schema';

export * from "$lib/db/schema"
export type TrackingSet = InsertSet & { completed?: boolean };
export type WorkoutWithSets = SelectWorkout & { sets: SelectSet[] }
