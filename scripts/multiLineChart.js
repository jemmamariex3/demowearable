/*
    The purpose of this is to learn how to create multilines in a chart
*/

// Set the dimensions and margins of graph
var margin = {left:40,right:20,top:30,bottom:50},
    height = 500 - margin.bottom - margin.top,
    width = 960 - margin.left - margin.right;

// Parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");


// Set the scales/ranges
var x = d3.scaleTime().range([0,width]);
var y = d3.scaleLinear().range([height,0]);

// define the 1st line
var valueLine = d3.line()
    .x(function(d){ return x(d.date); })
    .y(function(d){ return y(d.close); });

// degine the 2nd line
var valueLine2 = d3.line()
    .x(function(d){ return x(d.date); })
    .y(function(d){ return y(d.open); });

// append the svg object to the div of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart").append("svg")
    .attr("height","100%")
    .attr("width","100%");

chartGroup = svg.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");



// Get the data
d3.csv("./test_data/titanic.csv", function(error,data) {
    console.log(data)
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        /*
            The + operator returns the numeric representation of the object.
            var a = "1";
            var b = a;     // b = "1": a string
            var c = +a;    // c = 1: a number
            var d = -a;    // d = -1: a number
        */
        d.date = parseTime(d.date);
        d.close = +d.close; 
        d.open = +d.open;
    });

    // Scale the range of the data.
    // # d3.extent(iterable[, accessor])
    // Returns the minimum and maximum value in the given iterable using natural order.
    console.log(d3.extent(data, function(d) { return d.date; })); // returns an array of min and max
    console.log(d3.min(data, function(d){ return d.date; })); // returns a min of from the data
    console.log(d3.max(data, function(d){ return d.date; })); // returns the max of the data

    x.domain(d3.extent(data,function(d){ return d.date; }));
    y.domain([0, d3.max(data,function(d){
        // Choosing the higher of the two to plot to the graph
        return Math.max(d.close, d.open); })]);


   
    /*
        Add the valueline path.

        # selection.data([values[, key]])
        Joins the specified array of data with the current selection.
        The specified values is an array of data values, such as an 
        array of numbers or objects, or a function that returns an 
        array of values.
    */
    chartGroup.append("path")
        .data([data]) // One way
        .attr("class","line")
        .attr("d",valueLine);

    chartGroup.append("path")
        .attr("class","line")
        .style("stroke","red")
        .attr("d",valueLine2(data));

    chartGroup.append("g")
        .attr("transform","translate(0,"+height+")")
        .call(d3.axisBottom(x));
    chartGroup.append("g")
        .call(d3.axisLeft(y));




    

    
        
    

});

