import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	return new Response("From the mist, a shape, a ship is taking form / And the silence of the sea is about to drift into a storm\n")
}