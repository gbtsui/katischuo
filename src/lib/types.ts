import type { InsertSet } from '$lib/db/schema';

export * from "$lib/db/schema"
export type TrackingSet = InsertSet & { completed?: boolean };