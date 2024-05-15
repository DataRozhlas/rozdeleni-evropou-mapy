import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';
import { useEffect } from 'react';

interface MapProps {
    width: number;
    height: number;
    geodata: FeatureCollection;
    // minMax: number[];
}


export default function Map({ width, height, geodata/* minMax */ }: MapProps) {
    const projection = d3.geoMercator();
    const geoPathGenerator = d3.geoPath().projection(projection);

    // Fit the map to the container
    projection.fitSize([width, height], geodata).scale(projection.scale() * 3.15).translate([projection.translate()[0] / 2, projection.translate()[1] * 1.95]);
    // Create a color scale
    const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, geodata.features.length]);

    return (
        <svg width={width} height={height}>
            {geodata.features
                .map((shape, index) => {
                    return (
                        <path
                            key={shape.properties?.CNTR_CODE} // Add null check
                            d={geoPathGenerator(shape) || undefined}
                            stroke="lightGrey"
                            strokeWidth={0.5}
                            fill={colorScale(index)}
                            fillOpacity={0.7}
                        />
                    );
                })}
        </svg>
    );
};