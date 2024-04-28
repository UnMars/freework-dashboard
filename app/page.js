"use client"
import { useEffect, useState } from 'react';
import { getAllJobs } from '@/api/getAllJobs';
import DataTable from 'react-data-table-component';

export default function Home() {
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsData = await getAllJobs();
        setAllJobs(jobsData);
        console.log(jobsData)
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: 'Publication',
      selector: row => row.publishedAt,
      sortable: true,
    },
    {
      name: 'Titre',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'TJM',
      selector: row => row.dailySalary,
      sortable: true,
    },
    {
      name: 'Remote',
      selector: row => row.remoteMode,
      sortable: true,
    },
    {
      name: 'Durée',
      selector: row => row.duration,
      sortable: true,
    },
  ];

  return (
    <main className="flex flex-col items-center justify-between p-5">
      <h1 className="text-4xl font-bold my-5">Dashboard Free Work</h1>
      <div className="flex flex-col justify-center p-5 w-full">
        <h1 className="text-2xl font-bold">Liste des offres :</h1>
        <DataTable
          columns={columns}
          data={allJobs}
          progressPending={!allJobs.length}
        />
      </div >
    </main>

  );
}
