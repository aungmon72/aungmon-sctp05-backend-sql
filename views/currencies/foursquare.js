//  debugger;

// Lab 6, Step 3, Create an application framework
async function main(map) {

    let response = {};
    var tileLayer;
    country = "Singapore";
    map = init(country);
}  
                                              baseLayers, overlays, overlays2, ll);
    let markerClusterLayer = [];
    let layerGroup         = [];
    let baseLayers         = [];
    let overlays           = [];
    let overlays2          = [];
    let ll                 = -1;

    let freeze_float_view  = 1; //  FREEZE is ZERO and FLOAT is ONE

async function init( country) {

    map = await initMap(map, country);
    //  Lab 6, Step 7, Display the search results
    //  see note 1
    searchResultLayer = L.layerGroup();

    window.addEventListener('DOMContentLoaded', (event) => {

        // display the search result layer if it is not displayed
        // see note 3
        if (!map.hasLayer(searchResultLayer)) {
            map.addLayer(searchResultLayer);
        }
        console.log("if (!map.hasLayer(searchResultLayer)) { ---> completed");
    })  //  window.addEventListener('DOMContentLoaded', (event) => {
    console.log("LEAVING init(map, country)");
    console.log(map);
    return map;
};  //  async function init(country) {

async function initMap(map, country) {
    if (freeze_float_view ==1) map.setView(singapore, 13);
    else {
        console.log (map);
        if (!map) {
            map = new L.map('singapore-map');
            if (!map)   if (freeze_float_view ==1) map.setView(mapSelected, 13);
        }
        else if(map) {
            map.setView(mapSelected, 13);
        }
    }
    console.log("in foursquare.js --> country ", Countries);
    // setup tilelayer
    if (map)
        tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; ' +
                        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
                        'contributors, Imagery (c)' + 
                        '<a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18, id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZXh0cmFrdW4iLCJhIjoiY2swdnZtMWVvMTAxaDNtcDVmOHp2c2lxbSJ9.4WxdONppGpMXeHO6rq5xvg'
    }).addTo(map);
    console.log("LEAVING initMap(map, country) ");
    return map;
}  //  function initMap(country) {

main(map);
