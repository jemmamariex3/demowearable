var halted;
function realTimeLineChart() {

  // Need for scales -> which will be used to draw chart and axes
  var margin = {top: 10, right: 0, bottom: 30, left: 30},
      width = 1000,
      height = 600,
      duration = 500,
      color = d3.schemeCategory10;

  // Creates a multiline chart
  function chart(selection) {
    // Based on https://bl.ocks.org/mbostock/3884955
    selection.each(function(data) {
      data = ["gsr", "hr", "skin", "ac"].map(function (c) {
        return {
          label: c,
          values: data.map(function (d) {
            // console.log(d[c]);
            return {time: +d.time, value: d[c]};
          })
        };
      });

      var t = d3.transition().duration(duration).ease(d3.easeLinear),
          x = d3.scaleTime().rangeRound([0, width - margin.left - margin.right]),
          y = d3.scaleLinear().rangeRound([height - margin.top - margin.bottom, 0]),
          z = d3.scaleOrdinal(color);

      var xMin = d3.min(data, function (c) {
        return d3.min(c.values, function (d) {
          return d.time;
        })
      });
      var xMax = new Date(new Date(d3.max(data, function (c) {
        return d3.max(c.values, function (d) {
          return d.time;
        })
      })).getTime() - (duration * 2));

      x.domain([xMin, xMax]);
      y.domain([
        d3.min(data, function (c) {
          return d3.min(c.values, function (d) {
            return d.value;
          })
        }),
        d3.max(data, function (c) {
          return d3.max(c.values, function (d) {
            return d.value * 1.5;
          })
        })
      ]);
      z.domain(data.map(function (c) {
        return c.label;
      }));

      var line = d3.line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d.time);
          })
          .y(function (d) {
            return y(d.value);
          });

      var svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "axis x");
      gEnter.append("g").attr("class", "axis y");
      gEnter.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width - margin.left - margin.right)
          .attr("height", height - margin.top - margin.bottom);
      gEnter.append("g")
          .attr("class", "lines")
          .attr("clip-path", "url(#clip)")
          .selectAll(".data").data(data).enter()
          .append("path")
          .attr("class", "data");

      var legendEnter = gEnter.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - margin.right - margin.left - 100) + ",25)");
      legendEnter.append("rect")
          .attr("width", 50)
          .attr("height", 75)
          .attr("fill", "#ffffff")
          .attr("fill-opacity", 0.7);
      legendEnter.selectAll("text")
          .data(data).enter()
          .append("text")
          .attr("y", function (d, i) {
            return (i * 20) + 25;
          })
          .attr("x", 5)
          .attr("fill", function (d) {
            return z(d.label);
          });

      //reference: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
      var mouseG = gEnter.append("g") // black vertical line
          .attr("class", "mouse-over-effects");
      mouseG.append("path")
          .attr("class", "mouse-line")
          .style("stroke", "black")
          .style("stroke-width", "1px")
          .style("opacity", "0");

      var lines = document.getElementsByClassName('data'); //lines paths of the data
      var mousePerLine = mouseG.selectAll('.mouse-per-line')
          .data(data)
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");
      mousePerLine.append("circle")
          .attr("r", 7)
          .style("stroke", "black")
          .style("fill", "none")
          .style("stroke-width", "1px")
          .style("opacity", "0");

      mousePerLine.append("text")
          .attr("transform", "translate(10,3)");
      mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
          .attr('width', width) // can't catch mouse events on a g element
          .attr('height', height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('mouseout', function () { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
          })
          .on('mouseover', function () { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
          })
          .on('mousemove', function () { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
                .attr("d", function () {
                  var d = "M" + mouse[0] + "," + height;
                  d += " " + mouse[0] + "," + 0;
                  return d;
                });

            //refactor -- not date. output gsr, hr, skin, and ac values. change dynamically
            d3.selectAll(".mouse-per-line")
                .attr("transform", function (d, i) {
                  console.log(width / mouse[0])
                  var xDate = x.invert(mouse[0]),
                      bisect = d3.bisector(function (d) {
                        return d.date;
                      }).right;
                  idx = bisect(d.values, xDate);

                  var beginning = 0,
                      end = lines[i].getTotalLength(),
                      target = null;

                  while (true) {
                    target = Math.floor((beginning + end) / 2);
                    pos = lines[i].getPointAtLength(target);
                    if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                      break;
                    }
                    if (pos.x > mouse[0]) end = target;
                    else if (pos.x < mouse[0]) beginning = target;
                    else break; //position found
                  }

                  d3.select(this).select('text')
                      .text(y.invert(pos.y).toFixed(2));

                  return "translate(" + mouse[0] + "," + pos.y + ")";
                });
            })
      var svg = selection.select("svg");
          svg.attr('width', width).attr('height', height);
          var g = svg.select("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.select("g.axis.x")
              .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
              .transition(t)
              .call(d3.axisBottom(x).ticks(5));
          g.select("g.axis.y")
              .transition(t)
              .attr("class", "axis y")
              .call(d3.axisLeft(y));

          g.select("defs clipPath rect")
              .transition(t)
              .attr("width", width - margin.left - margin.right)
              .attr("height", height - margin.top - margin.right);

          g.selectAll("g path.data")
              .data(data)
              .style("stroke", function (d) {
                return z(d.label);
              })
              .style("stroke-width", 4)
              .style("fill", "none")
              .transition()
              .duration(duration)
              .ease(d3.easeLinear)
              .on("start", tick);

          g.selectAll("g .legend text")
              .data(data)
              .text(function (d) {
                return d.label.toUpperCase() + ": " + d.values[d.values.length - 1].value;
              });

          // For transitions https://bl.ocks.org/mbostock/1642874
          function tick() {
            if (halted) return;
            d3.select(this)
                .attr("d", function (d) {
                  return line(d.values);
                })
                .attr("transform", null);

            var xMinLess = new Date(new Date(xMin).getTime() - duration);
            d3.active(this)
                .attr("transform", "translate(" + x(xMinLess) + ",0)")
                .transition()
                .on("start", tick);
          }
        });


  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

  chart.duration = function(_) {
    if (!arguments.length) return duration;
    duration = _;
    return chart;
  };

  return chart;
}