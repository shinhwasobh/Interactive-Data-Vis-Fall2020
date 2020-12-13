d3.csv("../data/Fruit.csv", d3.autoType).then
(data => {

    console.log(data)
    console.log(data.map(d => d.Fruits));

    const width = window.innerWidth * 0.8, 
        height = window.innerHeight / 2,
        paddingInner = 0.1,
        margin = {top: 20, bottom: 20, left: 250, right: 10},
        colors = ["blue", "red", "yellow", "purple", "orange", "darkgreen", "pink", "lightgreen", "darkgreen", "beige", "yellow"];
debugger;
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Fruits))
        .range([margin.left, width - margin.right])
        .paddingInner(paddingInner);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d.Sales_qty))])
        .range([height - margin.bottom, margin.top]);
    
    const mycolor = d3.scaleOrdinal()
        .domain(data)
        .range(colors);
        
    const svg = d3.select("#my-svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
    const rect = svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("y", d => yScale(d.Sales_qty))
        .attr("x", d => xScale(d.Fruits))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom)
        .style("fill", function(d){return mycolor(d.Fruits);
        });
    
    const text = svg.selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        .text(d => d.Fruits)
        .attr("x", d => xScale(d.Fruits) + (xScale.bandwidth() -80))
        .attr("y", d => yScale(d.Sales_qty))
        .attr("dy", "3em");
    
})
