function visualizeStateData(stateName, stateData, causeColor) {
  let maxDeaths = d3.max(stateData, (row) => row.DEATHS);

  let deathScale = d3.scaleLinear()
    .domain([0, maxDeaths])
    .range([0, 100])

  let stateChart = d3.select("body")
    .append("div")
      .attr("class", "state-chart")

  stateData.sort((a, b) => (a.DEATHS - b.DEATHS))

  for (let row of stateData) {
    stateChart
      .append("div")
        .attr("class", "line")
        .style("width", `${deathScale(row.DEATHS)}px`)
        .style("height", "10px")
        .style("background-color", causeColor(row.CAUSE_NAME))
        .attr("title", `${row.CAUSE_NAME} - ${row.DEATHS}`)
  }

  stateChart
    .append("div")
      .text(stateName)
}

function uniq(list) {
  let result = [];
  for(let x of list) {
    if(result.indexOf(x) === -1) {
      result.push(x)
    }
  }
  return result;
}

function visualizeData(data) {
  // Convert number data from strings to numbers
  data = data.map((row) => ({
    ...row,
    DEATHS: +row.DEATHS,
    YEAR: +row.YEAR,
  }));

  let causes = uniq(data.map(row => row.CAUSE_NAME));

  let causeColor = d3.scaleOrdinal()
    .domain(causes)
    .range(["#112231","#3C769D","blue","red","purple"])


  // Translate to python:
  // importantData = [row for row in data if row.YEAR == "2000" and row.STATE == "Alabama"]
  let alabamaData = data.filter(
    (row) => row.YEAR === 2000 && row.STATE === "Alabama" && row.CAUSE_NAME !== "All Causes"
  );

  let californiaData = data.filter(
    (row) => row.YEAR === 2000 && row.STATE === "California" && row.CAUSE_NAME !== "All Causes"
  );

  visualizeStateData("Alabama", alabamaData, causeColor);
  visualizeStateData("California", californiaData, causeColor);
}

d3.csv("leading_cause_death.csv").then(visualizeData);
