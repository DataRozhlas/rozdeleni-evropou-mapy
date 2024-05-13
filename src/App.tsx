import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import Map from './components/Map'
import topoData_ from './assets/europa-simplified-topo.json';

const topoData: Topology = topoData_ as any;

function App() {

  const data = feature(topoData, topoData.objects.europa) as FeatureCollection;

  console.log(data)

  return (
    <Map width={600} height={600} data={data} />
  )
}

export default App
