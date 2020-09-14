d3.csv("../data/squirrelActivities.csv").then
(data => {
    const svgWidth = 500
    const svgHeight = 500

    // console.log(data)
    // console.log(data.map(d => d.activity))

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.activity))
        .range([0, svgWidth])
        .paddingInner(0.2);

    console.log(xScale('eating'), xScale.bandwidth())

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d.count))])
        .range([svgHeight, 0]);
    
    const svg = d3.select('#my-svg')

    const bars = svg.selectAll('rect.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('height', d => svgHeight - yScale(d.count))
        //.attr('width', svgWidth / data.length)
        .attr('width', d => xScale.bandwidth())
        .attr("x", d => xScale(d.activity))
        .attr("y", d => yScale(d.count))
        .style("fill", "pink")

})

