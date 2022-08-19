# Draggable 3D Globe
Using d3 library to generate a choropleth map on a rotating draggable globe.


![d3_globe](https://user-images.githubusercontent.com/101474762/184650956-5d405a46-2acb-4dae-acce-b794c1488818.gif)

## Usage:
In order to use your own information, please update the world_population.csv. The colors are caclulated with the population_number column. <br> If including new information in the csv, column names from the javascript file may need to be updated. 

## Personalization:
The color palette can be updating by changing the #5c1010 hex code
```javascript
// creates color palette based on the max and min values
            let colorPalette = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range(["#ffffff", "#5c1010"]);
```

Globe dragging and rotating speed can be updated by modyfing the following variable

```javascript
 // defining the rotation and dragging sensitivity of the globe
            const sensitivity = 60
```

Tootlip values can be modyfied by updating the following code block

```javascript
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
```
