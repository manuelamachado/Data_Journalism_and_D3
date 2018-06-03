// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
// D3 Scatterplot Assignment
// Create a scatter plot with D3.js.

// set margins
var margin = {top: 20, right: 20, bottom: 100, left: 100};

var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// set x and y scale range
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);

// append the svg in the main body
var svg = d3.select(".chart")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 800 600")
    .classed("svg-content-responsive", true)  //class to make it responsive
    .attr("style", "background: WhiteSmoke")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

// x axis title/label
// divorced rate
svg.append("text")
    .attr("class", "axis-text active")
    .attr("id", "x")
    .attr("x", width/2 -50)
    .attr("y", height + 35)
    .attr("style", "font-weight:bold")
    .attr("data-axis-name", "Divorced_total_2014")
    .text("Divorced rate (%)");
// poverty rate 
svg.append("text")
    .attr("class", "axis-text")
    .attr("id", "x")
    .attr("x", width/2 -50)
    .attr("y", height + 55)
    .attr("style", "font-weight:bold")
    .attr("data-axis-name", "Poverty_rate")
    .text("Poverty rate (%)");
// unemployment rate
svg.append("text")
    .attr("class", "axis-text")
    .attr("id", "x")
    .attr("x", width/2 -50)
    .attr("y", height + 75)
    .attr("style", "font-weight:bold")
    .attr("data-axis-name", "Unemployment_rate")
    .text("Unemployment rate (%)");

// y axis title/label
// depression rate
svg.append("text")
    .attr("class", "axis-text active")
    .attr("id", "y")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2 - 50)
    .attr("y", -40)
    .attr("dy", ".71em")
    .attr("style", "font-weight:bold")
    .attr("data-axis-name", "Depression_total_2014")
    .text("Depression rate (%)");
// physical activity
svg.append("text")
    .attr("class", "axis-text")
    .attr("id", "y")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2 - 50)
    .attr("y", -60)
    .attr("dy", ".71em")
    .attr("style", "font-weight:bold")
    .attr("data-axis-name", "Physical_activity")
    .text("Physical Activity rate (%)");
//Dr visits within last year rate
svg.append("text")
    .attr("class", "axis-text")
    .attr("id", "y")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2 - 110)
    .attr("y", -80)
    .attr("dy", ".71em")
    .attr("style", "font-weight:bold")
    .attr("data-axis-name", "Dr_visit_within_last_year")
    .text("% who visited doctor within the last year");

// pull in the data
var csv_data = "Data/data.csv";

d3.csv(csv_data, function(error, data) {
    if (error) throw error;

    data.forEach(function(d){
        // make into a number in case it comes in as string
        d.Divorced_total_2014 = +d.Divorced_total_2014;
        d.Depression_total_2014 = +d.Depression_total_2014;
        d.Poverty_rate = +d.Poverty_rate;
        d.Physical_activity = +d.Physical_activity;
        d.Unemployment_rate = +d.Unemployment_rate;
        d.Dr_visit_within_last_year = +d.Dr_visit_within_last_year;
    });

    /* Initialize tooltip */
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([120, 10])
        .html(function(d) { 
            return d; 
        });
        svg.call(tip); 

    // get default active data-axis-name
    var activeX = d3
        .select("#x")
        .filter(".active").attr("data-axis-name");
    var activeY = d3
        .select("#y")
        .filter(".active").attr("data-axis-name");

    console.log("activeX: " + activeX + "; activeY: " + activeY);
    
    // plot first chart 
    plot_data(activeX, activeY);

    // *** change active x and y text on click
    var allX = d3.selectAll("#x");
    var allY = d3.selectAll("#y");

    change_active_x(allX);
    change_active_y(allY);

    // Function input params (d3.selectAll(x axis labels))
    function change_active_x(textLabels){
        textLabels.on("click", function(event){
            var clicked = d3.select(this)
            var currentActive = textLabels.filter(".active")

            // swap class of active and clicked
            clicked.attr("class", "axis-text active");
            currentActive.attr("class", "axis-text");

            activeX = clicked.attr("data-axis-name");
            plot_data(activeX, activeY);
            //return clicked.attr("data-axis-name");
        });
    }
    // Function input param (d3.selectAll(y axis labels))
    function change_active_y(textLabels){
        textLabels.on("click", function(event){
            var clicked = d3.select(this)
            var currentActive = textLabels.filter(".active")

            // swap class of active and clicked
            clicked.attr("class", "axis-text active");
            currentActive.attr("class", "axis-text")

            activeY = clicked.attr("data-axis-name");
            plot_data(activeX, activeY);
        });
    }

    // *** Function that creates graph for selected x and y
    function plot_data(x_data, y_data) {

        // set domain
        xScale.domain(d3.extent(data, function(d) {
            return d[x_data];
        }));
        yScale.domain(d3.extent(data, function(d){
            return d[y_data];
        }));

        // *** If there's no previous plots, create one ***
        if (d3.select(".dot").empty() == true){
            // append svg for x and y axes
            svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

            svg.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

            // scatterplot dots
            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 10)
                .attr("cx", function(d){
                    return xScale(d[x_data]);
                })
                .attr("cy", function(d){
                    return yScale(d[y_data])
                })
                .attr("fill", "purple")
                .style("opacity", 0.3);

            // append text to each point
            // note: only appended tooltip to the text as it is more in the center of the scatter dot
            var text = svg.selectAll("dot")
                .data(data)
                .enter()
                .append("text");

            var textLabels = text
                .attr("class", "label")
                .attr("x", function(d){
                    return xScale(d[x_data])-8;
                })
                .attr("y", function(d){
                    return yScale(d[y_data])+4;
                })
                .text(function(d){
                    console.log(d.State);
                    return d.State;
                })
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("font-family", "verdana")
                .style("opacity", 0.6)
                // append tooltip 
                .on('mouseover', handleMouseOver)
                .on('mouseout', tip.hide);

        } // end if d3.select(".dot") is empty b/c no dots have been created yet
        else { // if there are dots, rescale and transform dot locations
            // set new domain
            xScale.domain(d3.extent(data, function(d) {
                return d[x_data];
            }));
            yScale.domain(d3.extent(data, function(d){
                return d[y_data];
            }));
            // rescale the axes
            svg.select(".xaxis")
                .transition()
                .call(xAxis);
            svg.select(".yaxis")
                .transition()
                .call(yAxis);

            // reposition the dots
            svg.selectAll(".dot")
                .transition()
                .attr("cx", function(d){
                    return xScale(d[x_data]);
                })
                .attr("cy", function(d){
                    return yScale(d[y_data])
                });
                
            // reposition the text associated with each dot
            svg.selectAll(".label")
                .transition()
                .attr("x", function(d){
                    return xScale(d[x_data])-8;
                })
                .attr("y", function(d){
                    return yScale(d[y_data])+4;
                })
                .text(function(d){
                    console.log(d.State);
                    return d.State;
                })

            // update the tooltip 
            svg.selectAll(".label")
            .on('mouseover', handleMouseOver);
        } // end else rescale and repositioning

        // function to handle mouse over event to update when an axis changes
        function handleMouseOver(d){
            tip.show(d.state_ + "<hr>" + 
                "X" + ": " + d[x_data] + "%"
                + ", <br>" + "Y" + ": " + d[y_data] + "%");
        }
        
    } // end plot_data function

}); // end d3.csv 
