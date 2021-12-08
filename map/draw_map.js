import { getAndPrepareData } from './getAndPrepareData.js';
import { tooltip } from './tooltip.js';
import { legend } from './legend.js';

getAndPrepareData().then(([topoJsonData, geoJson]) => {
    // map constants
    const [width, height] = [900, 700];
    const quantile = d3.scaleQuantile()
        .domain(topoJsonData.map(obj => obj.properties.eduData))
        .range(d3.schemePurples[9]);

    const { handleMouseover, handleMouseout, getGraphRect } = tooltip();
    const { legendBkg, legendColors, legendText } = legend(quantile);
    const resetZoomBtn = document.querySelector('button.reset-zoom');

    const svgArea = d3.select('div.graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 -100 ${width} ${height + 50}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const pathGen = d3.geoPath();

    // draw counties and assign properties:
    svgArea.append('g')
        .attr('class', 'zoomable')
        .selectAll('path')
        .data(topoJsonData)
        .enter()
        .append('path')
        .attr('d', pathGen)
        .attr('stroke', '#333')
        .attr('stroke-width', '0.02%')
        .attr('fill', d => quantile(d.properties.eduData))
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('data-county', d => d.properties.county)
        .attr('data-state', d => d.properties.state)
        .attr('data-education', d => d.properties.eduData)
        .on('mouseover', handleMouseover)
        .on('mouseout', handleMouseout);
    // (get div.graph-container dim after map is drawed, for tooltip position)
    getGraphRect();

    // draw state borders:
    svgArea
        .append('path')
        .datum(topojson.mesh(geoJson, geoJson.objects.states, (a, b) => a !== b))
        .attr('d', pathGen)
        .attr('stroke', '#333')
        .attr('stroke-width', '0.2%')
        .attr('fill', 'none')
        .attr('class', 'state')
        .attr('class', 'zoomable');

    // call and draw legend
    legendBkg(), legendColors(), legendText();

    // zoom behaviour
    const zoomed = ({ transform }) => svgArea.selectAll('.zoomable').attr("transform", transform);
    const zoom = d3.zoom()
        .on('zoom', zoomed)
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 6]);
    
    svgArea.call(zoom).on('wheel.zoom', null);
    resetZoomBtn.onclick = () => svgArea.transition().duration(750).call(zoom.transform, d3.zoomIdentity);  
})