"use server";

export const getJobs = async (urlFetch) => {
	const data = await fetch(urlFetch, {
		headers: {
			'Accept': 'application/json'
		}
	}).then((res) => res.json());
	return data;
}