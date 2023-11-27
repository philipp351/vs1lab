// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    #geotags = []; // Private array to store geotags

    constructor() {
        GeoTagExamples.tagList.forEach((item) => {
            const [name, latitude, longitude, hashtag] = item;
            const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
            this.#geotags.push(newGeoTag);
        });
    }

    returnAsArray() {
        let outputArr =  [];
        this.#geotags.forEach(element => {
            outputArr.push({name: element.name, latitude: element.latitude, longitude: element.longitude, hashtag: element.hashtag})
        });
        return outputArr;
    }

    getAllGeoTag() {
        return this.#geotags;
    }

    // Method to add a geotag to the store
    addGeoTag(geoTag) {
        this.#geotags.push(geoTag);
    }

    // Method to remove geo-tags from the store by name
    removeGeoTagByName(name) {
        this.#geotags = this.#geotags.filter(geoTag => geoTag.name !== name);
    }

    getNearbyGeoTags(location, radius) {
        return this.#geotags.filter(geoTag => this.isInProximity(geoTag, location, radius));
    }

    searchNearbyGeoTags(location, radius, keyword) {
        return this.#geotags.filter(geoTag => 
            this.isInProximity(geoTag, location, radius) &&
            (geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword))
        );
    }

    isInProximity(geoTag, location, radius) {
        const distance = this.calculateDistance(
            location.latitude, location.longitude,
            geoTag.latitude, geoTag.longitude
        );

        return distance <= radius;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const latDiff = lat2 - lat1;
        const lonDiff = lon2 - lon1;
        return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    }


}

module.exports = InMemoryGeoTagStore
