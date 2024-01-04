// File origin: VS1LAB A3, A4

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
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// App routes (A3)
const geoTagStore = new GeoTagStore();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

let id = 11;

router.get('/api/geotags', (req, res) => {
  const latitude = req.query.disc_latitude;
  const longitude = req.query.disc_longitude;
  const searchterm = req.query.searchterm;

  const string = `latitude: ${latitude} longitude: ${longitude} searchTerm: ${searchterm}`;
  console.log(string)

  if (latitude != null && longitude != null && searchterm != null){
    res.send(geoTagStore.searchNearbyGeoTags(latitude, longitude, 100, searchterm))
  } else if (latitude != null && longitude != null){
    res.send(geoTagStore.getNearbyGeoTags(latitude, longitude, 100))
  } else if (searchterm != null){
    res.send(geoTagStore.searchGeoTags(searchterm))
  } else {
    res.send(geoTagStore.geotags)
  }
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  const latitude = req.body.disc_latitude;
  const longitude = req.body.disc_longitude;
  const name = req.body.name;
  const hashtag = req.body.hashtag;
  const newid = id;

  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag, newid);

  if (latitude == null || longitude == null || name == null || hashtag == null){
    res.status(400).send("Kein vollständiger Tag als Query mitgegeben \n" + "latitude: " +
        latitude +  ", longitude: " + longitude + ", name: " + name + ", hashtag: " + hashtag)
  } else {
    geoTagStore.addGeoTag(newGeoTag)
    id++;

    const string = `http://localhost:3000/api/geotags/${newGeoTag.id}`;
    res.header('New-Tag-URL', string)
    res.status(201).send(newGeoTag)
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */


router.get('/api/geotags/:id', (req, res) => {
  const searchId = req.params.id;

  const string = `id: ${searchId}`;
  //console.log(string)

  if (id != null){
    //console.log(geoTagStore.searchGeoTagByID(searchId))
    res.send(geoTagStore.searchGeoTagByID(searchId))
  } else {
    res.status(400).send("keine ID wurde übergeben")
  }
});



/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  const putId = req.params.id;
  const name = req.body.GeoTag.name;
  const longitude = req.body.GeoTag.longitude;
  const latitude = req.body.GeoTag.latitude;
  const hashtag = req.body.GeoTag.hashtag;

  const putTag = new GeoTag(name, latitude, longitude, hashtag, 27);

  const string = `id: ${putId}`;
  //console.log(string)
  //console.log(putTag)

  if (id != null && putTag){
    //console.log(geoTagStore.searchGeoTagByID(putId))
    geoTagStore.modifyGeoTagById(putId, putTag)
    res.send(geoTagStore.searchGeoTagByID(putId))
  } else {
    res.status(400).send("keine ID oder geotag wurde übergeben")
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  const deleteId = req.params.id;

  const string = `id: ${deleteId}`;
  //console.log(string)

  if (id != null){
    //console.log(geoTagStore.searchGeoTagByID(deleteId))

    const deletedTag = geoTagStore.searchGeoTagByID(deleteId);
    geoTagStore.deleteGeoTagById(deleteId)
    res.send(deletedTag)
  } else {
    res.status(400).send("keine ID wurde übergeben")
  }
});

module.exports = router;
