function buildMultiSignalChart(player, start, end, data) {
    d3.select("#chart").selectAll("*").remove(); // Clear previous chart if any

    var m = { left: 100, right: 130, top: 5, bottom: 30 };
    var w = parseInt(d3.select('#chart-container').style('width')) - 4 * m.left;
    var h = 600 - m.top - m.bottom;

    var chart = d3.select("#chart")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .append("g")
        .attr("transform", "translate(" + (50 + m.left) + "," + m.top + ")");

    var minTime = start;
    var maxTime = end;

    var gsr = data.gsr.filter(function (row) { return row.id == player; });
    var heartRate = data.heartRate.filter(function (row) { return row.id == player; });
    var skin = data.skin.filter(function (row) { return row.id == player; });
    var accelerometer = data.accelerometer.filter(function (row) { return row.id == player; });
    var breathAmp = data.breathAmp.filter(function (row) { return row.id == player; });

    // Get min-max for each signal to set axis scale
    var minGSR = Number.POSITIVE_INFINITY;
    var maxGSR = Number.NEGATIVE_INFINITY;
    for(var i = 0; i < gsr.length; i++) {
        var tmp = gsr[i].data;
        if (tmp < minGSR) minGSR = tmp;
        if (tmp > maxGSR) maxGSR = tmp;
    }

    var minHR = Number.POSITIVE_INFINITY;
    var maxHR = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < heartRate.length; i++) {
        var tmp = heartRate[i].data;
        if (tmp < minHR) minHR = tmp;
        if (tmp > maxHR) maxHR = tmp;
    }

    var minSkin = Number.POSITIVE_INFINITY;
    var maxSkin = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < skin.length; i++) {
        var tmp = skin[i].data;
        if (tmp < minSkin) minSkin = tmp;
        if (tmp > maxSkin) maxSkin = tmp;
    }

    var minAC = Number.POSITIVE_INFINITY;
    var maxAC = Number.NEGATIVE_INFINITY;
    for(var i = 0; i < accelerometer.length; i++) {
        var tmp = accelerometer[i].data;
        // console.log(tmp);
        if (tmp < minAC) minAC = tmp;
        if (tmp > maxAC) maxAC = tmp;
    }

    var minBA = Number.POSITIVE_INFINITY;
    var maxBA = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < breathAmp.length; i++) {
        var tmp = breathAmp[i].data;
        if (tmp < minBA) minBA = tmp;
        if (tmp > maxBA) maxBA = tmp;
    }

    // Set axes
    var x = d3.scaleTime().domain([minTime, maxTime]).range([0, w]);
    var yGSR = d3.scaleLinear().domain([minGSR, maxGSR]).range([h, 0]);
    var yHR = d3.scaleLinear().domain([minHR, maxHR]).range([h, 0]);
    var ySkin = d3.scaleLinear().domain([minSkin, maxSkin]).range([h, 0]);
    var yAC = d3.scaleLinear().domain([minAC, maxAC]).range([h, 0]);
    var yBA = d3.scaleLinear().domain([minBA, maxBA]).range([h, 0]);

    var xAxis = d3.axisBottom(x);
    var yAxisGSR = d3.axisLeft(yGSR);
    var yAxisHR = d3.axisLeft(yHR);
    var yAxisSkin = d3.axisLeft(ySkin);
    var yAxisAC = d3.axisLeft(yAC);
    var yAxisBA = d3.axisLeft(yBA);

    // Zoom Function
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
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
    var lineGSR = d3.line()
        .x(function (d) { return x(d.time); })
        .y(function (d) { return yGSR(d.data); })
        .curve(d3.curveCatmullRom);
    var lineHR = d3.line()
        .x(function (d) { return x(d.time); })
        .y(function (d) { return yHR(d.data); })
        .curve(d3.curveCatmullRom);
    var lineSkin = d3.line()
        .x(function (d) { return x(d.time); })
        .y(function (d) { return ySkin(d.data); })
        .curve(d3.curveCatmullRom);
    var lineAC = d3.line()
        .x(function (d) { return x(d.time); })
        .y(function (d) { return yAC(d.data); })
        .curve(d3.curveCatmullRom);
    var lineBA = d3.line()
        .x(function (d) { return x(d.time); })
        .y(function (d) { return yBA(d.data); })
        .curve(d3.curveCatmullRom);

    // Draw Axes
    var gX = innerSpace.append("svg:g")
        .attr('transform', 'translate(0,' + h + ')')
        .attr("class", "x axis")
        .call(xAxis);
    var gYAxisGSR = innerSpace.append("svg:g")
        .attr("class", "y axis")
        .call(yAxisGSR);
    var gYAxisHR = innerSpace.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-50,0)")
        .call(yAxisHR);
    var gYAxisSkin = innerSpace.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-100,0)")
        .call(yAxisSkin);
    var gYAxisAC = innerSpace.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-150,0)")
        .call(yAxisAC);
    var gYAxisBA = innerSpace.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-200,0)")
        .call(yAxisBA);

    // Draw Axes Labels
    gYAxisGSRLabel = innerSpace.append("svg:g")
        .attr("class", "axisOrange")
        .attr("transform", "translate(-25,10)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("GSR");
    gYAxisHRLabel = innerSpace.append("svg:g")
        .attr("class", "axisRed")
        .attr("transform", "translate(-75,10)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("HR");
    gYAxisSkinLabel = innerSpace.append("svg:g")
        .attr("class", "axisGreen")
        .attr("transform", "translate(-125,10)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Skin");
    gYAxisACLabel = innerSpace.append("svg:g")
        .attr("class", "axisPurple")
        .attr("transform", "translate(-175,10)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Accelerometer");
    gYAxisBALabel = innerSpace.append("svg:g")
        .attr("class", "axisBlue")
        .attr("transform", "translate(-225,10)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Breath Amplitude");

    // Draw Paths
    var pathGSR = innerSpace.append("svg:path")
        .attr("d", lineGSR(gsr))
        .style('stroke', 'orange')
        .style('fill', 'none');
    var pathHR = innerSpace.append("svg:path")
        .attr("d", lineHR(heartRate))
        .style('stroke', 'red')
        .style('fill', 'none');
    var pathSkin = innerSpace.append("svg:path")
        .attr("d", lineSkin(skin))
        .style('stroke', 'green')
        .style('fill', 'none');
    var pathAC = innerSpace.append("svg:path")
        .attr("d", lineAC(accelerometer))
        .style('stroke', 'purple')
        .style('fill', 'none');
    var pathBA = innerSpace.append("svg:path")
        .attr("d", lineBA(breathAmp))
        .style('stroke', 'blue')
        .style('fill', 'none');

    function zoomFunction() {
        // Create new scale ojects based on event
        var new_xScale = d3.event.transform.rescaleX(x);
        var new_yGSRScale = d3.event.transform.rescaleY(yGSR);
        var new_yHRScale = d3.event.transform.rescaleY(yHR);
        var new_ySkinScale = d3.event.transform.rescaleY(ySkin);
        var new_yACScale = d3.event.transform.rescaleY(yAC);
        var new_yBAScale = d3.event.transform.rescaleY(yBA);

        // Update axes
        gX.call(xAxis.scale(new_xScale));
        gYAxisGSR.call(yAxisGSR.scale(new_yGSRScale));
        gYAxisHR.call(yAxisHR.scale(new_yHRScale));
        gYAxisSkin.call(yAxisSkin.scale(new_ySkinScale));
        gYAxisAC.call(yAxisAC.scale(new_yACScale));
        gYAxisBA.call(yAxisBA.scale(new_yBAScale));

        // Update dots and paths
        pathGSR.attr("transform", d3.event.transform);
        pathHR.attr("transform", d3.event.transform);
        pathSkin.attr("transform", d3.event.transform);
        pathAC.attr("transform", d3.event.transform);
        pathBA.attr("transform", d3.event.transform);
    }
}

function buildLiveMultiSignalChart (start) {
    // console.log("IN LIVE MULTI SIGNAL");
    // TODO: d3 select multiple live charts

    // TODO: update end time and max val

    // TODO: draw each time new value is grabbed

    // TODO: No zoom only automatically resize graph on currMaxVal
}