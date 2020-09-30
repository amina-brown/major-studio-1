 const dotenv = require('dotenv');
 dotenv.config();

 // put your API key here;
const apiKey = process.env.SI_API;  

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// constructing the initial search query
// const search =  'on_view:"false" AND unit_code:"NMAI"';
var units = ["HAC","HMSG","NASM","NMAAHC","NMAfA","NMAH","NMAI","NPG","NPM","SAAM"]
  


// array that we will write into
let myData = {children: [{
                            name: "On View",
                            children: [],
                            colname: "level2"
                           },
                           {
                              name: "In Storage",
                              children: [],
                              colname: "level2"
                           }],
               name: "Smithsonian"
              };

let urls = [];

units.forEach((data) => {
  urls.push(`${searchBaseURL}?api_key=${apiKey}&q=unit_code:${data} AND on_view:true`);
});

units.forEach((data) => {
  urls.push(`${searchBaseURL}?api_key=${apiKey}&q=unit_code:${data} AND on_view:false`);
});

urls.forEach(function(url, index) {
  setTimeout(function(){
    window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let get_value = url.split(":")
      let institution = get_value[2]

      if (get_value[3] == "false"){
        myData.children[1].children.push(
          {name: institution.split(" AND")[0],
           group: "A",
           value: data.response.rowCount,
           colname: "level3"}
        );
      } else if (get_value[3] == "true"){
        myData.children[0].children.push(
          {name: institution.split(" AND")[0],
          group: "A",
          value: data.response.rowCount,
          colname: "level3"}
        );

        console.log(institution.split(" AND")[0]);
      };
    });
  }, 1000 * (index + 1));
});

console.log(myData);
