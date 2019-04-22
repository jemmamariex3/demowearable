function buildMultiUserChart(type, start, end, data) {
    d3.select("#chart").selectAll("*").remove(); // Clear previous chart if any
    var m = {
        left: 30,
        right: 0,
        top: 5,
        bottom: 30
    };

    var w = parseInt(d3.select('#chart-container').style('width')) - 2 * m.left;
    var h = 600 - m.top - m.bottom;

    var chart = d3.select("#chart")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    var minTime = start;
    var maxTime = end;

    // Choose which chart to display for charts.php
    data = data[type];

    var minData = Number.POSITIVE_INFINITY;
    var maxData = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < data.length; i++) {
        var tmp = data[i].data;
        if (tmp < minData) minData = tmp;
        if (tmp > maxData) maxData = tmp;
    }

    // Set axes
    x = d3.scaleTime()
        .domain([minTime, maxTime])
        .range([0, w]);
    y = d3.scaleLinear()
        .domain([minData, maxData + 2])
        .range([h, 0]);

    xAxis = d3.axisBottom(x);
    yAxis = d3.axisLeft(y);

    // Zoom Function
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        // .translateExtent([[0, 0], [w, h]])
        .on("zoom", zoomFunction);

    // Inner Drawing Space
    var innerSpace = chart.append("g")
        .attr("class", "inner_space")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    // Append zoom area
    var view = innerSpace.append("rect")
        .attr("class", "zoom")
        .attr("width", w)
        .attr("height", h)
        .attr('fill', 'white')
        .call(zoom);

    // Define line functions
    var line = d3.line()
        .x(function (d) { return x(d.time); })
        .y(function (d) { return y(d.data); })
        .curve(d3.curveCatmullRom);

    // Draw graph in svg
    var gX = innerSpace.append("svg:g")
        .attr('transform', 'translate(0,' + h + ')')
        .attr("class", "x axis")
        .call(xAxis);
    var gY = innerSpace.append("svg:g")
        .attr("class", "y axis")
        .call(yAxis);

    var player1 = data.filter(function (row) { return row.id == 1; });
    var player2 = data.filter(function (row) { return row.id == 2; });
    var player3 = data.filter(function (row) { return row.id == 3; });
    var player4 = data.filter(function (row) { return row.id == 4; });

    var player1Path = innerSpace.append("svg:path")
        .attr("d", line(player1))
        .style('stroke', 'red')
        .style('fill', 'none');
    var player2Path = innerSpace.append("svg:path")
        .attr("d", line(player2))
        .style('stroke', 'blue')
        .style('fill', 'none');
    var player3Path = innerSpace.append("svg:path")
        .attr("d", line(player3))
        .style('stroke', 'green')
        .style('fill', 'none');
    var player4Path = innerSpace.append("svg:path")
        .attr("d", line(player4))
        .style('stroke', 'purple')
        .style('fill', 'none');

    function zoomFunction(){
        // Create new scale ojects based on event
        var new_xScale = d3.event.transform.rescaleX(x);
        var new_yScale = d3.event.transform.rescaleY(y);

        // Update axes
        gX.call(xAxis.scale(new_xScale));
        gY.call(yAxis.scale(new_yScale));

        // Update circle
        player1Path.attr("transform", d3.event.transform);
        player2Path.attr("transform", d3.event.transform);
        player3Path.attr("transform", d3.event.transform);
        player4Path.attr("transform", d3.event.transform);
    }
}

function buildLiveMultiUserChart () {
    var m = { left: 30, right: 0, top: 10, bottom: 30 },
        w = parseInt(d3.select('#chart-container').style('width')) - 2 * m.left,
        h = 600 - m.top - m.bottom;

    // var chart = d3.select("#ba-chart")
    var chart = d3.select("#chart")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .attr("transform", "translate(" + m.left + ",0)");

    var latestBA, data = [];
    var max = 0;

    var limit = 60 * 1,
        duration = 750,
        // now = new Date(Date.now() - duration);
        now = new Date();

    // now = new Date(now.getTime() - 10000);

    // Set axes
    var x = d3.scaleTime()
        .domain([now - (limit - 2), now - duration])
        .range([(-m.left - m.right), w - m.left - m.right]),
        y = d3.scaleLinear()
        .domain([0, max])
        .range([h - m.bottom, 0]);

    // Set lines
    var line = d3.line()
        .x(function (d, i) { return x(now - (limit - 1 - i) * duration); })
        .y(function (d) { return y(d); }),
        path = chart.append('path');
    var player1 = d3.line().curve(d3.curveCardinal)
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); });

    var xAxis = d3.axisBottom().scale(x),
        axisX = chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + (m.left + m.right) + ', ' + (h - m.top - m.bottom + 10) + ')')
        .call(xAxis);
    var yAxis = d3.axisLeft().scale(y),
        axisY = chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ (m.left + 20) + ',' + 0 + ')')
        .call(yAxis);

    function tick() {
        now = new Date();
        // now = new Date(now.getTime() - 10000);

        // Grab and push new data
        wearables.getLatestBA("1", grabBA);
        function grabBA(data) { latestBA = data; };
        
        // TODO: Add multiple players

        var point = { x: now, y: latestBA };
        data.push(point);
        path.datum(data).attr('d', player1);

        if(latestBA > max) { max = latestBA };


        // Shift the chart left
        x.domain([now - (limit - 2) * duration, now - duration]);
        y.domain([0, max]);
        axisX.transition()
            .duration(duration)
            .ease(d3.easeLinear, 2)
            .call(xAxis);
        axisY.transition()
            .duration(duration)
            .ease(d3.easeLinear, 2)
            .call(yAxis);
        path.attr('transform', null)
            .transition()
            .duration(duration)
            .ease(d3.easeLinear, 2)
            .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
            .on('end', tick);

        if (data.length > 200) data.shift();
    }

    tick();
}