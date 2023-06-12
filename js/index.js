// Original code by: Michael Keith
// Source: https://observablehq.com/@michael-keith/draggable-globe-in-d3

// This version of the code introduces the following modifications:
// 1. A tooltip for displaying the country"s name, population, density, area, and flag.
// 2. Retrieval and display of each country"s flag within the tooltip.
// 3. Added csv with country data in order to create the cloropleth map.
// 4. Mouseover and mouseout events for highlighting the selected country.
// 5. Comments and code formatting.

// DATA SOURCES
// ----------------------------------------
const GEO_JSON_PATH = "data/globeCoordinates.json";
const DATA_CSV_PATH = "data/worldPopulation.csv";
const FLAG_PATH = "./img/flags/";

//  CLOROPLETH MAP VARIABLES
// ----------------------------------------
const COLOR_RANGE = ["#ffffff", "#5c1010"];
const COLOR_NO_DATA = "#B2B2B2";
const COLOR_HOVER = "#D3D3D3"
const COLOR_SCALE = "linear"; // "linear" or "log"

// GLOBE VARIABLES
// ----------------------------------------
const GLOBE_CONTAINER = d3.select("#globe-container");
let GLOBE_WIDTH = GLOBE_CONTAINER.node().getBoundingClientRect().width;
let GLOBE_HEIGHT = GLOBE_CONTAINER.node().getBoundingClientRect().height;
let GLOBE_RADIUS = GLOBE_HEIGHT / 2.8;
const ROTATION_SESNIITIVITY = 60;

// MAIN FUNCTION
// ----------------------------------------
async function drawGlobe() {

    // Init variables
    const geoJson = await d3.json(GEO_JSON_PATH);
    const contextData = await d3.csv(DATA_CSV_PATH);
    const colorPalette = createColorPalette(contextData);
    const toolTip = d3.select("#tooltip")

    // Globe initialization
    const geoProjection = d3.geoOrthographic()
        .scale(GLOBE_RADIUS)
        .center([0, 0])
        .rotate([0, -25])
        .translate([GLOBE_WIDTH / 2, GLOBE_HEIGHT / 2]);

    // Append svg to the container
    const globeSvg = d3.select("#globe-container")
        .append("svg")
        .attr("width", GLOBE_WIDTH)
        .attr("height", GLOBE_HEIGHT);


    drawLegend(globeSvg, colorPalette);

    // Convert geoJson data to svg path
    const geoPathGenerator = d3.geoPath().projection(geoProjection);

    // Set outline of the globe
    globeSvg.append("circle")
        .attr("id", "globe")
        .attr("cx", GLOBE_WIDTH / 2)
        .attr("cy", GLOBE_HEIGHT / 2)
        .attr("r", geoProjection.scale());

    // Append a group to the svg
    const globeMap = globeSvg.append("g")

    // Creating function to update the geoProjection
    globeSvg.call(createDrag(geoProjection, globeSvg, geoPathGenerator));

    // Read geoJson data and draw the globe (country by country)
    globeMap.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(geoJson.features)
        .enter().append("path")
        .style("fill", country => getColor(country, contextData, colorPalette))

        // Update contry on mouseover & mouseout
        .on("mouseover", function (country) {
            d3.select(this)
                .style("fill", COLOR_HOVER)

            toolTip.transition()
                .style("display", "block")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");

            const countryDict = {
                name: country.properties.name,
                code: country.id,
                ranking: getCountryProperty(country.id, "rank", contextData),
                population: getCountryProperty(country.id, "population", contextData),
                density: getCountryProperty(country.id, "population_density", contextData),
                area: getCountryProperty(country.id, "area", contextData),
            };

            updateTooltipContent(countryDict);
        })
        .on("mouseout", function () {
            d3.select(this)
                .style("fill", country => getColor(country, contextData, colorPalette))

            toolTip.transition()
                .style("display", "none");
        });

    // Optional rotate
    rotateGlobe(geoProjection, globeSvg, geoPathGenerator);
};

// HELPER FUNCTIONS
// ----------------------------------------
function createColorPalette(data) {
    let scale;
    const [minValue, maxValue] = d3.extent(data, function (d) { return +d.population_number; });
    if (COLOR_SCALE === "log") {
        scale = d3.scaleLog()
    } else if (COLOR_SCALE === "linear") {
        scale = d3.scaleLinear()
    }
    return scale
        .domain([minValue, maxValue])
        .range(COLOR_RANGE);
};

function createDrag(geoProjection, globeSvg, geoPathGenerator) {
    return d3.drag().on("drag", () => {
        const rotate = geoProjection.rotate()
        const rotationAdjustmentFactor = ROTATION_SESNIITIVITY / geoProjection.scale()

        geoProjection.rotate([
            rotate[0] + d3.event.dx * rotationAdjustmentFactor,
            rotate[1] - d3.event.dy * rotationAdjustmentFactor
        ])

        geoPathGenerator = d3.geoPath().projection(geoProjection)
        globeSvg.selectAll("path").attr("d", geoPathGenerator)
    });
};

function rotateGlobe(geoProjection, globeSvg, geoPathGenerator) {
    d3.timer(function (elapsed) {
        const rotate = geoProjection.rotate()
        const rotationAdjustmentFactor = ROTATION_SESNIITIVITY / geoProjection.scale()
        geoProjection.rotate([
            rotate[0] - 1 * rotationAdjustmentFactor,
            rotate[1]
        ])
        geoPathGenerator = d3.geoPath().projection(geoProjection)
        globeSvg.selectAll("path").attr("d", geoPathGenerator)
    });
};

function getCountryProperty(alpha3_code, property, contextData) {
    return contextData
        .filter(d => d.alpha3_code === alpha3_code)
        .map(d => d[property])
        .pop();
};

function getColor(d, contextData, colorPalette) {
    const countryData = contextData.filter(datum => datum.alpha3_code == d.id);
    return countryData.length > 0 ? colorPalette(countryData[0].population_number) : COLOR_NO_DATA;
};

function updateTooltipContent(country) {
    d3.select("#tooltip-country-name").text(country.name);
    d3.select("#tooltip-flag").attr("src", `${FLAG_PATH}${country.code}.png`);
    d3.select("#tooltip-rank").text(country.ranking);
    d3.select("#tooltip-population").text(country.population);
    d3.select("#tooltip-density").text(country.density);
    d3.select("#tooltip-area").text(country.area);
};

function drawLegend(colorPalette) {
    let colorScale = d3.select("#color-scale");

    // Set color background gradient
    colorScale.style("background", `linear-gradient(to right, ${COLOR_RANGE[0]}, ${COLOR_RANGE[1]})`);
    
    const legendWidth = colorScale.node().getBoundingClientRect().width;
    
    const xScale = d3.scaleLinear()
        .range([0, legendWidth])

    const legendAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => d3.format(".2s")(d));

    const legendSvg = d3.select("#color-scale").append("svg")
    const legendHeight = legendSvg.node().getBoundingClientRect().height;

    legendSvg.append('g')
        .attr("transform", `translate(0, ${legendHeight / 10})`)
        .call(legendAxis);
};

// INIT
// ----------------------------------------
drawGlobe();