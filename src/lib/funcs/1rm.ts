export const Calculate1RMEpley = (weight: number, reps: number) => {
	return weight * (1 + (reps / 30))
}

export const Calculate1RMBrzycki = (weight: number, reps: number) => {
	return (weight) / (1.0278 - (0.0278 * reps))
}