import debounce from './debounce.js';

export const tooltip = () => {
    const tooltip = d3.select('div.graph-container')
        .append('div')
        .attr('id', 'tooltip');

    const graphContainer = document.querySelector("div.graph-container");
    let graphRect;
    const getGraphRect = () => {
        graphRect = graphContainer.getBoundingClientRect();
    }

    window.addEventListener('resize', debounce(getGraphRect, 100));
    window.addEventListener('scroll', debounce(getGraphRect, 100));
    
    const handleMouseover = function(e, data) {
        // compute cursor x and y pos relative to div.graph-container,
        // and move tooltip to the cursor's left/right-top/bottom accordingly
        const tooltipPOS = () => {
            const cursorX = e.clientX - graphRect.left;
            const cursorY = e.clientY - graphRect.top;
            const x = cursorX < graphRect.width / 2
                ? `${cursorX + graphContainer.scrollLeft + 10}px`
                : `${cursorX + graphContainer.scrollLeft - 140 }px`;
            const y = cursorY < graphRect.height / 2
                ? `${cursorY + 10}px` 
                : `${cursorY - 60}px`; 
            return [x, y];
        }
        // update tooltip data and display
        tooltip
            .attr('data-education', data.properties.eduData)
            .html(`
                <p>${data.properties.county}, ${data.properties.state}</p>
                <p>${data.properties.eduData}%</p>
            `)
            .style('opacity', 0.85)
            .style('left', tooltipPOS()[0])
            .style('top', tooltipPOS()[1]);
        // highlight current hovered county
        d3.select(this)
            .attr('stroke', '#f00')
            .attr('stroke-width', '0.2%');
    }
    const handleMouseout = function () {
        d3.select(this)
            .attr('stroke', '#333')
            .attr('stroke-width', '0.02%')
        tooltip.style('opacity', 0)
    }
    return { handleMouseover, handleMouseout, getGraphRect }
}