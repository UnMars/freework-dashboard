"use server";

export const getAllJobs = async () => {
	const data = await fetch("https://www.free-work.com/api/job_postings?itemsPerPage=30&contracts=contractor&order=date", {
		headers: {
			'Accept': 'application/json'
		}
	}).then((res) => res.json());
	return data;
}