'use strict';

const width = window.innerWidth * 0.8,
      height = window.innerHeight * 0.8,
      margin = {top: 30, bottom: 20, left: 20, right: 40};

let svg;

let state = {
  geojson: null,
  tfr: null,
  hover: {long: null,
          lat: null,
        county: null}
};
debugger;
Promise.all([d3.json("../data/counties_ny.geojson"),
            d3.csv("../data/TFR_NY.csv", d3.autoType),
]).then(([geojson, tfr]) => {
          state.geojson = geojson;
          state.tfr = tfr;
          console.log("features", geojson);
          console.log("tfr: ", tfr)
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
      console.log("data: ", state.geojson.features);
    // .on("mouseover", function(d) {
    //   d3.select(this).classed("selected", true)
    // })
    // .on("mouseout", function(d) {
    //   d3.select(this).classed("selected", false)
    // })
     
      // //console.log("data", tfr)
      //console.log("data", d.properties.county);
      draw();
    });
    

  const myHome = { long: -73.882876, lat: 40.755729 };
  svg.selectAll("circle")
    .data([myHome])
    .join("circle")
    .attr("r", 10)
    .attr("fill", "pink")
    .attr("transform", d => {
      const [x,y] = projection([d.long, d.lat]);
      return `translate(${x}, ${y})`;
    });

  svg.selectAll("circle")
    .data(state.tfr.release)
    .join(enter => 
      enter.append("circle")
          .attr("fill","skyblue")
          .style("opacity", 0.1)
          .style("stroke", "blue")
          .attr("r", 3)
          .attr("cx", function(d) {return projection(d.long)[0]})
          .attr("cy", function(d) {return projection(d.lat)[1]})
          .call(enter => enter),
          update => update.call(update => update),
          exit => exit.call(exit => exit)
          .remove()
          
    .on("mouseover", function(d) {
      d3.select(this).classed("active", true)
    })
    .on("mouseout", function(d) {
      d3.select(this).classed("active", false)
    }),

  svg.on("mousemove", () => {
    const [mx, my] = d3.mouse(svg.node());
    const proj = projection.invert([mx, my]);
    state.hover["long"] = proj[0];
    state.hover["lat"] = proj[1];
    draw();
  }));
  draw();
  }

function draw() {
  hoverData = Object.entries(state.hover);
  
  d3.select("#hover-content")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(d => d[1] ? `${d[0]}: ${d[1]}` : null);
  
}

