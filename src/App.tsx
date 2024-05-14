import { useRef, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import Map from './components/Map'
import topoData_ from './assets/europa-simplified-topo.json';

const topoData: Topology = topoData_ as any;

const windowWidth = window.innerWidth;

function App() {
  const data = feature(topoData, topoData.objects.europa) as FeatureCollection;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const updateWindowWidth = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);


  return (
    <div className="max-w-[640px]">
      <p></p>
      <Map width={windowWidth} height={windowWidth * 1.4} data={data} />
    </div>
  )
}

export default App
