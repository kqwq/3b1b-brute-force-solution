function howManyMod(n, modNum) {
  let c = 0;
  let all = Math.pow(2, n);
  for (let i = 0; i < all; i++) {
    //console.log("\n\n");
    let total = 0;
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        //console.log("   " + Math.pow(2, j));
        total += j + 1;
      }
    }
    //console.log(i, total);
    if (total % modNum === 0) {
      c++;
    }
  }
  return c;
}

let data = [];
let iMax = 17;
for (let i = 0; i <= iMax; i++) {
  let expected = Math.pow(2, i) / 5;
  let actual = howManyMod(i, 5);
  let diff = actual - expected;
  let percentDiff = (diff / expected) * 100;
  console.log(
    `${i}:\t${actual} (${diff.toFixed(
      1
    )} higher than expected by ${percentDiff.toFixed(2)}%)`
  );
  data.push({
    i,
    actual,
    expected,
    diff,
    percentDiff,
  });
}
console.log(data);

// plot data with d3 with a line chart

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#data-viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add X axis --> it is a date format
var x = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.i)))
  .range([0, width]);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.diff)))
  .range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

// Add the line
svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.i);
      })
      .y(function (d) {
        return y(d.diff);
      })
  );

// Add the points
svg
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return x(d.i);
  })
  .attr("cy", function (d) {
    return y(d.diff);
  })
  .attr("r", 3)
  .attr("fill", "steelblue");

// x-axis gridlines every 5 years
svg
  .append("g")
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")");
svg
  .select(".grid")
  .call(d3.axisBottom(x).tickSize(-height).tickFormat("").ticks(5));

console.log(x(data[0].diff), y(data[0].i), data[0].diff);
