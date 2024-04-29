"use server";

export const getJobs = async (keywords, numberJobs) => {
	let url = "https://www.free-work.com/api/job_postings?contracts=contractor&order=date";
	if (keywords) {
		url += "&searchKeywords=" + keywords;
	}

	let list = [];
	for (let i = 0; i < numberJobs / 350 - 1; i++) {
		list.push(350)
	}
	list.push(numberJobs % 350)

	let jobsData = [];
	for (let i = 1; i < list.length + 1; i++) {
		const urlFetch = url + "&page=" + i + "&itemsPerPage=" + list[i - 1];
		const data = await fetch(urlFetch, {
			headers: {
				'Accept': 'application/json'
			}
		}).then((res) => res.json());
		jobsData = [...jobsData, ...data];
	}

	const seen = {};
	const uniqueArray = jobsData.filter((obj) => {
		const key = JSON.stringify(obj);
		return seen.hasOwnProperty(key) ? false : (seen[key] = true);
	});
	return uniqueArray;
}