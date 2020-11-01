'use strict';

const width = window.innerWidth * 0.8,
      height = window.innerHeight * 0.8,
      margin = {top: 30, bottom: 20, left: 20, right: 40};

let svg;

let state = {
  geojson: null,
  tfr: null,
  hover: {longitude: null,
          latitude: null,
        state: null},
};
debugger;
Promise.all([d3.json("../data/counties_ny.geojson"),
            d3.csv("../data/TFR_NY.csv", d3.autoType),
]).then(([geojson, tfr]) => {
          state.geojson = geojson;
          state.tfr = tfr;
          console.log("state: ", state.geojson);
          console.log("state: ", state.tfr)
          init();
        });

function init() {
  const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
  const path = d3.geoPath()
                .projection(projection);

  svg = d3.select("#d3container")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

  svg.selectAll(".state")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("fill", "transparent")
    .on("mouseover", d => {
      state.hover["county"] = d.properties.county;
      draw();
    });
}





// /**
//  * CONSTANTS AND GLOBALS
//  * */
// const width = window.innerWidth * 0.9,
//   height = window.innerHeight * 0.7,
//   margin = { top: 20, bottom: 50, left: 60, right: 40 };

// /** these variables allow us to access anything we manipulate in
//  * init() but need access to in draw().
//  * All these variables are empty before we assign something to them.*/
// let svg;

// /**
//  * APPLICATION STATE
//  * */
// let state = {
//   // + SET UP STATE
// };

// /**
//  * LOAD DATA
//  * Using a Promise.all([]), we can load more than one dataset at a time
//  * */
// Promise.all([
//   d3.json("PATH_TO_YOUR_GEOJSON"),
//   d3.csv("PATH_TO_ANOTHER_DATASET", d3.autoType),
// ]).then(([geojson, otherData]) => {
//   // + SET STATE WITH DATA
//   console.log("state: ", state);
//   init();
// });

// /**
//  * INITIALIZING FUNCTION
//  * this will be run *one time* when the data finishes loading in
//  * */
// function init() {
//   // create an svg element in our main `d3-container` element
//   svg = d3
//     .select("#d3-container")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

//   // + SET UP PROJECTION
//   // + SET UP GEOPATH

//   // + DRAW BASE MAP PATH
//   // + ADD EVENT LISTENERS (if you want)

//   draw(); // calls the draw function
// }

// /**
//  * DRAW FUNCTION
//  * we call this everytime there is an update to the data/state
//  * */
// function draw() {}
