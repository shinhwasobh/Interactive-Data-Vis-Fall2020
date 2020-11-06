'use strict';

const width = window.innerWidth * 0.8,
    height = window.innerHeight * 0.8,
    margin = {top: 50, bottom: 30, right: 60, left: 30},
    radius = 4;

let svg = d3.select("#d3container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", 'translate(10,20)');

let xScale;
let yScale;

let state = {
    data: [],
    selectedBorough: "All",
};


d3.csv("../data/ProjectData.csv", d3.autotype).then(rawData => {
    state.data = rawData;
    console.log(state.data);
    init();
});

function init() {
    xScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.absence)).nice()
            .range([margin.left, width - margin.right]);
    yScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.poverty)).nice()
            .range([height, margin.top]);

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
            .call(yAxis)
            
}



