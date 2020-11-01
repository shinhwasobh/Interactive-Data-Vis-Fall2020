'use strict';

const width = window.innerWidth * 0.8,
      height = window.innerHeight * 0.8,
      margin = {top: 30, bottom: 20, left: 20, right: 40};

let svg;

let state = {
  geojson: null,
  tri: null,
  hover: {longitude: null,
          latitude: null,
        county: null}
};
debugger;

Promise.all([d3.json("../data/counties_ny.geojson"),
            d3.csv("../data/TFR_NY.csv", d3.autoType),
]).then(([geojson, tri]) => {
          state.geojson = geojson;
          state.tri = tri;
          console.log("state: ", state)
          console.log("features", geojson);
          console.log("tri: ", tri)
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

  svg.selectAll(".county")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("fill", "skyblue")
    .on("mouseover", d => {
      state.hover["county"] = d.properties.NAME;
    console.log("data: ", state.geojson.features);
    // .on("mouseover", function(d) {
    //   d3.select(this).classed("selected", true)
    // })
    // .on("mouseout", function(d) {
    //   d3.select(this).classed("selected", false)
    // })
     
      //console.log("data", tri)
      console.log("data:", d.properties.county);
      draw();
    });
  

  const myHome = { longitude: -73.882876, latitude: 40.755729 };
  svg.selectAll("circle")
    .data([myHome])
    .join("circle")
    .attr("r", 10)
    .attr("fill", "pink")
    .attr("transform", d => {
      const [x,y] = projection([d.longitude, d.latitude]);
      return `translate(${x}, ${y})`;
    });
//   const tooltip = d3.select("#d3container")
//                     .append("div")
//                     .style("position", "absolute")
//                     .style("visibility", "hidden")
//                     .text("My Home Sweet Home!");

//   d3.select("#tooltip")
//     .on("mouseover", function(){return tooltip.style("visibility", "visible");})
//     .on("mousemove", function(){return tooltip.style("top", (event.pageY-800)+"px").style("right",(event.pageX-800)+"px");})
//     .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  // svg.selectAll("circle")
  //   .data(state.tri.columns)
  //   .join(enter => 
  //     enter.append("circle")
  //         .attr("fill","pink")
  //         .style("opacity", 0.5)
  //         .style("stroke", "blue")
  //         .attr("r", 2)
  //         .attr("cx", function(d) {return projection(state.tri.long)[0]})
  //         .attr("cy", function(d) {return projection(state.tri.lat)[1]})
  //         .call(enter => enter),
  //         update => update.call(update => update),
  //         exit => exit.call(exit => exit)
  //         .remove(),
          
    // .on("mouseover", function(d) {
    //   d3.select(this).classed("active", true)
    // })
    // .on("mouseout", function(d) {
    //   d3.select(this).classed("active", false)
    // }),

  svg.on("mousemove", () => {
    const [mx, my] = d3.mouse(svg.node());
    const proj = projection.invert([mx, my]);
    state.hover["longitude"] = proj[0];
    state.hover["latitude"] = proj[1];
    draw();
  });
  draw();
  }

function draw() {
  hoverData = Object.entries(state.hover);
  console.log(Object.entries(state.hover));
  
  d3.select("#hover-content")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(d => d[1] ? `${d[0]}: ${d[1]}` : null);
    }; 