
// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 10, left: 40},
  width = 1500 - margin.left - margin.right,
  height = 540 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var tool = d3.select("body").append("div").attr("class", "toolTip");

// read json data
d3.json("quantitative_data.json", function(data) {

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(2)
    .tile(d3.treemapSquarify.ratio(3))
    (root)

    // treemapLayout.tile(d3.treemapDice)

  var color_exhibit = d3.scaleOrdinal()
    .domain(["HAC","HMSG","NASM","NMAAHC","NMAfA","NMAH","NMAI","NPG","NPM","SAAM"])
    .range(["#2D6572", "#4DB78D","#208F8B","#F9F871","#9ADC7F","#2D6572", "#4DB78D","#208F8B","#F9F871","#9ADC7F"])

  var color_storage = d3.scaleOrdinal()
    .domain(["HAC","HMSG","NASM","NMAAHC","NMAfA","NMAH","NMAI","NPG","NPM","SAAM"])
    .range(["#626F78","#7D8A94","#99A7B0","#B6C4CE","#7D8A94","#626F78","#7D8A94","#D4E2ED","#B6C4CE","#99A7B0"])


  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("fill", function(d){ if (d.parent.data.name == "In Storage"){return color_storage(d.data.name)} else {return color_exhibit(d.data.name)}} )
      // .style("border-radius", "5px")
      .on("mousemove", function (d) {
        tool.style("left", 50 + "px")
        tool.style("top", 205 + "px")
        tool.style("display", "inline-block");
        tool.html(`${d.data.fullname} - ${d.parent.data.name}: ${d.data.value} artifacts`);
        d3.selectAll("."+d.data.name).style("stroke", function(d){ if (d.parent.data.name == "In Storage"){return color_exhibit(d.data.name)} else {return color_storage(d.data.name)}});
        d3.selectAll("."+d.data.name).style("stroke-width","3px");
    }).on("mouseout", function (d) {
        tool.style("display", "none");
        d3.selectAll("."+d.data.name).style("stroke", "none");
    });

    var text_exhibit = d3.scaleOrdinal()
      .domain(["HAC","NASM","NMAAHC","NMAfA","NMAI","NPG","NPM","SAAM"])
      .range(["white","white","#333f48","#333f48", "white","white","#333f48","#333f48"])
  
    var text_storage = d3.scaleOrdinal()
      .domain(["HAC","NASM","NMAAHC","NMAfA","NMAI","NPG","NPM","SAAM"])
      .range(["white","white","#333f48","white","white","#333f48","#333f48","white"])

  // and to add the text labels
    svg
    .selectAll("text.label")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+1})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y1-(d.y1-d.y0)*.05})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.name })
      .attr("font-size", function(d){ let str = d.data.name; return Math.min((d.y1 - d.y0)*.9,(d.x1 - d.x0)*1.3/str.length)})
      .style("fill", function(d){ if (d.parent.data.name == "In Storage"){return text_storage(d.data.name)} else {return text_exhibit(d.data.name)}} )
      .attr("font-family","Acumin Pro Light")
      .on("mousemove", function (d) {
        tool.style("left", 50 + "px")
        tool.style("top", 205 + "px")
        tool.style("display", "inline-block");
        tool.html(`${d.data.fullname} - ${d.parent.data.name}: ${d.data.value} artifacts`);
        d3.selectAll("."+d.data.name).style("stroke", function(d){ if (d.parent.data.name == "In Storage"){return color_exhibit(d.data.name)} else {return color_storage(d.data.name)}});
        d3.selectAll("."+d.data.name).style("stroke-width","3px");
    }).on("mouseout", function (d) {
        tool.style("display", "none");
        d3.selectAll("."+d.data.name).style("stroke", "none");
    });
 
})

var line = d3.select("g")
            .append("line")
              .attr("x1",-40)
              .attr("y1",49.5)
              .attr("x2",width+40)
              .attr("y2",49.5)
              .style("stroke","white")
              .style("stroke-width",.5);

var label1 = d3.select("g")             
            .append("text")
              .text("On Exhibit")
              .attr("x",-40)
              .attr("y",48)
              .attr("font-size", 9)
              .attr("fill", "white")
              .attr("font-family","Acumin Pro Light");

var label2 = d3.select("g")              
              .append("text")
                .text("In Storage")
                .attr("x",width-2)
                .attr("y",58)
                .attr("font-size", 9)
                .attr("fill", "white")
                .attr("font-family","Acumin Pro Light");


