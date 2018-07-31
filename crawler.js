var fs = require("fs");
var pagesToVisit = {};
var actualLinks = {};
var pagesVisited = [];
var pagesSkipped = [];
var errorPages = [];

//Reads the file and returns the content
function requestPageFromInternet(fileName) {
  fs.readFile(fileName, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    actualLinks = JSON.parse(data);

    for (let i = 0; i < actualLinks.pages.length; i++) {
      pagesToVisit[actualLinks.pages[i].address] = actualLinks.pages[i].links;
    }
    crawl(actualLinks.pages[0]);
  });
}

//Function to crawl through all pages
function crawl(pages) {
  getCurrentPage(pages);
  getLinks(pages);
  console.log("Success " + pagesVisited);
  console.log("Skipped" + pagesSkipped);
  console.log("Error" + errorPages);
}

//Sets the address of the pages visited to pagesVisited Array
function getCurrentPage(link) {
  if (pagesVisited.indexOf(link.address) == -1) {
    pagesVisited.push(link.address);
  }
}

//Gets the links for the corresponding address
function getLinks(page) {
  if (page.links) {
    for (let j = 0; j < page.links.length; j++) {
      //Pushes the link address to Pages Skipped array if the address is
      //already present in pagesVisited array
      if (
        pagesVisited.indexOf(page.links[j]) !== -1 &&
        pagesSkipped.indexOf(page.links[j]) == -1
      ) {
        pagesSkipped.push(page.links[j]);
      } else if (page.links[j] in pagesToVisit) {
        //Checks if address is valid one or not
        if (pagesVisited.indexOf(page.links[j]) == -1) {
          // Retrieves the links for the particular link address
          pagesVisited.push(page.links[j]);
          getCurrentPage(page.links[j]);
          let index = actualLinks.pages
            .map(e => e.address)
            .indexOf(page.links[j]);
          getLinks(actualLinks.pages[index]);
        }
      } else {
        errorPages.push(page.links[j]);
      }
    }
  }
}

requestPageFromInternet("test_files/testData1.txt");
