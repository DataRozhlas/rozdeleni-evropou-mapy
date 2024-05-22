import * as d3 from 'd3';


interface LegendProps {
    id: string;
    minMax: number[];
}

const Legend = ({ id, minMax }: LegendProps) => {
    // Create a color scale
    let colorInterpolator: (t: number) => string;
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



    const colorScale = d3.scaleSequential(colorInterpolator).domain(minMax);

    // Create gradient stops
    const numStops = 10;
    const domain = colorScale.domain();
    const gradientStops = Array.from({ length: numStops }, (_, i) => i / (numStops - 1)).map(t => {
        // Map t back to the color scale domain
        const value = domain[0] + t * (domain[1] - domain[0]);
        return {
            offset: `${100 * t}%`,
            color: colorScale(value)
        };
    });

    // Create legend axis ticks
    const padding = 5; // Adjust as needed
    const x = d3.scaleLinear().range([padding, 180 - padding]).domain(colorScale.domain());
    const tickValues = [minMax[0], minMax[1]];
    const axisTicks = tickValues.map((tick, i) => ({
        value: tick,
        xOffset: i == 0 ? x(tick) + 10 : x(tick) - 15
    }));

    return (
        <svg width="190" height="30" viewBox={`-${padding} 0 ${180 + padding * 2} 30`}>
            <defs>
                <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    {gradientStops.map((stop, i) => (
                        <stop key={i} offset={stop.offset} stopColor={stop.color} />
                    ))}
                </linearGradient>
            </defs>
            <rect x={padding} width="170" height="12" fill="url(#legendGradient)" />
            <g transform={`translate(0, 20)`}>
                {axisTicks.map((tick, i) => (
                    <g key={i} transform={`translate(${tick.xOffset}, -7)`}>
                        <text dy="1em" textAnchor="middle" fontSize="85%">{i == 1 ? `${tick.value} %` : `${tick.value}`}</text>
                    </g>
                ))}
            </g>
        </svg>
    );
}
export default Legend;