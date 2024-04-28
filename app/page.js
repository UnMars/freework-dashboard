"use client"
import { useEffect, useState, useRef } from 'react';
import { getJobs } from '@/api/getJobs';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import 'moment/locale/fr';
import Loading from '@/assets/loading';
import Magnifier from '@/assets/magnifier';
moment().locale('fr')

export default function Home() {
  const [allJobs, setAllJobs] = useState([]);
  const [keywords, setKeywords] = useState('');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobsData = await getJobs('');
        setAllJobs(jobsData);
        setLoading(false);
        console.log(jobsData)
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobsData = await getJobs(keywords);
        setAllJobs(jobsData);
        setLoading(false);
        console.log(jobsData)
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchData();
  }, [keywords]);

  const columns = [
    {
      name: 'Publication',
      selector: row => row.publishedAt,
      format: row => "il y a " + moment.duration(moment().diff(moment(row.publishedAt))).humanize(),
      sortable: true,
      reorder: true,
      width: '120px',
    },
    {
      name: 'Titre',
      selector: row => row.title,
      reorder: true,
      width: '300px',
    },
    {
      name: 'TJM',
      selector: row => row.dailySalary,
      sortable: true,
      reorder: true,
      width: '110px',
    },
    {
      name: 'Remote',
      selector: row => row.remoteMode,
      format: row => row.remoteMode === 'full' ? 'Full' : row.remoteMode === 'partial' ? 'Partiel' : 'Non précisé',
      sortable: true,
      reorder: true,
      width: '120px',
    },
    {
      name: 'Durée',
      selector: row => row.duration,
      format: row => row.duration ? `${row.duration} mois` : 'Non précisé',
      sortable: true,
      reorder: true,
      width: '100px',
    },
    {
      name: 'Skills',
      selector: row => row.skills,
      format: row => row.skills.map(obj => obj.name).join(', '),
      sortable: true,
      reorder: true,
    },
    {
      name: 'Soft Skills',
      selector: row => row.softSkills,
      format: row => row.softSkills.map(obj => obj.name).join(', '),
      sortable: true,
      reorder: true,
    },
    {
      name: 'Ville',
      selector: row => row.location.locality,
      sortable: true,
      reorder: true,
      width: '120px',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-between p-5">
      <h1 className="text-4xl font-bold mt-2 mb-6">Dashboard Free Work</h1>
      <div className="flex flex-row items-center justify-center">
        {loading ? <Loading className="w-8 h-8" /> : <Magnifier className="w-7 h-7" />}
        <input
          ref={inputRef} type="text" placeholder="Entrer des mots-clés... Python, Javascript.."
          class="w-96 px-4 py-2 ml-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-center p-5 w-full">
        <h1 className="text-2xl font-bold">Offres de missions :</h1>
        <DataTable
          columns={columns}
          data={allJobs}
          progressPending={loading}
          pagination={true}
          fixedHeader={true}
          fixedHeaderScrollHeight="60vh"
          highlightOnHover={true}
          pointerOnHover={true}
          dense={true}
          onRowClicked={(row) => window.open("https://www.free-work.com/fr/tech-it/" + row.job.slug + "/job-mission/" + row.slug, '_blank')}
        />
      </div >
    </main>

  );
}
