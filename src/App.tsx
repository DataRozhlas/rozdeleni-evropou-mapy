import { useRef, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import { Slider } from "@/components/ui/slider"

import Map from './components/Map'
import topoData_ from './assets/europa-simplified-topo.json';
import dictionary from './assets/dictionary.json';

const topoData: Topology = topoData_ as any;

// function findMinAndMax(data: any[][]) {
//   let min = Number.MIN_VALUE;
//   let max = Number.MAX_VALUE;

//   const cleanData = [...data];
//   cleanData.shift(); // Remove the header row

//   cleanData.forEach((row) => {
//     row.forEach((value) => {
//       if (value < min && value !== 0) {
//         min = value;
//       }

//       if (value > max) {
//         max = value;
//       }
//     });
//   });

//   return [min, max];

// }

const initialWidth = window.innerWidth > 620 ? 620 : window.innerWidth;

function App({ id }: { id: string }) {

  const geodata = feature(topoData, topoData.objects.europa) as FeatureCollection;

  const mapRef = useRef<HTMLDivElement>(null);

  const [currentYear, setCurrentYear] = useState(2023);

  const [metaData, setMetaData] = useState(null);
  const [data, setData] = useState(null);
  // const [minMax, setMinMax] = useState([0, 0]);

  const [mapWidth, setMapWidth] = useState(initialWidth);
  // const [loading, setLoading] = useState(true);


  useEffect(() => {
    const updateMapWidth = () => {
      if (mapRef.current) {
        setMapWidth(mapRef.current.offsetWidth);
        // setLoading(false);
      }
    };
    updateMapWidth(); // Initial update
    window.addEventListener('resize', updateMapWidth);

    return () => window.removeEventListener('resize', updateMapWidth);
  }, [mapRef]);


  useEffect(() => {
    const loadData = async () => {
      const metadata = await import(`./assets/${id}-meta.json`);
      const data = await import(`./assets/${id}.json`);
      setMetaData(metadata.default);
      setData(data.default);
      // setMinMax(findMinAndMax(data.default));
    };

    loadData();
  }, [id]);


  const [processedData, setProcessedData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    const processedFeatures = geodata.features.map((feature) => {
      const countryName = dictionary.find((entry) => entry[1] === feature.properties?.CNTR_CODE)?.[0];
      const yearIndex = (data[0] as (string | number)[]).indexOf(currentYear);
      const value = (data as (string | number)[][]).find((row: (string | number)[]) => row[0] === countryName)?.[yearIndex];
      return {
        ...feature,
        properties: {
          ...feature.properties,
          value,
          countryName,
        },
      };
    });

    const processed = {
      ...geodata,
      features: processedFeatures,
    };

    setProcessedData(processed);

  }, [currentYear, data]);

  const handleSliderValueChange = (value: number[]) => {
    setCurrentYear(value[0]);
  }


  return (
    <div>
      {processedData?.features && processedData.features.length > 0 && metaData ? (
        <div ref={mapRef} className="max-w-[620px]">
          <h1 className="text-4xl font-bold mb-2">{(metaData as any).title}</h1>
          <h2 className="mb-2">{(metaData as any).subtitle}</h2>
          <div className="relative">
            <div className="font-bold text-7xl absolute top-1 left-3 text-zinc-300">{currentYear}</div>
            <Map width={mapWidth} height={mapWidth * 1.2} geodata={processedData} /* minMax={minMax} */ />
            <Slider className="cursor-pointer px-3 pt-3" defaultValue={[currentYear]} max={2023} min={1960} step={1} onValueChange={handleSliderValueChange} />
          </div></div>) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default App
