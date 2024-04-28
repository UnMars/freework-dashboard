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
  const numberJobsRef = useRef(null);
  const [numberJobs, setNumberJobs] = useState(300);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const jobsData = await getJobs(keywords, numberJobs);
      setAllJobs(jobsData);
      setLoading(false);
      console.log(jobsData)
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      name: 'Entreprise',
      selector: row => row.company.name,
      sortable: true,
      reorder: true,
      width: '140px',
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
      <h1 className="text-4xl font-bold mt-2 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">Dashboard Free Work</h1>
      <div className="flex flex-row items-center justify-center">
        {loading ? <Loading className="w-8 h-8" /> : <Magnifier className="w-7 h-7 cursor-pointer" onClick={fetchData} />}
        <input
          ref={inputRef} type="text" placeholder="Entrer des mots-clés... Python, Javascript.."
          class="w-96 px-4 py-2 ml-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-md"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <div className="flex items-center mt-4">
        <label htmlFor="numberOfJobs" className="mr-2">Nombre de missions :</label>
        <select ref={numberJobsRef} onChange={(e) => setNumberJobs(e.target.value)} id="numberOfJobs" name="numberOfJobs" className="block  bg-white border border-gray-300 hover:border-gray-500 px-2 py-2 rounded shadow leading-tight focus:outline-none focus:border-blue-500">
          <option value="300">300</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
          <option value="3000">3000</option>
          <option value="5000">5000</option>
          <option value="10000">10000</option>
        </select>
      </div>

      <div className="flex flex-col justify-center p-5 w-full">
        <h1 className="text-2xl mb-2 font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">Offres de missions :</h1>
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
