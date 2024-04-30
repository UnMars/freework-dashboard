"use server";

export const getJobsCount = async (urlFetch) => {
	let url = 'https://www.free-work.com/api/job_postings/count?';
	url += urlFetch.split('https://www.free-work.com/api/job_postings?')[1];
	const data = await fetch(url).then((res) => res.json());
	return data;
}