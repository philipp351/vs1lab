// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

const geoTagStore = new GeoTagStore();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary



router.get('/', (req, res) => {
  const currentLatitude = req.query.latitude;
  const currentLongitude = req.query.longitude;
  
  res.render('index', { taglist: [], currentLatitude, currentLongitude })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  // POST-Anfrage für '/tagging' verarbeiten
  const { name, latitude, longitude, hashtag } = req.body;

  // Neue GeoTag-Instanz erstellen
  const newGeoTag = new GeoTag(name, parseFloat(latitude), parseFloat(longitude), hashtag);

  // GeoTag zum GeoTagStore hinzufügen
  geoTagStore.addGeoTag(newGeoTag);

  // GeoTags in der Nähe des neuen GeoTags abrufen
  const proximityTags = geoTagStore.getNearbyGeoTags({ latitude: newGeoTag.latitude, longitude: newGeoTag.longitude }, 1000);

  // Beispiel: GeoTag-Liste an das EJS-Template übergeben
  res.render('index', { taglist: proximityTags });
});


/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  // POST-Anfrage für '/discovery' verarbeiten
  const { latitude, longitude, searchTerm } = req.body;

  // GeoTags in der Nähe der angegebenen Koordinaten abrufen
  let discoveryTags = geoTagStore.getNearbyGeoTags({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, 1000);

  // Wenn ein Suchbegriff vorhanden ist, nach diesem Begriff filtern
  if (searchTerm) {
    discoveryTags = discoveryTags.filter(tag => tag.name.includes(searchTerm) || tag.hashtag.includes(searchTerm));
  }

  // Beispiel: GeoTag-Liste an das EJS-Template übergeben
  res.render('index', { taglist: discoveryTags });
});


module.exports = router;
