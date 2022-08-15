var express = require('express');
var appp = express();
const path = require('path');
const admin = require('firebase-admin');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, documentId } = require('firebase/firestore/lite');
// // var http = require("http");

// var firebase = require("firebase");
// app.use(bodyParser.json());


const firebaseConfig = {
    apiKey: "AIzaSyCr8879hFhkYyWU_FQB20qZZWPtFXB3928",
    authDomain: "react-authentication-ea366.firebaseapp.com",
    projectId: "react-authentication-ea366",
    storageBucket: "react-authentication-ea366.appspot.com",
    messagingSenderId: "143130636284",
    appId: "1:143130636284:web:25c1b7a5039d486e45cc79",
    measurementId: "G-261LMXZL8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

appp.get('/', async function (req, res) {
    try {

        const geoPoints = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [74.6004016, 16.8459244]
                    },
                    properties: {
                        title: 'Mapbox',
                        description: 'Washington, D.C.'
                    }
                },
            ]
        };

        const geoStr = JSON.stringify(geoPoints);

        res.send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="utf-8" />
            <title>Demo: Route finding with the Directions API and Turf.js</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        
            <!-- Import Mapbox GL JS -->
            <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js"></script>
            <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
        
            <!-- Import Mapbox GL Directions -->
            <script
                src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.js"></script>
            <link rel="stylesheet"
                href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.css"
                type="text/css" />
        
            <!-- Import Turf & Polyline -->
            <script src="https://npmcdn.com/@turf/turf/turf.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/mapbox-polyline/1.1.1/polyline.js"></script>
        
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Open Sans', sans-serif;
                }
        
                #map {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 100%;
                }
        
                .sidebar {
                    position: absolute;
                    margin: 20px 20px 30px 20px;
                    width: 25%;
                    top: 0;
                    bottom: 0;
                    padding: 20px;
                    background-color: #fff;
                    overflow-y: scroll;
                }
        
                .card {
                    font-size: small;
                    border-bottom: solid #d3d3d3 2px;
                    margin-bottom: 6px;
                }
        
                .card-header {
                    font-weight: bold;
                    padding: 6px;
                }
        
                .no-route {
                    background-color: #d3d3d3;
                    color: #f00;
                }
        
                .obstacle-found {
                    background-color: #d3d3d3;
                    color: #fff;
                }
        
                .route-found {
                    background-color: #33a532;
                    color: #fff;
                }
        
                .card-details {
                    padding: 3px 6px;
                }
        
                .mapboxgl-marker {
                    cursor: pointer;
                }
            </style>
        </head>
        
        <body>
            <div id="map"></div>
            <div class="sidebar">
                <h1>Reports</h1>
                <div id="reports"></div>
            </div>
        
            <script>
                mapboxgl.accessToken = 'pk.eyJ1IjoiYXJzaGFkMjciLCJhIjoiY2tzMDZuMDZiMDF5azJ3cnk4YncyM3ZpbyJ9.V5xp4D0K1vJSen_EV9XQMA';
                const map = new mapboxgl.Map({
                    container: 'map', // Specify the container ID
                    style: 'mapbox://styles/mapbox/light-v10', // Specify which map style to use
                    center: [74.6008801, 16.845603], // Specify the starting position [lng, lat]
                    zoom: 11 // Specify the starting zoom
                });
        
        
                const points = ${ geoStr };
        
        
                for (const feature of points.features) {
                    console.log(feature);
                    // create a HTML element for each feature
                    const el = document.createElement('div');
                    el.className = 'marker';
        
                    // make a marker for each feature and add it to the map
                    new mapboxgl.Marker({color:'black',cursor:'pointer'})
                        .setLngLat(feature.geometry.coordinates)
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 }) // add popups
                                .setHTML(
                                    \`<h3>\${feature.properties.title}</h3><p>\${feature.properties.description}</p>\`
                    )
                    )
                    .addTo(map);
                    }
            
                  const directions = new MapboxDirections({
                    accessToken: mapboxgl.accessToken,
                    unit: 'metric',
                    profile: 'mapbox/driving',
                    alternatives: true,
                    geometries: 'geojson',
                    controls: { instructions: true },
                    flyTo: false
                  });
            
                  map.addControl(directions, 'top-right');
                  map.scrollZoom.enable();
            
                  const clearances = {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates:[74.6004016, 16.8459244]
                        },
                        properties: {
                          clearance: "13' 2"
                        }
                      },
                    ]
                  };
            
                  const obstacle = turf.buffer(clearances, 0.25, { units: 'kilometers' });
                  let bbox = [0, 0, 0, 0];
                  let polygon = turf.bboxPolygon(bbox);
            
                  map.on('load', () => {
                    map.addLayer({
                      id: 'clearances',
                      type: 'fill',
                      source: {
                        type: 'geojson',
                        data: obstacle
                      },
                      layout: {},
                      paint: {
                        'fill-color': '#f03b20',
                        'fill-opacity': 0.5,
                        'fill-outline-color': '#f03b20'
                      }
                    });
            
                    map.addSource('theRoute', {
                      type: 'geojson',
                      data: {
                        type: 'Feature'
                      }
                    });
            
                    map.addLayer({
                      id: 'theRoute',
                      type: 'line',
                      source: 'theRoute',
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                      },
                      paint: {
                        'line-color': '#cccccc',
                        'line-opacity': 0.5,
                        'line-width': 13,
                        'line-blur': 0.5
                      }
                    });
            
                    // Source and layer for the bounding box
                    map.addSource('theBox', {
                      type: 'geojson',
                      data: {
                        type: 'Feature'
                      }
                    });
                    map.addLayer({
                      id: 'theBox',
                      type: 'fill',
                      source: 'theBox',
                      layout: {},
                      paint: {
                        'fill-color': '#FFC300',
                        'fill-opacity': 0.5,
                        'fill-outline-color': '#FFC300'
                      }
                    });
                  });
            
                  let counter = 0;
                  let prvcounter = 0;
                  const maxAttempts = 20;
                  let emoji = '';
                  let collision = '';
                  let detail = '';
                  const reports = document.getElementById('reports');
            
                  function addCard(id, element, clear, detail) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    // Add the response to the individual report created above
                    const heading = document.createElement('div');
                    // Set the class type based on clear value
                    heading.className =
                      clear === true
                        ? 'card-header route-found'
                        : 'card-header obstacle-found';
                    heading.innerHTML =
                      id === 0
                        ? \`\${emoji} The route \${collision}\`
                        : \`\${emoji} Route \${id} \${collision}\`;
            
                    const details = document.createElement('div');
                    details.className = 'card-details';
                    details.innerHTML = \`This \${detail} irregularity.\`;
            
                    card.appendChild(heading);
                    card.appendChild(details);
                    element.insertBefore(card, element.firstChild);
                  }
            
                  function noRoutes(element) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    // Add the response to the individual report created above
                    const heading = document.createElement('div');
                    heading.className = 'card-header no-route';
                    emoji = '🛑';
                    heading.innerHTML = \`\${emoji} Ending search.\`;
            
                    // Add details to the individual report
                    const details = document.createElement('div');
                    details.className = 'card-details';
                    details.innerHTML = \`No clear route found in \${counter} tries.\`;
            
                    card.appendChild(heading);
                    card.appendChild(details);
                    element.insertBefore(card, element.firstChild);
                  }
            
                  directions.on('clear', () => {
                    map.setLayoutProperty('theRoute', 'visibility', 'none');
                    map.setLayoutProperty('theBox', 'visibility', 'none');
            
                    counter = 0;
                    reports.innerHTML = '';
                  });
            
                  directions.on('route', (event) => {
                    // Hide the route and box by setting the opacity to zero
                    map.setLayoutProperty('theRoute', 'visibility', 'none');
                    map.setLayoutProperty('theBox', 'visibility', 'none');
            
                    if (counter >= maxAttempts || prvcounter >= 30) {
                      noRoutes(reports);
                    } else {
                      // Make each route visible
                      for (const route of event.route) {
                        // Make each route visible
                        map.setLayoutProperty('theRoute', 'visibility', 'visible');
                        map.setLayoutProperty('theBox', 'visibility', 'visible');
            
                        // Get GeoJSON LineString feature of route
                        const routeLine = polyline.toGeoJSON(route.geometry);
            
                        // Create a bounding box around this route
                        // The app will find a random point in the new bbox
                        bbox = turf.bbox(routeLine);
                        polygon = turf.bboxPolygon(bbox);
            
                        // Update the data for the route
                        // This will update the route line on the map
                        map.getSource('theRoute').setData(routeLine);
            
                        // Update the box
                        map.getSource('theBox').setData(polygon);
            
                        const clear = turf.booleanDisjoint(obstacle, routeLine);
            
                        if (clear === true) {
                          collision = 'does not intersect any irregularity!';
                          detail = \`takes \${(route.duration / 60).toFixed(
                            0
                          )} minutes and avoids\`;
                          emoji = '✔️';
                          map.setPaintProperty('theRoute', 'line-color', '#74c476');
                          // Hide the box
                          map.setLayoutProperty('theBox', 'visibility', 'none');
                          // Reset the counter
                          counter = 0;
                        } else {
                          // Collision occurred, so increment the counter
                          counter = counter + 1;
                          prvcounter = prvcounter + 1;
                          // As the attempts increase, expand the search area
                          // by a factor of the attempt count
                          polygon = turf.transformScale(polygon, counter * 0.01);
                          bbox = turf.bbox(polygon);
                          collision = 'is bad.';
                          detail = \`takes \${(route.duration / 60).toFixed(
                            0
                          )} minutes and hits\`;
                          emoji = '⚠️';
                          map.setPaintProperty('theRoute', 'line-color', '#de2d26');
            
                          // Add a randomly selected waypoint to get a new route from the Directions API
                          const randomWaypoint = turf.randomPoint(1, { bbox: bbox });
                          directions.setWaypoint(
                            0,
                            randomWaypoint['features'][0].geometry.coordinates
                          );
                        }
                        // Add a new report section to the sidebar
                        addCard(counter, reports, clear, detail);
                      }
                    }
                  });
            </script>
        </body>
        
        </html>`);
    }
    catch (err) {
        console.log(err);
    }


})




// let lat = 
// let long = 
var server = appp.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

