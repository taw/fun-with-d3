function findStateColor(stateData, winners) {
  let stateName = stateData.properties.name;
  let winner = winners[1992][stateName];
  if (winner == "republican") {
    return "red"
  } else if (winner == "democrat") {
    return "blue"
  } else {
    return "green"
  }
}

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
      console.log(year, stateName, stateData, maxVote, winner)

      result[year] ||= {};
      result[year][stateName] = winner;
    }
  }
  return result;
}

async function main() {
  let width = 960;
  let height = 500;

  let header = d3.select("body")
    .append("h4")
    .text("Election Results Map")

  let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])
    .scale([1000]);

  let path = d3.geoPath()
    .projection(projection);

  let electionResults = await d3.csv("1976-2016-president.csv");
  let usMap = await d3.json("./us-states.json");

  let winners = calculateWinners(electionResults);

  // console.log(electionResults[0])

  let features = usMap.features;
  svg.selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) {
      return findStateColor(d, winners)
    })
}

main();
