const eduDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const geoJsonURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'; // (geoJSON format)

export const getAndPrepareData = () =>
    Promise.all([d3.json(eduDataURL), d3.json(geoJsonURL)])
        .then(([eduData, geoJson]) => {
            // format to a topoJson object
            let topoJsonData = topojson.feature(geoJson, geoJson.objects.counties).features
            // add requested data from eduData to topoJsonData (inside 'properties' property)
            // matching eduData objects 'fips' and topoJsonData objects 'id' 
            topoJsonData.forEach((topoObj) => {
                let match = eduData.find(eduObj => eduObj.fips === topoObj.id);
                    topoObj.properties.county = match.area_name;
                    topoObj.properties.state = match.state;
                    topoObj.properties.eduData = match.bachelorsOrHigher;
            })
            // (also passing original geoJson to app.js to draw state borders)
            return [topoJsonData, geoJson]
        })