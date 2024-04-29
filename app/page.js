"use client"
import { useEffect, useState, useRef } from 'react';
import { getJobs } from '@/api/getJobs';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import 'moment/locale/fr';
import Loading from '@/assets/loading';
import Magnifier from '@/assets/magnifier';
import { AreaChart, DonutChart } from '@tremor/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
moment().locale('fr')

export default function Home() {
  const [allJobs, setAllJobs] = useState([]);
  const [keywords, setKeywords] = useState('');
  const inputRef = useRef(null);
  const numberJobsRef = useRef(null);
  const [numberJobs, setNumberJobs] = useState(300);
  const [loading, setLoading] = useState(false);

  // statistics
  const [numberJobsPerDay, setNumberJobsPerDay] = useState([]);
  const [numberJobsPerTechno, setNumberJobsPerTechno] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
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
        const data = await getJobs(urlFetch);
        jobsData = [...jobsData, ...data];
      }
      const seen = {};
      const uniqueArray = jobsData.filter((obj) => {
        const key = JSON.stringify(obj);
        return seen.hasOwnProperty(key) ? false : (seen[key] = true);
      });

      setAllJobs(uniqueArray);
      setLoading(false);

      let dataGraph = []
      jobsData.forEach(job => {
        const date = moment(job.publishedAt).format('DD/MM/YYYY');
        const existingItem = dataGraph.find(item => item.date === date);

        if (existingItem) {
          existingItem['Nombre de missions'] += 1;
        } else {
          dataGraph.push({ date, 'Nombre de missions': 1 });
        }
      });
      setNumberJobsPerDay(dataGraph);

      let dataGraphTechno = []
      jobsData.forEach(job => {
        job.skills.forEach(skill => {
          const existingItem = dataGraphTechno.find(item => item.name === skill.name);

          if (existingItem) {
            existingItem['Nombre de missions'] += 1;
          } else {
            dataGraphTechno.push({ name: skill.name, 'Nombre de missions': 1 });
          }
        });
      });
      // order by number of jobs
      dataGraphTechno.sort((a, b) => b['Nombre de missions'] - a['Nombre de missions']);
      // limit to 10
      dataGraphTechno = dataGraphTechno.slice(0, 10);
      setNumberJobsPerTechno(dataGraphTechno);

    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchData();
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
      width: '200px',
    },
    {
      name: 'Soft Skills',
      selector: row => row.softSkills,
      format: row => row.softSkills.map(obj => obj.name).join(', '),
      sortable: true,
      reorder: true,
      width: '150px',
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
    <main className="flex flex-col items-center justify-center w-full h-full p-5">
      <SpeedInsights />
      <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-transparent bg-clip-text text-center">Dashboard Free-Work
      </h1>
      <div className="flex flex-row items-center justify-center">
        {loading ? <Loading className="w-8 h-8" /> : <Magnifier className="w-7 h-7 cursor-pointer" onClick={fetchData} />}
        <input
          ref={inputRef} type="text" placeholder="Entrer des mots-clés... Python, Javascript.."
          className="w-[80vw] md:w-96 max-w-96 px-4 py-2 ml-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-md"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex items-center mt-4">
        <label htmlFor="numberOfJobs" className="mr-2">Nombre de missions max :</label>
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
          progressComponent={<Loading className="w-20 h-[50.5vh]" />}
          noDataComponent={<h2 className="text-xl font-bold text-center">Aucune mission trouvée</h2>}
          pagination={true}
          fixedHeader={true}
          fixedHeaderScrollHeight="60vh"
          highlightOnHover={true}
          pointerOnHover={true}
          dense={true}
          onRowClicked={(row) => window.open("https://www.free-work.com/fr/tech-it/" + row.job.slug + "/job-mission/" + row.slug, '_blank')}
        />
        <div className="flex flex-col md:flex-row justify-center mt-4 gap-5">
          <div className="flex flex-col w-full">
            <h3 className="text-lg font-medium -mb-5">
              Nombre de missions par jour
            </h3>
            <AreaChart
              data={numberJobsPerDay}
              index="date"
              categories={['Nombre de missions']}
              colors={['blue']}
              yAxisWidth={60}
              showAnimation={true}
              className='py-5'
            />
          </div>
          <div className="flex flex-col w-full">
            <h3 className="text-lg font-medium">
              Répartition des technos demandées (top 10)
            </h3>
            <DonutChart
              data={numberJobsPerTechno}
              category="Nombre de missions"
              index="name"
              colors={['blue', 'sky', 'cyan', 'teal', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']}
              className="w-full h-72 md:h-full p-4 md:p-10"
              showAnimation={true}
              label={numberJobsPerTechno[0] ? numberJobsPerTechno[0].name : ''}
            />
          </div>
        </div>
      </div >
    </main>

  );
}
