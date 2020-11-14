'use strict';

const width = window.innerWidth * 0.8,
    height = window.innerHeight * 0.7,
    margin = {top: 10, bottom: 30, right: 40, left: 50},
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
            .range(d3.schemeSet1);


d3.csv("../data/ProjectData.csv", d3.autotype).then(rawData => {
    state.data = rawData;
    console.log(state.data);
    init();
});
debugger;
function init() {
    xScale = d3.scaleLinear()
            .domain([0, 65])
            //.domain(d3.extent(state.data, d => d.absence)).nice()
            .range([margin.left, width - margin.right -30]);
    //console.log(d3.extent(state.data, d => d.absence));
    yScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.poverty)).nice()
            .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
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
                //.attr("transform", 'translate(${height - margin.bottom, 0})');
    
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(40, 0)`)
            .call(yAxis);

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", "45%")
            .attr("dy", "38em")
            .text("Chronic Absence Rate")
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("writing-mode", "vertical-rl")
            .attr("dx", "3.5em")
            .attr("y", "45%")
            .text("Poverty Index");
        
        svg.append("circle").attr("cx", width - 360).attr("cy",450).attr("r", 7).style("fill", "crimson")
        svg.append("text").attr("x", width - 340).attr("y", 450).text("MANHATTAN").style("font-size", "22px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx", width - 360).attr("cy",480).attr("r", 7).style("fill", "royalblue")
        svg.append("text").attr("x", width - 340).attr("y", 480).text("BRONX").style("font-size", "22px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx", width - 360).attr("cy",510).attr("r", 7).style("fill", "mediumseagreen")
        svg.append("text").attr("x", width - 340).attr("y", 510).text("BROOKLYN").style("font-size", "22px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx", width - 360).attr("cy",540).attr("r", 7).style("fill", "mediumorchid")
        svg.append("text").attr("x", width - 340).attr("y", 540).text("QUEENS").style("font-size", "22px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx", width - 360).attr("cy",570).attr("r", 7).style("fill", "darkorange")
        svg.append("text").attr("x", width - 340).attr("y", 570).text("STATEN ISLAND").style("font-size", "22px").attr("alignment-baseline","middle")
        svg.append('image')
        .attr('xlink:href', "https://c4.wallpaperflare.com/wallpaper/929/119/586/digital-art-skyscraper-building-new-york-city-wallpaper-preview.jpg")
        .attr("width", 1385)
        .attr("x", 5)
        .attr("y", 27)
        .attr("height", 555)
        .attr("opacity", 0.5);
       
    draw(); 
}

const tooltip = d3.select("#d3container")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "transparent")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "3px")
.style("padding", "5px");

let mouseover = function(d) {
tooltip.style("opacity",1)
}

let mousemove = function(d) {
tooltip.html("<b>School Name:</b> " + d.school + 
"<br><b>Chronic Absence (%):</b> " + d.absence + 
"<br><b>Poverty Index Score:</b> " + d.poverty)
.style("left", (d3.mouse(this) [0]+90) + "px")
.style("top", (d3.mouse(this) [1]) + "px")
}

let mouseleave = function(d) {
tooltip.transition()
.duration(100)
.style("opacity", 0)
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
                                .on("mouseover", mouseover)
                                .on("mousemove", mousemove)
                                .on("mouseleave", mouseleave)
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


