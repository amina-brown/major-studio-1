// Smithsonian API example code
// check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search
// Using this data set https://collections.si.edu/search/results.htm?q=Flowers&view=grid&fq=data_source%3A%22Cooper+Hewitt%2C+Smithsonian+Design+Museum%22&fq=online_media_type%3A%22Images%22&media.CC0=true&fq=object_type:%22Embroidery+%28visual+works%29%22

// put your API key here;
const dotenv = require('dotenv');
dotenv.config();

// put your API key here;
const apiKey = process.env.SI_API; 

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// constructing the initial search query
// const search =  'mask AND unit_code:"FSG"';
const search =  `"Politics (Practical)" AND unit_code:"NMAAHC" AND object_type:"Buttons (information artifacts)"`;


// array that we will write into
let myArray = [];

// string that will hold the stringified JSON data
let jsonString = '';

// search: fetches an array of terms based on term category
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
    console.log(url);
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      
      // constructing search queries to get all the rows of data
      // you can change the page size
      let pageSize = 1000;
      let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
      console.log(numberOfQueries)
      for(let i = 0; i < numberOfQueries; i++) {
        // making sure that our last query calls for the exact number of rows
        if (i == (numberOfQueries - 1)) {
          searchAllURL = url + `&start=${i * pageSize}&rows=${data.response.rowCount - (i * pageSize)}`;
        } else {
          searchAllURL = url + `&start=${i * pageSize}&rows=${pageSize}`;
        }
        console.log(searchAllURL)
        fetchAllData(searchAllURL);
      
      }
    })
    .catch(error => {
      console.log(error);
    })
}

// fetching all the data listed under our search and pushing them all into our custom array
function fetchAllData(url) {
  window
  .fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data)

    data.response.rows.forEach(function(n) {
      addObject(n);
    });
    jsonString += JSON.stringify(myArray);
    console.log(myArray);
  })
  .catch(error => {
    console.log(error)
  })

}

// create your own array with just the data you need
function addObject(objectData) {  
  
  // we've encountered that some places have data others don't
//   let currentPlace = "";
//   if(objectData.content.indexedStructured.place) {
//     currentPlace = objectData.content.indexedStructured.place[0];
//   }
if (objectData.content.descriptiveNonRepeating.online_media) {
  myArray.push({
    object: objectData.id,
    title: objectData.title,
    date: objectData.content.freetext.date[0].content,
    img: objectData.content.descriptiveNonRepeating.online_media.media[0].content,
    description: ''
  })
}
}


fetchSearchData(search);