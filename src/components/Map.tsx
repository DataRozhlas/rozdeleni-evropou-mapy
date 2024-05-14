import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

interface MapProps {
    width: number;
    height: number;
    data: FeatureCollection;
}


export default function Map({ width, height, data }: MapProps) {
    const projection = d3.geoMercator();
    const geoPathGenerator = d3.geoPath().projection(projection);



    // Fit the map to the container
    projection.fitSize([width, height], data).scale(projection.scale() * 3.15).translate([projection.translate()[0] / 2, projection.translate()[1] * 1.95]);

    // Adjust the scale and translate properties to zoom in and center the map

    // Create a color scale
    const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, data.features.length]);


    const allSvgPaths = data.features
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
        });

    return (
        <div>
            <svg width={width} height={height}>


                {allSvgPaths}
            </svg>
        </div>
    );
};