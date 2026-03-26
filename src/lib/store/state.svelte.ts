//WHERE HAS THIS BEEN ALL MY LIFE????
//NEXTJS HOOKS HELLO WHATWHAT?????
//HAVE I BEEN PASSING PROPS MANUALLYU THE ENTIRE TIME??????

import type { TrackingSet } from '$lib/types';

type TrackWorkoutStateType = {
	templateName: string;
	setArray: Array<Partial<TrackingSet>>;
	workoutStartTime: Date | null;
}

export const TrackWorkoutState: TrackWorkoutStateType = $state({
	templateName: "Empty Workout",
	setArray: [],
	workoutStartTime: null,
})