function findStateColor(stateData, winners) {
  let stateName = stateData.properties.name;
  let winner = winners[stateName];
  if (winner == "republican") {
    return "red"
    // Minnesota has weird party name
  } else if (winner == "democrat" || winner == "democratic-farmer-labor") {
    return "blue"
  } else {
    return "green"
  }
}

// This data transformation should happen before we even get the data
// It's not very convenient to do it in JS
function calculateWinners(electionResults) {
  let data = {};
  for(let {year, candidatevotes, party, state} of electionResults) {
    data[year] ||= {};
    data[year][state] ||= {};
    data[year][state][party] ||= 0;
    data[year][state][party] += parseInt(candidatevotes);
  }
  let result = {};
  for(let year in data) {
    let yearData = data[year];
    for(stateName in yearData) {
      let stateData = yearData[stateName]
      let maxVote = Math.max(...Object.values(stateData));
      let winner = Object.keys(stateData).find(c => maxVote == stateData[c]);
      result[year] ||= {};
      result[year][stateName] = winner;
    }
  }
  return result;
}

// Data
let year = 1992;
let winners;
let usMap;

function drawMap() {
  let width = 960;
  let height = 500;

  // remove any previous content
  d3.select("body").selectAll("*").remove();

  // setup header
  d3.select("body")
    .append("h3")
    .text(`${year} Election Results Map`)

  let buttonRow = d3.select("body").append("div")

  // buttons
  for (let y of [1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016]) {
    buttonRow
      .append("button")
      .text(y)
      .on("click", () => {
        year = y;
        drawMap()
      })
  }

  let projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])
    .scale([1000]);

  let path = d3.geoPath()
    .projection(projection);

  let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    


  svg.selectAll("path")
    .data(usMap)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) {
      return findStateColor(d, winners[year])
    })
    // mouse hover
    .append("svg:title")
    .text(function(data) {return data.candidatevote; });

}

async function main() {
  let electionResults = await d3.csv("1976-2016-president.csv");
  usMap = (await d3.json("./us-states.json")).features;
  winners = calculateWinners(electionResults);
  drawMap()
}

main();
