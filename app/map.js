import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useState } from "react"

export default function MyMap(props) {
	const { position, zoom, width, height, jobs } = props;
	const [selectedFilter, setSelectedFilter] = useState('missions');

	const handleFilterSelection = (filter) => {
		setSelectedFilter(filter);
	};

	return (
		<div>
			<div className="flex items-center justify-center gap-2 mb-2">
				<button
					className={`px-2 py-1 rounded-md ${selectedFilter === 'missions' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
					onClick={() => handleFilterSelection('missions')}
				>Nombre de missions</button>
				<button
					className={`px-2 py-1 rounded-md ${selectedFilter === 'avgTjm' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
					onClick={() => handleFilterSelection('avgTjm')}
				>TJM moyen</button>
				<button
					className={`px-2 py-1 rounded-md ${selectedFilter === 'duration' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
					onClick={() => handleFilterSelection('duration')}
				>Durée moyenne</button>
			</div>

			<MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ width, height }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<HeatmapLayer
					points={jobs}
					longitudeExtractor={(m) => m.location.longitude}
					latitudeExtractor={(m) => m.location.latitude}
					intensityExtractor={(m) => selectedFilter === 'missions' ? 1 : selectedFilter === 'avgTjm' ? parseFloat((m.minDailySalary + m.maxDailySalary) / 2) : parseFloat(m.duration)}
					radius={10}
					minOpacity={1}
					useLocalExtrema={true}
				/>
			</MapContainer>
		</div>
	);
}