import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import Map from './components/Map'
import topoData_ from './assets/europa-simplified-topo.json';

const topoData: Topology = topoData_ as any;

const windowWidth = window.innerWidth;

function App() {

  const data = feature(topoData, topoData.objects.europa) as FeatureCollection;

  console.log(data)

  return (
    <Map width={windowWidth} height={windowWidth * 1.4} data={data} />
  )
}

export default App
