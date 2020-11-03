var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", "100%")
.attr("height", "400px")
.append("rect")
.style("fill","lightgrey")
.attr("width", "100%")
.attr("height", "95%");

var line = d3.select("svg")
.append("line")
.attr("y1", "47.5%")
.attr("y2", "47.5%")
.attr("x1", "2%")
.attr("x2", "98%")
.style("stroke", "black")
.style("stroke-width", "2px");

var ticks = ["14%","38%","62%","86%"]

ticks.forEach(function(data) {
  d3.select("svg")
  .append("line")
  .attr("y1", "45.5%")
  .attr("y2", "49.5%")
  .attr("x1", data)
  .attr("x2", data)
  .style("stroke", "black")
  .style("stroke-width", "2px");
});

var labels = [{text: "1960", position: "14%"},{text: "1970", position: "38%"},{text: "1980", position: "62%"},{text: "1990", position: "86%"}]

labels.forEach(function(data){
  d3.select("svg")
  .append("text")
  .text(data.text)
  .attr("y","52.5%")
  .attr("x", data.position)
  .attr("text-anchor", "middle");
});

hover1 = d3.select("#hover1")
hover2 = d3.select("#hover2")

photo = d3.select("svg")
.append("a")
.attr("href","https://www.naacp.org/marchonwashington/")
.attr("target","_blank")
.append("text")
.text("Photo: NAACP")
.attr("x","1%")
.attr("y","100%");


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// read json data
d3.json("data.json", function(data) {

  data.forEach(function(d){

    if (d.height == "above" && d.year == 1980){
      var yval = getRandomArbitrary(20,23);
    } else if (d.height == "above" && d.year > 1970){
      var yval = getRandomArbitrary(20,23.5);
    } else if (d.height == "below" && d.year > 1970){
      var yval = getRandomArbitrary(50.5,53.5);
    } else if (d.height == "below" && d.year == 1960){
      var yval = getRandomArbitrary(52.5,53);
    } else if (d.year == 1965.5){
      var yval = getRandomArbitrary(48.5,50.3);
    } else if (d.height == "above" && d.year == 1960){
      var yval = getRandomArbitrary(21,23);
    } else if (d.height == "above"){
      var yval = getRandomArbitrary(20,23.5);
    } else if (d.height == "below"){
      var yval = getRandomArbitrary(51.5,53.5);
    } else if (d.height == "high above"){
      var yval = 1;
    } else if (d.height == "way below"){
      var yval = 72;
    }

    var xval = (d.year-1955)*2.4+2
    
    if (d.date.length == 4){
      var mark_val = ((parseInt(d.date)-1955)*2.4+2)
    } else if (d.date.search("late") != -1){
      var mark_val1 = (1975-1955)*2.4+2
      var mark_val2 = (1995-1955)*2.4+2
    } else if (d.date == "1960s" || d.date == "1960-1970") {
      var mark_val1 = (1960-1955)*2.4+2
      var mark_val2 = (1970-1955)*2.4+2
    } else if (d.title == "Pinback button for the Black National Political Convention"){
      var mark_val = ((1972-1955)*2.4+2)
    } else if (d.date.search("mid") != -1){
      var mark_val1 = (1955-1955)*2.4+2
      var mark_val2 = (1975-1955)*2.4+2
    } else if (d.date.search("after") != -1){
      var mark_val1 = (parseInt(d.date.split(" ")[1])-1955)*2.4+2
      var mark_val2 = (1995-1955)*2.4+2
    } else {
      var mark_val1 = (1968-1955)*2.4+2
      var mark_val2 = (1990-1955)*2.4+2
    }

    var button_size = 6
    var mark_size = .5;
    var stroke_width = 2;

    var selector = d.height.replace(" ","")+d.description.split(" ")[17].replace(",","").replace(".","")

    if (d.date.length == 4 || d.title == "Pinback button for the Black National Political Convention"){ 
      d3.select("svg")
        .append("circle")
        .attr("class",selector)
        .attr("r",mark_size+"%")
        .attr("cx",mark_val+"%")
        .attr("cy","47.5%")
        .style("fill","none");
    } else {
      d3.select("svg")
        .append("line")
        .attr("class",selector)
        .attr("y1", "47.5%")
        .attr("y2", "47.5%")
        .attr("x1", mark_val1+"%")
        .attr("x2", mark_val2+"%")
        .style("stroke", "none")
        .style("stroke-width", "3px");
    }

    d3.select("svg")
  .append("image")
  .attr("href","images/"+d.img.split("=")[1]+"_round.svg")
  .attr("x",xval-(button_size/2)+"%")
  .attr("y",yval+"%")
  .attr("width",button_size+"%")
  .attr("image-anchor","middle")
  .on("mousemove", function (t) {
    hover1.html("<b>Title:</b> "+d.title+"<br><br><b>Date:</b> "+d.date);
    hover1.style("padding","3px")
    hover2.html(d.description+" ")
    hover2
    .append("a")
    .attr("href",d.source)
    .attr("target","_blank")
    .append("text")
    .text(d.source.split("//")[1].split("/")[0])
    .attr("x","1%")
    .attr("y","100%");
    d3.select("."+selector).style("fill","red");
    d3.select("."+selector).style("stroke","red");
}).on("mouseout", function (t) {
    d3.select("."+selector).style("fill","none");
    d3.select("."+selector).style("stroke","none");
}); 
  });

})
