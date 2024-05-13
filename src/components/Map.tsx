import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

interface MapProps {
    width: number;
    height: number;
    data: FeatureCollection;
}


export default function Map({ width, height, data }: MapProps) {
    const projection = d3
        .geoMercator()
        .scale(width / 1.2)
        .center([25, 60]);

    const geoPathGenerator = d3.geoPath().projection(projection);

    const allSvgPaths = data.features
        .map((shape) => {
            return (
                <path
                    key={shape.properties?.CNTR_CODE} // Add null check
                    d={geoPathGenerator(shape) || undefined}
                    stroke="lightGrey"
                    strokeWidth={0.5}
                    fill="grey"
                    fillOpacity={0.7}
                />
            );
        });

    return (
        <div>
            <svg width={width} height={height}>
                {allSvgPaths}
            </svg>
        </div>
    );
};