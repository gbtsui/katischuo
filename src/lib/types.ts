import type { InsertSet, SelectSet, SelectWorkout, SelectExercise } from '$lib/db/schema';

export * from "$lib/db/schema";

export type TrackingSet = InsertSet & { completed?: boolean };

export type SetWithExercise = {
	exercise: SelectExercise;
	sets: SelectSet[];
};

export type WorkoutWithExercises = SelectWorkout & {	exercises: SetWithExercise[] }
export type WorkoutWithSets = SelectWorkout & { sets: SelectSet[] };

//son of swordsman born a warrior
//insubordinate tempting fate
//and in the shadow of the rising sun
//he would duel with the great