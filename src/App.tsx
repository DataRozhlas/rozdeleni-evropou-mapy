import { useRef, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { Topology } from "topojson-specification"
import { FeatureCollection } from 'geojson';
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

import Map from './components/Map'
import Legend from './components/Legend';
import topoData_ from './assets/europa-simplified-topo.json';
import dictionary from './assets/dictionary.json';

import { usePostMessageWithHeight } from './hooks/usePostHeightMessage'


const topoData: Topology = topoData_ as any;

function findMinAndMax(data: any[][]) {
  let min = 100;
  let max = 0;

  const cleanData = [...data];
  cleanData.shift(); // Remove the header row

  cleanData.forEach((row) => {
    row.forEach((value) => {
      if (value < min && value !== 0) {
        min = value;
      }

      if (value > max) {
        max = value;
      }
    });
  });

  return [min, max];

}

const initialWidth = window.innerWidth > 620 ? 620 : window.innerWidth;

function App({ id }: { id: string }) {

  const geodata = feature(topoData, topoData.objects.europa) as FeatureCollection;

  const mapRef = useRef<HTMLDivElement>(null);

  const { containerRef, postHeightMessage } = usePostMessageWithHeight(`map-${id}`)


  const [currentYear, setCurrentYear] = useState(2023);

  const [metaData, setMetaData] = useState(null);
  const [data, setData] = useState(null);
  const [minMax, setMinMax] = useState([0, 0]);

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

  useEffect(() => {
    if (data) {
      setMinMax(findMinAndMax(data));
    }
  }, [data]);


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

  const [tooltipEU, setTooltipEU] = useState("");
  const [tooltipCZ, setTooltipCZ] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [tooltipSelected, setTooltipSelected] = useState("Vyberte zemi z mapy");
  const [maxYear, setMaxYear] = useState(2023);
  const [minYear, setMinYear] = useState(2004);


  useEffect(() => {
    if (data) {
      const years = (data[0] as (string | number)[]).slice(1) as number[];
      setMaxYear(Math.max(...years));
      setMinYear(Math.min(...years));
      setCurrentYear(Math.max(...years));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const currentYearIndex = (data[0] as (string | number)[]).indexOf(currentYear);
      setTooltipEU(`Průměr EU: ${data[1][currentYearIndex]}\u00A0%`);
      setTooltipCZ(`Česko: ${(data as (string | number)[][]).find((country: (string | number)[]) => country[0] === "ČR")?.[currentYearIndex]}\u00A0%`); // Add a type assertion to 'data' and access the second element of the found country
    }
  }, [currentYear, data]);

  useEffect(() => {
    if (data) {
      const currentYearIndex = (data[0] as (string | number)[]).indexOf(currentYear);
      if (selectedCountry) {
        const selectedCountryData = (data as (string | number)[][]).find((country: (string | number)[]) => country[0] === selectedCountry);
        if (selectedCountryData) {
          setTooltipSelected(`${selectedCountry}: ${selectedCountryData[currentYearIndex]}\u00A0%`);
        }
      } else {
        setTooltipSelected("Vyberte zemi z mapy");
      }
    }
  }, [selectedCountry, currentYear, data]);


  const handleSliderValueChange = (value: number[]) => {
    const findClosest = (arr: number[], target: number) => {
      return arr.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
    }
    if (data) {
      const years = (data[0] as (string | number)[]).slice(1) as number[];
      const closestYear = findClosest(years, value[0]);
      setCurrentYear(closestYear);
    }
  }

  useEffect(() => {
    postHeightMessage()
  }, [processedData, containerRef, postHeightMessage])


  return (
    <div ref={containerRef} className='pb-3'>
      {processedData?.features && processedData.features.length > 0 && metaData ? (
        <div ref={mapRef} className="max-w-[620px]">
          <h1 className="text-4xl font-bold mb-2">{(metaData as any).title}</h1>
          <h2 className="mb-5">{(metaData as any).subtitle}</h2>
          <div className="mb-5 flex justify-evenly gap-1">
            <Badge className="text-center">{tooltipEU}</Badge>
            <Badge className="text-center" variant="secondary" >{tooltipCZ}</Badge>
            <Badge className="text-center" variant="secondary" >{tooltipSelected}</Badge>
          </div>
          <div className="relative">
            <div className="absolute top-1 left-3">
              <div className="font-bold text-7xl  text-zinc-300">{currentYear}
              </div>
              <div>
                <Legend id={id} minMax={minMax} />
              </div>

            </div>

            <Map width={mapWidth} height={mapWidth * 1.2} geodata={processedData} minMax={minMax} setTooltip={setSelectedCountry} id={id} />
            <Slider className="cursor-pointer px-3 pt-3" defaultValue={[currentYear]} max={maxYear} min={minYear} step={1} onValueChange={handleSliderValueChange} />
            <div className="flex justify-between text-xs pt-2">
              <p>{minYear}</p>
              <p>táhlem zobrazíte starší data</p>
              <p>{maxYear}</p>
            </div>

          </div>
          <div className="text-xs text-right mt-9">
            Zdroj dat: <a className="text-blue-700" href="https://europa.eu/eurobarometer/screen/home" target="_blank">Eurobarometr</a> a <a className="text-blue-700" href="https://cvvm.soc.cas.cz/cz/" target="_blank">CVVM</a>, vizualizace iROZHLAS.cz
          </div>
          <div className="text-xs mt-5">
            <span className="font-bold">Přesné znění otázky:</span> {(metaData as any).question}           </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default App
