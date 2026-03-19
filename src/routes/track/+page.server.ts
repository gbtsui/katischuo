import {db} from "$lib/server/db"
import {workout} from "$lib/server/db/schema"
import {eq} from "drizzle-orm"

export const actions = {
	createWorkout: async ({request, locals}) => {
		const formData = await request.formData()
	}
}