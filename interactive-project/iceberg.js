var svg = d3.select("svg")

var grad = svg.select("defs")

d3.json("institution_data.json", function(data) {
    
    var view = data.children[0].children;
    var storage = data.children[1].children;

    var view_values = []
    var storage_values = []

    view.forEach(m=>view_values.push(m.value))
    storage.forEach(m=>storage_values.push(m.value))

    var ratio = Math.max(...view_values)/Math.max(...storage_values);

    var percents = [];
    for (var i = 0; i < view_values.length; i++) {
      percents.push(Math.round(view_values[i] / storage_values[i]*100));
    }

    var pct = d3.scaleOrdinal()
    .domain(["HAC","NASM","NMAAHC","NMAfA","NMAI","NPG","NPM","SAAM"])
    .range(percents)

    // console.log(percents);
    svg.select("#top").attr("height",`${ratio * 200}%`)
    svg.select("#top").attr("height",`204.17px`)

    svg.select("#bottom")
    // svg.append("rect")
    // .attr("id","bottom")
    // .attr("y",`${ratio * 200}%`)
    .attr("y",`204.17px`)
    .attr("height",`550px`)

    // var surface = ratio*100;
    var surface = 204.17;
    var divisor = 5300/surface;
    var base_width = 75;
    var start = 450;
    var k = 0;
    var end = start+9*base_width;

    svg.append("text")
    .attr("y",surface+12)
    .attr("x",end+30)
    .attr("class","status")
    .text("In Storage")

    svg.append("text")
    .attr("y",surface-3)
    .attr("x",start-30)
    .attr("class","status")
    .text("On View")

    // var l = -1;

    var color_exhibit = d3.scaleOrdinal()
    .domain(["HAC","NASM","NMAAHC","NMAfA","NMAI","NPG","NPM","SAAM"])
    .range(["#00B3FF", "#cee6ca","#56b9d2","#3f97c2","#3371aa","#00A1CC", "#00D0D4","#91d0ce"])


    var position = d3.scaleOrdinal()
    .domain([0,1,2,3,4,5,6,7])
    .range([1,8,2,7,3,6,4,5])

    // var sorted = view_values.sort(function(a, b){return a - b});
    // var sorted2 = storage_values.sort(function(a, b){return a - b});

    function compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
          }
      
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
      };

    sorted = [...view].sort(compareValues('value'))

    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };

    view.forEach(function(d){
        k++;
        // var sorted = view_values.sort()
        // console.log(sorted)
        var i = position(sorted.findIndex(x => x.name === d.name));
        var base = start+i*base_width;
        if (i < 5){
            var center = base+Math.log(d.value)*(6-i)
        } else if (i > 4){
            var center = base-Math.log(d.value)*(i-4)
        } else {
            var center = base
        }

        var grad1 = grad.append("linearGradient")
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","100%")
        .attr("y2","50%")
        .attr("id",`${d.name}grad`)
        
        grad1.append("stop")
            .attr("offset","0%")
            .style("stop-color","#fffeff")
            // .style("stop-color",color_exhibit(d.name))
            // .style("stop-opacity","50%")

        grad1.append("stop")
            .attr("offset","100%")
            .style("stop-color",color_exhibit(d.name))

        if (["HAC","NPG","NPM"].includes(d.name)){
            var name_1 = d.fullname
            var name_2 = ''
            var name_3 = ''
        } else if (["NASM","SAAM","NMAfA"].includes(d.name)){
            var name = d.fullname.split(" ")
            var name_3 = ''
            var name_2 = name[0]
            name.splice(0,1)
            var name_1 = name.join(" ")
        } else if (d.name == "NMAI"){
            var name = d.fullname.split(" ")
            var name_3 = ''
            var name_2 = name[0]+" "+name[1]
            name.splice(0,2)
            var name_1 = name.join(" ")
        } else {
            var name = d.fullname.split(" ")
            var name_2 = name[1]+" "+name[2]+" "+name[3]
            var name_3 = name[0]
            name.splice(0,4)
            var name_1 = name.join(" ")
        }

        svg
        .append("polygon")
        .attr("class",d.name)
        .attr("points",center+","+(surface-d.value/divisor)+" "+(base+base_width)+","+surface+" "+(base-base_width)+","+surface)
        .style("fill",`url(#${d.name}grad)`)
        .on("mousemove", function (t) {
            d3.selectAll("."+d.name).moveToFront();
            d3.select("#line3").html(name_3)
            d3.select("#line2").html(name_2)
            d3.select("#line1").html(name_1)
            if (d.name == "NMAAHC"){d3.selectAll(".label").style("font-size","18px")} else {d3.selectAll(".label").style("font-size","20px")}
            d3.select("#value").html(`${pct(d.name)}% on view`)
        }).on("mouseout", function (t) {
            d3.select("#line3").html("")
            d3.select("#line2").html("")
            d3.select("#line1").html("Smithsonian")
            d3.selectAll(".label").style("font-size","30px")
            d3.select("#value").html(`9% on view`)
        });

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
          }

        function isOdd(num) { return num % 2;}

        var scale = getRandomArbitrary(.05,.2)
        var xval = getRandomArbitrary(100,550)
        if (isOdd(Math.round(xval)) == 0){
            var yval = getRandomArbitrary(330,345) 
        } else {
            var yval = getRandomArbitrary(570,585)
        }

        svg.append("g")
        .attr("transform","scale("+scale+") translate("+(xval*(1/scale))+","+(yval*(1/scale))+")")
        .attr("id","bubble"+k)
        .append("circle")
        .attr("r","100px")

        svg.select("#bubble"+k)
        .append("path")
        .attr("d","M75.27,43.66,85.06,63,71.31,68.61A50.69,50.69,0,0,0,55.66,78.72L36.14,97.23,46.51,72.64A44.41,44.41,0,0,1,61.05,54.17Z")
        .attr("transform","translate(-120,-120)")
        .attr("class","bubble")
        // console.log(center);
        // console.log(base);
    });

    storage.forEach(function(d){
        k++;
        var j = position(sorted.findIndex(x => x.name === d.name));
        var base = start+j*base_width;
        if (j < 5){
            var center = base+Math.log(d.value)*(6-j)
        } else if (j > 4){
            var center = base-Math.log(d.value)*(j-4)
        } else {
            var center = base
        }

        if (["HAC","NPG","NPM"].includes(d.name)){
            var name_1 = d.fullname
            var name_2 = ''
            var name_3 = ''
        } else if (["NASM","SAAM","NMAfA"].includes(d.name)){
            var name = d.fullname.split(" ")
            var name_3 = ''
            var name_2 = name[0]
            name.splice(0,1)
            var name_1 = name.join(" ")
        } else if (d.name == "NMAI"){
            var name = d.fullname.split(" ")
            var name_3 = ''
            var name_2 = name[0]+" "+name[1]
            name.splice(0,2)
            var name_1 = name.join(" ")
        } else {
            var name = d.fullname.split(" ")
            var name_2 = name[1]+" "+name[2]+" "+name[3]
            var name_3 = name[0]
            name.splice(0,4)
            var name_1 = name.join(" ")
        }

        svg
        .append("polygon")
        .attr("class",d.name)
        .attr("points",center+","+(surface+d.value/divisor)+" "+(base+base_width)+","+surface+" "+(base-base_width)+","+surface)
        .style("fill",`url(#${d.name}grad)`)

        svg
        .append("polygon")
        .attr("class",d.name)
        .attr("points",center+","+(surface+d.value/divisor)+" "+(base+base_width)+","+surface+" "+(base-base_width)+","+surface)
        .style("fill","#268EC4")
        .style("opacity","50%")
        .on("mousemove", function (t) {
            d3.selectAll("."+d.name).moveToFront();
            d3.select("#line3").html(name_3)
            d3.select("#line2").html(name_2)
            d3.select("#line1").html(name_1)
            if (d.name == "NMAAHC"){d3.selectAll(".label").style("font-size","18px")} else {d3.selectAll(".label").style("font-size","20px")}
            d3.select("#value").html(`${100-pct(d.name)}% in storage`)
        }).on("mouseout", function (t) {
            d3.select("#line3").html("")
            d3.select("#line2").html("")
            d3.select("#line1").html("Smithsonian")
            d3.selectAll(".label").style("font-size","30px")
            d3.select("#value").html(`9% on view`)
        });

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
          }

        function isOdd(num) { return num % 2;}

        var scale = getRandomArbitrary(.05,.2)
        var yval = getRandomArbitrary(340,550)
        if (yval < 345){
            var xval = getRandomArbitrary(100,475)
        } else if (isOdd(Math.round(yval)) == 0){
            var xval = getRandomArbitrary(75,100) 
        } else {
            var xval = getRandomArbitrary(535,550)
        }

        svg.append("g")
        .attr("transform","scale("+scale+") translate("+(xval*(1/scale))+","+(yval*(1/scale))+")")
        .attr("id","bubble"+k)
        .append("circle")
        .attr("r","100px")

        svg.select("#bubble"+k)
        .append("path")
        .attr("d","M75.27,43.66,85.06,63,71.31,68.61A50.69,50.69,0,0,0,55.66,78.72L36.14,97.23,46.51,72.64A44.41,44.41,0,0,1,61.05,54.17Z")
        .attr("transform","translate(-120,-120)")
        .attr("class","bubble")

        // console.log(center);
        // console.log(base);
    });

})
