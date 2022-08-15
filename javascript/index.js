// credit to: Michael Keith for the original code
// link: https://observablehq.com/@michael-keith/draggable-globe-in-d3

// the following code is adapted from the above link, with the following modifications:
// 1. Added a tooltip to the globe to display the country name, population, density, area and flag
// 2. Added code to get the flag image from countryflagsapi.com
// 3. Included csv data for the globe to populate the tooltip (and get country fill color)
// 4. Added comments to explain the code
// 5. Added mouseover and mouseout events to the globe (changing opacity of the selected country)

// reads the geojson file 
data = d3.json("data/world.json")

// reads the data file
context = d3.csv("data/world_population.csv")

data.then(function(data) {

        context.then(function(context) {

            // get max and min values to create the color scale
            maxValue = d3.max(context, function(d) { return +d.population_number; })
            minValue = d3.min(context, function(d) { return +d.population_number; })

            // creates color palette based on the max and min values
            let colorPalette = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range(["#ffffff", "#5c1010"]);

            // defining the width and height of the svg
            let width = d3.select("#map").node().getBoundingClientRect().width
            let height = 500

            // defining the rotation and dragging sensitivity of the globe
            const sensitivity = 60

            let projection = d3.geoOrthographic()
            .scale(250)
            .center([0, 0])
            .rotate([0,-30])
            .translate([width / 2, height / 2])

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

            // add tootltip, and styling
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
            .style('stroke', 'black')
            .style('stroke-width', 0.3)
            .style("opacity",0.8)
            // fills the country with the color based on the population density
            .style("fill", function(d) {
                let id = d.id
                let countryData = context.filter(function(d) { return d.alpha3_code == id })
                if(countryData.length > 0) {
                    return colorPalette(countryData[0].population_number)
                }
                else {
                    return "#606060"
                }
            })

            // creating mouseover function, to update opacity of the hovered country
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

                // get data for the hovered country
                let country_name = d.properties.name
                let country_code = d.id

                let country_ranking = context.filter(function(d) {
                    return d.alpha3_code == country_code
                }).map(function(d) {
                    return d.rank
                }).pop()

                let country_population = context.filter(function(d) {
                    return d.alpha3_code == country_code
                }).map(function(d) {
                    return d.population
                }).pop()

                let country_density = context.filter(function(d) {
                    return d.alpha3_code == country_code
                }).map(function(d) {
                    return d.population_density
                }).pop()

                let country_area = context.filter(function(d) {
                    return d.alpha3_code == country_code
                }).map(function(d) {
                    return d.area
                }).pop()
                
                // adding the data to the tooltip with desired formatting
                tooltip.html(

                    "<b>" + country_name + "</b>" + " " + 
                    // open flag icon based on the country name
                    "<img src='https://countryflagsapi.com/png/" + country_code + "'" + "width=" + "20" + "height=" + "15" + "margin-top=100px" + ">" +
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

    )})