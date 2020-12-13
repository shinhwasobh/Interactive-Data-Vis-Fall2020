export function chart1() {

    d3.csv("../../data/final_data1.csv", d3.autoType).then
    (data => {
        console.log(data)
        console.log(data.map(d => d.country));
        debugger;
       
        const margin = {top: 50, bottom: 50, left: 70, right: 20},
        colors = ["darkgreen", "red", "yellow", "purple", "orange", "pink", "navy", "beige"];


        const width = window.innerWidth / 3, 
            height = window.innerHeight / 3,
            paddingInner = 0.1;
            
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d.tfr))])
            .range([margin.left, width - margin.right]);
    
        const yScale = d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([height - margin.bottom, margin.top])
            .paddingInner(paddingInner);

        const yAxis = d3.axisLeft(yScale);
        const xAxisBottom = d3.axisBottom(xScale).ticks(5);
        const xAxisTop = d3.axisTop(xScale).ticks(5);

        const mycolor = d3.scaleOrdinal()
            .domain(data)
            .range(colors);
            
        const svg = d3.select("#d3-container-1")
            .append("svg")
            .attr("width", width)   
            .attr("height", height);
            
        const rect = svg.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("y", d => yScale(d.country))
            .attr("x", d => margin.left)
            .attr("width", d => xScale(d.tfr))
            .attr("height", yScale.bandwidth())
            .style("fill", function(d){return mycolor(d.country);
            });
        
        const text = svg.selectAll("text")
            .data(data)
            .join("text")
            .attr("class", "label")
            .text("World Average Total Fertility Rate (2017 EST.)")
            .attr("x", width - 450)
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