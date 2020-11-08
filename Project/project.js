'use strict';

const width = window.innerWidth * 0.8,
    height = window.innerHeight * 0.8,
    margin = {top: 50, bottom: 30, right: 40, left: 30},
    radius = 6;

let svg;
let xScale;
let yScale;

let state = {
    data: [],
    selectedBorough: "NYC All",
};
let cValue = function(d) { return d.city;},
    color = d3.scaleOrdinal().domain(state.data, d => d.city)
            .range(d3.schemeSet3);

d3.csv("../data/ProjectData.csv", d3.autotype).then(rawData => {
    state.data = rawData;
    console.log(state.data);
    init();
});
debugger;
function init() {
    xScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.absence)).nice()
            .range([margin.left, width - margin.right]);
    yScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.poverty)).nice()
            .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisTop(xScale);
    const yAxis = d3.axisLeft(yScale);

    const selectElement = d3.select("#dropdown")
                            .on("change", function() {
                                state.selectedBorough = this.value;
                                draw();
                            });
        selectElement.selectAll("option")
                    .data(["NYC All", ...Array.from(new Set(state.data.map(d => d.city)))])
                    .join("option")
                    .attr("value", function(d) {return d;})
                    .text(d => d);
        
        svg = d3.select("#d3container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", 'translate(0, ${height - margin.bottom})');
    
        svg.append("g")
            .attr("class", "axis x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", "88%")
            .attr("dy", "1.5em")
            .text("Chronic Absence Rate")
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("writing-mode", "vertical-rl")
            .attr("dx", "1.2em")
            .attr("y", "84%")
            .text("Poverty Index");

    draw(); 
}

function draw() {
    let filteredData = state.data;
    if(state.selectedBorough !== "NYC All") {
        filteredData = state.data.filter(d => d.city === state.selectedBorough);
    }

    const dot = svg.selectAll(".dot")
                .data(filteredData, d => d.school)
                .join(
                    enter => enter.append("circle")
                                .attr("class", "dot")
                                .style("fill", function(d) {return color(cValue(d))})
                                .attr("r", radius)
                                .attr("cy", d => yScale(d.poverty))
                                .attr("cx", d => margin.bottom)
                                .call(enter => enter.attr("r", radius)
                                                    .transition()
                                                    .delay(d => 50 * d.absence)
                                                    .duration(100)
                                                    .attr("cx", d => xScale(d.absence))
                                                    .transition()),

                    update => update.call(update => update.transition()
                                                        .duration(150)
                                                        .attr("r", radius)
                                                        //.data(filteredData, d => d.school)
                                                        .transition()
                                                        .duration(150)
                                                        .transition()),
                    exit => exit.call(exit.transition()
                                        .duration(100)
                                        .attr("r", 2)
                                        .attr("stroke", "grey")
                                        .delay(d => 50 * d.poverty)
                                        .duration(100)
                                        .attr("cx", width)
                                        // .transition()
                                        // .attr("fill", "white")
                                        .remove())

                )
                
}


