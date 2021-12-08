export const legend = (quantile) => {
    //const xAxe = d3.axisBottom(quantile);
    const rectWidth = 60;
    const translateX = 200;
    const translateY = -50;

    const legendBkg = () =>
        d3.select('div.graph-container svg')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 580)
            .attr('height', 36)
            .attr('fill', '#222')
            .attr('transform', `translate(${translateX}, ${translateY - 28})`);

    const legendColors = () =>
        d3.select('div.graph-container svg')
            .append('g')
            .attr('id', 'legend')
            .selectAll('rect')
            .data([0, ...quantile.quantiles()])
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * rectWidth)
            .attr('width', rectWidth)
            .attr('y', 0)
            .attr('height', 10)
            .attr('transform', `translate(${translateX + 20}, ${translateY - 25})`)
            .attr('fill', d => quantile(d));

    const legendText = () =>
        d3.select('div.graph-container svg')
            .selectAll('text')
            .data(['(%)', ...quantile.quantiles()])
            .enter()
            .append('text')
            .attr('x', (d, i) => i * rectWidth)
            .attr('y', 0)
            .attr('fill', '#fff')
            .attr('font-size', '0.8rem')
            .attr('transform', `translate(${translateX + 10}, ${translateY})`)
            .text(d => d)
    return {
        legendBkg,
        legendColors,
        legendText
    }
}