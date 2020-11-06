'use strict';

const width = window.innerWidth * 0.8,
    height = window.innerHeight * 0.8,
    margin = {top: 50, bottom: 30, right: 30, left: 20},
    radius = 4;

let svg = d3.select("#d3container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", 'translate(20, 60)');

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
            .range([margin.right, width - margin.left]);
    yScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.poverty)).nice()
            .range([, margin.top]);

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

        svg.append("g")
            .attr("class", "axis x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", "73%")
            .attr("dy", "1.5em")
            .text("Chronic Absence Rate")
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("writing-mode", "vertical-rl")
            .attr("dx", "1.2em")
            .attr("y", "85%")
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
                                .attr("cx", d => xScale(d.absence))
                                .attr("cy", d => yScale(d.poverty))
                                .call(enter => enter.attr("r", 10)
                                                    .transition()
                                                    .delay(d => 3 * d.absence)
                                                    .duration(100)
                                                    .attr("cx", d => xScale(d.absence))
                                                    .transition()),

                    update => update.call(update => update.attr("r", 10)
                                                        .data(filteredData, d => d.school)
                                                        .transition()
                                                        .duration(100)
                                                        .transition()),
                    exit => exit.call(exit.attr("r", 0)
                                        .transition()
                                        .attr("fill", "grey")
                                        .delay(d => 5 * d.poverty)
                                        .duration(100)
                                        .attr("cx", height)
                                        .transition()
                                        .attr("fill", "white")
                                        .remove())

                )
                
}


