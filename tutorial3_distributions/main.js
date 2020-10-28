'use strict';
const width = window.innerwidth * 0.8,
    height = window.innerheight * 0.8,
    margin = {top: 20, bottom: 40, right: 30, left: 30}
    radius = 4;

let svg;
let xScale;
let yScale;
let yAxis;

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
    .domain(d3.extent(state.data, d = d.year))
    .range([margin.left, width-margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d = d.avg_score))
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale).tickFormat();

//UI Element Setup
  const selectElement = d3.select("#dropdown")
                          .on("change", function(){
                            console.log("new selected school is", this.value);
                            
                          }) 

}



