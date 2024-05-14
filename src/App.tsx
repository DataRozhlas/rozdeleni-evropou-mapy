import { useRef, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import { Slider } from "@/components/ui/slider"

import Map from './components/Map'
import topoData_ from './assets/europa-simplified-topo.json';

const topoData: Topology = topoData_ as any;


function App() {
  const data = feature(topoData, topoData.objects.europa) as FeatureCollection;

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2023);

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

  const handleSliderValueChange = (value: number[]) => {
    setCurrentYear(value[0]);
  }


  return (
    <div ref={mapRef} className="max-w-[620px]">
      <div className="font-bold text-7xl absolute top-1 left-3 text-zinc-300">{currentYear}</div>
      <Map width={mapWidth} height={mapWidth * 1.2} data={data} />
      <Slider className="cursor-pointer px-3 pt-3" defaultValue={[currentYear]} max={2023} min={1960} step={1} onValueChange={handleSliderValueChange} />
    </div>
  )
}

export default App
