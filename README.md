# Interactive 3D Globe made with d3.js
This project creates a choropleth map on a 3D globe using d3.js. Users can interactively drag, rotate the globe, and hover over countries to display its information. You can customize the visualization with any dataset by updating the CSV file in the data folder.

### Main Features
1. Tooltip showing country name, information, and flag.
2. Drag and rotate features for the globe.
3. Choropleth map displaying country data.
4. Hover events to highlight countries and show details.
5. Clear and detailed comments for easy modification.

### Demo
https://github.com/ben-tiki/d3-globe/assets/101474762/0860f38e-3a8a-4f9a-9c89-394bd1976716

### Data Sources
 - data/globeCoordinates.json - Contains the geographical coordinates needed for the globe
 - data/worldPopulation.csv - CSV file containing data about world population
 - img/flags/ - Contains flags of different countries

### Customization:
**Color Palette**: The color palette can be updated by changing the values in COLOR_RANGE constant. In this example, the colors of the map are calculated based on the population_number column in the CSV data.

**Globe Interaction**: Adjust the ROTATION_SENSITIVITY constant to change drag and rotate sensitivity.

**Tooltip Information**: Update the countryDict object in the mouseover event handler to include new tooltip info.

**CSV Data**: If you want to use your own data, update the worldPopulation.csv file. If including new information in the CSV, column names from the JavaScript file may need to be updated.

**Scale**: The scale of the cloropleth map (linear/logarithmic) can be changed by updating the COLOR_SCALE constant.

### Acknowledgments
This project is based on the original code by Michael Keith, which can be found [here](https://observablehq.com/@michael-keith/draggable-globe-in-d3). 
