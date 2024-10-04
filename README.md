# Interactive 3D Globe made with d3.js
This project implements a choropleth map on a rotating 3D globe using d3.js. Users can interactively drag, rotate the globe, and hover over the countries to display its information. The visualization can be customized with any dataset by updating the CSV file in the data folder.

### Main Features
1. Tooltip showing country name, information, and flag.
2. Drag and rotate features for the globe.
3. Choropleth map displaying country data.
4. Hover events to highlight countries and show details.
5. Clear and detailed comments for easy modification.

### Demo
https://github.com/ben-tiki/d3-globe/assets/101474762/0860f38e-3a8a-4f9a-9c89-394bd1976716

### Data Sources
 - data/globeCoordinates.json - Contains the geographical coordinates needed for displaying the globe
 - data/worldPopulation.csv - CSV file containing data about world population
 - img/flags/ - Contains flags of different countries

### Customization:
**Color Palette**: The color palette can be updated by changing the values in the COLOR_RANGE constant. In this example, the colors of the map are calculated based on the population_number column in the CSV data.

**Globe Interaction**: Rotation and drag sensitivity can be adjusted by modifying the ROTATION_SENSITIVITY constant.

**Tooltip Information**: Update the countryDict object in the mouseover event handler to include new tooltip information.

**CSV Data**: The CSV data can be updated by replacing the worldPopulation.csv file in the data folder. If including new information in the CSV, column names from the JavaScript file may need to be updated.

**Scale**: The scale of the choropleth map (linear/logarithmic) can be changed by updating the COLOR_SCALE constant.

### Acknowledgments
This project is based on the original code by Michael Keith, which can be found [here](https://observablehq.com/@michael-keith/draggable-globe-in-d3).
