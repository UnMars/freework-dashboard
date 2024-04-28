"use server";

export const getJobs = async (keywords) => {
	let url = "https://www.free-work.com/api/job_postings?itemsPerPage=350&contracts=contractor&order=date";
	if (keywords) {
		url += "&searchKeywords=" + keywords;
	}
	const data = await fetch(url, {
		headers: {
			'Accept': 'application/json'
		}
	}).then((res) => res.json());
	return data;
}