// src/components/Map.tsx
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function MyMap(props) {
	const { position, zoom, width, height, jobs } = props

	return <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ width, height }}>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<HeatmapLayer
			points={jobs}
			longitudeExtractor={(m) => m.location.longitude}
			latitudeExtractor={(m) => m.location.latitude}
			intensityExtractor={(m) => 1}
			radius={10}
			max={100}
			minOpacity={1}
			useLocalExtrema={true}
		/>

	</MapContainer>
}