'use strict';
const width = window.innerWidth * 0.8,
    height = window.innerHeight * 0.8,
    margin = {top: 20, bottom: 40, right: 30, left: 30},
    radius = 4;

let svg;
let xScale;
let yScale;
let yAxis;
let xAxis;

let state = {
  data: [],
  selectedSchool: null,
};

d3.csv("../data/ELA_Queens.csv", d => ({
  year: new Date(d.Year, 0, 1),
  school: d.School,
  score: d.avg_score,
})).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

//Initialize the function
function init() {
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width-margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.score))
    .range([height - margin.bottom, margin.top]);
    
    let aaa = d3.extent(state.data, d => d.score);
    console.log('aaa', aaa);
  const xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale);

//UI Element Setup
  const selectElement = d3.select("#dropdown")
                          .on("change", function(){
                            debugger;
                            console.log("new selected school is", this.value);
                            state.selectedSchool = this.value;
                            draw();
                          });
   
  selectElement.selectAll("option")
              .data([
                "Select a school",
                ...Array.from(new Set(state.data.map(d => d.school)))
              ])
              .join("option")
              .attr("value", d => d)
              .text(d => d);
  //???            
  selectElement.property("value", "Select a school");

  svg = d3.select("#d3container")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

  svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", "50%")
      .attr("y", "3em")
      .text("Year");

  svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("y", "50%")
      .attr("dx", "-3em")
      .attr("writing-mode", "vertical-rl")
      .text("ELA Average Score");

  draw();
}

function draw() {
  let filteredData = [];
  if (state.selectedSchool !== null) {
    filteredData = state.data.filter(d => d.school === state.selectedSchool);
  }
  
  yScale.domain([0, d3.max(filteredData, d => d.score)]);
  let bbb = d3.max(filteredData, d => d.score); 
  console.log(d3.max('bbb', bbb);

  d3.select("g.y-axis")
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale));


}
