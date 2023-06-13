# Interactive 3D Globe with d3.js
This projects implements a cloropleth map in a 3D globe using d3.js. The map is interactive and allows the user to drag and rotate the globe and hover over a country to display its details. The visualization can be tailored to any data set by updating the CSV file in the data folder.

### Main Features
1. Tooltip that displays the country name, population, and flag.
2. Drag and rotate features for the globe.
3. Cloropleth map that displays the data of each country.
4. Mouseover and mouseout events that highlight the country and display its details.
5. Detailed comments and well-structured code for easy understanding and modification.

### Demo


### Data Sources
 - data/globeCoordinates.json - Contains the geographical coordinates needed for the globe
 - data/worldPopulation.csv - CSV file containing data about world population
 - img/flags/ - Contains flags of different countries

### Customization:
**Color Palette**: The color palette can be updated by changing the values in COLOR_RANGE constant. In this example, the colors of the map are calculated based on the population_number column in the CSV data.

**Globe Interaction**: The sensitivity of the globe's drag and rotate features can be changed by adjusting the ROTATION_SESNIITIVITY constant.

**Tooltip Information**: If you want to include new information in the tooltip, you can update the countryDict object inside the mouseover event handler.

**CSV Data**: If you want to use your own information, please update the worldPopulation.csv file. If including new information in the CSV, column names from the JavaScript file may need to be updated.

**Scale**: The scale of the cloropleth map (linear/logarithmic) can be changed by updating the COLOR_SCALE constant.


### Acknowledgments
This project is based on the original code by Michael Keith, which can be found [here](https://observablehq.com/@michael-keith/draggable-globe-in-d3). 