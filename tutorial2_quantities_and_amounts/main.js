d3.csv("../data/Fruit.csv", d3.autoType).then
(data => {

    console.log(data)
    console.log(data.map(d => d.Fruits));

    const width = window.innerWidth * 0.8, 
        height = window.innerHeight / 2,
        paddingInner = 0.1,
        margin = {top: 20, bottom: 20, left: 250, right: 10};

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Fruits))
        .range([margin.left, width - margin.right])
        .paddingInner(paddingInner);
    
    //console.log(xScale('Apple'), xScale.bandwidth())

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d.Sales_qty))])
        .range([margin.bottom, height - margin.top]);
        
    const svg = d3.select("#my-svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const rect = svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("y", d => height - yScale(d.Sales_qty))
        .attr("x", d => xScale(d.Fruits))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom)
        .attr("fill", "skyblue");

    const text = svg.selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        .text(d => d.Fruits)
        .attr("x", d => xScale(d.Fruits) + (xScale.bandwidth() - 70))
        .attr("y", d => height - yScale(d.Sales_qty));
    
})
