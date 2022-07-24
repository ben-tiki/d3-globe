// credit to: Michael Keith for the original code
// link: https://observablehq.com/@michael-keith/draggable-globe-in-d3

// the following code is adapted from the above link, with the following modifications:
// 1. Added a tooltip to the globe to display the country name, population, density, area and flag
// 2. Added code to get the flag image from countryflagsapi.com
// 3. Included csv data for the globe to populate the tooltip
// 4. Added css styling to create a cloropeth map
// 5. Added comments to explain the code
// 6. Added mouseover and mouseout events to the globe (changing opacity of the selected country)

    
// reads the d3 json file
data = d3.json("data/world.json")

data.then(function(data) {

    // defining the width and height of the svg
    let width = d3.select("#map").node().getBoundingClientRect().width
    let height = 500

    // defining the dragging sensitivity of the globe
    const sensitivity = 75

    // defining the projection of the globe
    let projection = d3.geoOrthographic()
    .scale(250)
    .center([0, 0])
    .rotate([0,-30])
    .translate([width / 2, height / 2])

    // defining the path generator
    const initialScale = projection.scale()
    let path = d3.geoPath().projection(projection)

    // appending the svg to the div
    let svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    // creating the globe svg
    let globe = svg.append("circle")
    .attr("fill", "#EEE")
    .attr("stroke", "#000")
    .attr("stroke-width", "0.2")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", initialScale)

    // creating function to update the projection
    svg.call(d3.drag().on('drag', () => {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()

    projection.rotate([
        rotate[0] + d3.event.dx * k,
        rotate[1] - d3.event.dy * k
    ])
    
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
    }))
    .call(d3.zoom().on('zoom', () => {

        if(d3.event.transform.k > 0.3) {
        projection.scale(initialScale * d3.event.transform.k)
        path = d3.geoPath().projection(projection)
        svg.selectAll("path").attr("d", path)
        globe.attr("r", projection.scale())
        }
        else {
        d3.event.transform.k = 0.3
        }

    }))

    let map = svg.append("g")

    // add tootltip styling
    let tooltip = d3.select("#map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("pointer-events", "none")
    .style("font-size", "12px")
    .style("font-family", "sans-serif")
    .style("text-align", "center")
    .style("width", "150px")
    .style("height", "100px")
    .style("left", "50px")
    .style("top", "50px")
    .style("display", "none")
    .style("z-index", "1")

    // appending each country to the map
    map.append("g")
    .attr("class", "countries" )
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("class", d => "country_" + d.properties.name.replace(" ","_"))
    .attr("d", path)
    .attr("fill", "white")
    .style('stroke', 'black')
    .style('stroke-width', 0.3)
    .style("opacity",0.8)

    // creating mouseover function, to update opacity of the selected country
    .on("mouseover", function(d) {
        d3.select(this).style("opacity",0.1)
        d3.select(this).style("stroke","black")
        d3.select(this).style("stroke-width",0.5)
        tooltip.transition()
        .duration(200)
        .style("opacity", 1)
                
        // setting up tooltip
        tooltip.style("display", "block")
        tooltip.style("left", d3.event.pageX + "px")
        tooltip.style("top", d3.event.pageY + "px")

        // gets the data from the csv file to populate the tooltip
        // the function filters the csv file to get the data for the selected country (the one that the mouse is over)
        country_data = d3.csv("data/world_population.csv")
        country_data.then(function(country_data) {

            let country_name = d.properties.name

            let country_ranking = country_data.filter(function(d) {
                return d.country == country_name
            }).map(function(d) {
                return d.rank
            }).pop()

            let country_population = country_data.filter(function(d) {
                return d.country == country_name
            }).map(function(d) {
                return d.population
            }).pop()

            let country_density = country_data.filter(function(d) {
                return d.country == country_name
            }).map(function(d) {
                return d.population_density
            }).pop()

            let country_area = country_data.filter(function(d) {
                return d.country == country_name
            }).map(function(d) {
                return d.area
            }).pop()
            
            // adding the data to the tooltip with desired formatting
            tooltip.html(

                "<b>" + country_name + "</b>" + " " + 
                // open flag icon based on the country name
                "<img src='https://countryflagsapi.com/png/" + country_name.toLowerCase() + "'" + "width=" + "20" + "height=" + "15" + "margin-top=100px" + ">" +
                "<br/>" +
                "<br/>" +
                "Rank: " + country_ranking + 
                "<br/>" +
                "Population: " + country_population +
                "<br/>" +
                "Density: " + country_density +
                "<br/>" +
                "Area: " + country_area
                
                )
        })
    }
    )

    // creating mouseout function, to update opacity of the selected country
    .on("mouseout", function(d) {
        d3.select(this).style("opacity",0.8)
        d3.select(this).style("stroke","black")
        d3.select(this).style("stroke-width",0.3)

        tooltip.transition()
        .duration(500)
        .style("opacity", 0)
        tooltip.style("display", "none")


    }
    )

    //Optional rotate
    d3.timer(function(elapsed) {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
        rotate[0] - 1 * k,
        rotate[1]
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
    },200)

}

)