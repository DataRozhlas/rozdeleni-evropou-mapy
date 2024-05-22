import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

interface MapProps {
    width: number;
    height: number;
    geodata: FeatureCollection;
    minMax: number[];
    setTooltip: (tooltip: string) => void;
    id: string;
}


export default function Map({ width, height, geodata, minMax, setTooltip, id }: MapProps) {
    const projection = d3.geoMercator();
    const geoPathGenerator = d3.geoPath().projection(projection);

    // Fit the map to the container
    projection.fitSize([width, height], geodata).scale(projection.scale() * 3.15).translate([projection.translate()[0] / 2, projection.translate()[1] * 1.95]);

    // Create a color scale
    let colorInterpolator;
    switch (id) {
        case "benefit":
            colorInterpolator = d3.interpolateGreens;
            break;
        case "curr":
            colorInterpolator = d3.interpolateOranges;
            break;
        case "trusteu":
            colorInterpolator = d3.interpolateBlues;
            break;
        case "citiz":
            colorInterpolator = d3.interpolateReds;
            break;
        default:
            colorInterpolator = d3.interpolateOranges;
    }

    // Create a color scale
    const colorScale = d3.scaleSequential(colorInterpolator).domain([minMax[0], minMax[1]]);

    return (
        <svg width={width} height={height}>
            {geodata.features
                .map((shape) => {
                    return (
                        <path
                            key={shape.properties?.CNTR_CODE} // Add null check
                            d={geoPathGenerator(shape) || undefined}
                            stroke="silver"
                            strokeWidth={0.5}
                            fill={colorScale(shape.properties?.value || 0)}
                            onMouseEnter={() => setTooltip(shape.properties?.countryName)}
                            onTouchStart={() => setTooltip(shape.properties?.countryName)}

                        />
                    );
                })}
        </svg>
    );
};