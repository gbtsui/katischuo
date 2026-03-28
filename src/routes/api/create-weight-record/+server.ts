import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { trackedWeightDataPoint } from '$lib/db/schema';

export const POST: RequestHandler = async ({locals, request}) => {
	if (!locals.session?.userId) {
		return error(401, { message: 'Not signed in.' });
	}

	const data = await request.json()

	if (!data.weight || isNaN(parseFloat(data.weight))) {
		return error(400, {message: "Please input a weight."})
	}
	if (!data.weightUnit) {
		return error(400, {message: "Please include a weight unit."})
	}
	if (data.weightUnit !== "lbs" && data.weightUnit !== "kg") {
		return error(400, {message: "Invalid weight unit! Please either use 'kg' or 'lbs'."})
	}

	const KG_TO_LBS = 2.20462;

	const canonicalWeight = data.weightUnit === "lbs" ? data.weight : data.weight * KG_TO_LBS

	try {
		await db.insert(trackedWeightDataPoint).values({
			userId: locals.session.userId,
			weight: canonicalWeight
		})
	} catch (err) {
		console.error(err)
		if (err instanceof Error)	return error(500, {message: err.message ?? "unknown error occurred"})
		return error(500, {message: "unknown error occurred"})
	}


	return json({success: true})
}