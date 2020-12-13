export function chart2() {
    
    d3.csv("../../data/Final_data.csv", d3.autoType).then
    (data => {
        console.log(data)
        console.log(data.map(d => d.city));
        debugger;
        
        const width = window.innerWidth / 3, 
            height = window.innerHeight / 3,
            paddingInner = 0.1,
            margin = {top: 50, bottom: 50, left: 50, right: 20},
            colors = ["lightgrey"];
    
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d.tfr))])
            .range([margin.left, width - margin.right]);
    
        const yScale = d3.scaleBand()
            .domain(data.map(d => d.city))
            .range([height - margin.bottom, margin.top])
            .paddingInner(paddingInner);

        const yAxis = d3.axisLeft(yScale);
        const xAxisBottom = d3.axisBottom(xScale).ticks(5);
        const xAxisTop = d3.axisTop(xScale).ticks(5);

        const mycolor = d3.scaleOrdinal()
            .domain(data)
            .range(colors);
            
        const svg = d3.select("#d3-container-2")
            .append("svg")
            .attr("width", width)   
            .attr("height", height);
            
        const rect = svg.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("y", d => yScale(d.city))
            .attr("x", d => margin.left)
            .attr("width", d => xScale(d.tfr))
            .attr("height", yScale.bandwidth())
            .style("fill", function(d){return mycolor(d.city);
            });
        
        const text = svg.selectAll("text")
            .data(data)
            .join("text")
            .attr("class", "label")
            .text("South Korean Cities Total Fertility Rate (2018 EST.)")
            .attr("x", width - 500)
            .attr("dy", "1.2em");
        
        svg
            .append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);
      
        svg
            .append("g")
            .attr("class", "x-axis1")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxisBottom)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width)
            .attr("dy", "2em")
            .text("Total Fertility Rate");
      
        svg
            .append("g")
            .attr("class", "x-axis2")
            .attr("transform", `translate(0, ${margin.top})`)
            .call(xAxisTop);
    })
}