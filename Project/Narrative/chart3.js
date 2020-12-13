export function chart3() {
    const width = window.innerWidth/2,
    height = window.innerHeight/2,
    margin = {top: 20, bottom: 40, right: 50, left: 90},
    radius = 5;

let svg;
let xScale;
let yScale;
debugger;
svg = d3.select("#d3-container-3")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

d3.csv("../../data/Final_data2.csv", d3.autotype).then(data => {
console.log(data)
console.log(data.map(d => d.city));

xScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.unemp))
          .range([margin.left, width - margin.right])
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

yScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.tfr))
          .range([height - margin.top, margin.bottom]);
        svg.append("g")
        .call(d3.axisRight(yScale));

        svg.append("text")
            .attr("class", "axis-label")
            .attr("dx", "25%")
            .attr("dy", "32em")
            .text("Unemployment Rate");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("writing-mode", "vertical-rl")
            .attr("dx", "2.8em")
            .attr("dy", "20%")
            .text("Total Fertility Rate")
           
          svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) {return xScale(d.unemp);})
                .attr("cy", function (d) {return yScale(d.tfr);})
                .attr("r", radius)
                .style("fill", "pink")
})};