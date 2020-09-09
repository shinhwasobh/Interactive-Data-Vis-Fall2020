d3.csv("../../data/TFR_Korea.csv").then(data => {
    console.log("data", data);

    const table = d3.selectAll("#cities");  
    const thead = table.append("thead");
    
    thead
        .append("tr")
        .append("th")
        .attr("colspan", "7")
        .text("Annual Survey Results");

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .text(d => d);
    
    const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr");

    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        .attr("class", d => +d > 0.6 ? 'Low' : null)
        .text(d => d);
});