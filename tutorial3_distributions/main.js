'use strict';

const width = window.innerWidth * 0.9,
      height = window.innerHeight / 1.8,
      margin = {top: 60, bottom: 20, right: 80, left: 40},
      radius = 6;

let svg;
let xScale;
let yScale;

let state = {
  data: [],
  selectedParty: "All",
};

d3.csv("../../data/TRI_2018_US.csv", d3.autotype).then(raw_data => {
  state.data = raw_data;
  console.log(state.data)
  init();
});

function init() {
  xScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.TRI))
            .range([margin.left + 100, width - margin.right]);
            
  yScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.CancerDeath))
            .range([height, margin.top]);

  const xAxis = d3.axisTop(xScale);
  const yAxis = d3.axisLeft(yScale);

  const selectElement = d3.select("#dropdown")
                          .on("change", function() {
                            state.selectedParty = this.value;
                            draw();
                          });
                        
        selectElement.selectAll("option")
          .data(["All",
            ...Array.from(new Set(state.data.map(d => d.Party)))
          ])
          .join("option")
          .attr("value", d => d)
          .text(d => d);

            svg = d3.select("#container")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", 650);
          
            svg.append("g")
              .attr("class", "axis x-axis")
              .attr("transform", 'translate(50, 40)')
              .call(xAxis);
            
            svg.append("text")
              .attr("class", "axis-label")
              .attr("x", "50%")
              .attr("dy", "0.8em")
              .text("Toxic Release Quantity");
          
            svg.append("g")
              .attr("class", "axis y-axis")
              .attr("transform", "translate(50, 50)")
              .call(yAxis)
              
            svg.append("text")
              .attr("class", "axis-label")
              .attr("writing-mode", "vertical-rl")
              .attr("dx", "0.6em")
              .attr("y", "40%")
              .text("Cancer Mortality");
          
            draw();
          }
          
          function draw() {
            let filteredData = state.data;
          
            if(state.selectedParty !== "All") {
              filteredData = state.data.filter(d => d.Party === state.selectedParty);
            }
          
            const dot = svg.selectAll(".dot")
                          .data(filteredData, d => d.State)
                          .join(
                            enter => enter.append("circle")
                            .attr("class", "dot")
                            .attr("fill", d => {
                              if(d.Party === "Democrat") return "blue";
                              else if(d.Party === "Republican") return "red";
                              //else if(d.Party === "Nonpartisan") Return "purple";
                              else return "purple";
                            })
                            .attr("r", radius)
                            .attr("cy", d => yScale(d.CancerDeath))
                            .attr("cx", d => xScale(d.TRI) + 50)
                            .call(enter => enter
                                              .attr("r", 12)
                                              .transition()
                                              .delay(d => 5 * d.TRI)
                                              .duration(50)
                                              .attr("cx", d => xScale(d.TRI))
                                              .transition()
                                                             
                                  ),
                          
                            update => update.call(update => 
                              update.attr("r", 12)
                                    .transition()
                                    .duration(100)
                                    .transition()
                                  ),
    
                            exit => exit.call(exit => 
                              exit.attr("r", radius)
                                    .transition()
                                    .attr("fill", "black")      
                                    .delay(d => 20 * d.CancerDeath)
                                    .duration(100)
                                    .attr("cx", width)
                                    .transition()
                                    .attr("fill", "black")
                                    .remove()
                                    )
                          );
          }
