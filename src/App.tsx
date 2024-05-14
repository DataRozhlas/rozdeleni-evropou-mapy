import { useRef, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import Map from './components/Map'
import topoData_ from './assets/europa-simplified-topo.json';

const topoData: Topology = topoData_ as any;


function App() {
  const data = feature(topoData, topoData.objects.europa) as FeatureCollection;

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = useState(0);

  useEffect(() => {
    const updateMapWidth = () => {
      if (mapRef.current) {
        setMapWidth(mapRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', updateMapWidth);
    updateMapWidth(); // Initial update

    return () => window.removeEventListener('resize', updateMapWidth);
  }, []);


  return (
    <div ref={mapRef} className="max-w-[620px]">
      <p>{mapRef.current?.offsetWidth}</p>
      <Map width={mapWidth} height={mapWidth * 1.2} data={data} />
    </div>
  )
}

export default App
