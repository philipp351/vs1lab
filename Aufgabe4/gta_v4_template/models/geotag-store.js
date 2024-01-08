// File origin: VS1LAB A3

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");


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
            const [name, latitude, longitude, hashtag, id] = item;
            const newGeoTag = new GeoTag(name, latitude, longitude, hashtag, id);
            this.#geotags.push(newGeoTag);
        });
    }

    get geotags() {
        return this.#geotags;
      }

      /* no use
    addGeoTag(name, latitude, longitude, hashtag){
        this.#geotags.push(new GeoTag(name, latitude, longitude, hashtag));
    }

       */

    addGeoTag(GeoTag){
        this.#geotags.push(GeoTag);
    }

    // Method to remove geo-tags from the store by name
    removeGeoTag(name){
        for (let i = 0; i < this.tagList.length; i++) {
            if(this.#geotags[i].name === name){
                this.#geotags.splice(i, 1);
            }
        }
    }

    getNearbyGeoTags(latitude, longitude, radius){
        let nearbyTags = [];
        for (let i = 0; i < this.#geotags.length; i++) {
            if(radius >= Math.sqrt(Math.pow(this.#geotags[i].latitude - latitude, 2) + Math.pow(this.#geotags[i].longitude - longitude, 2))){
                nearbyTags.push(this.#geotags[i]);
            }
        }
        return nearbyTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword){
        let nearbyTags = [];
        for (let i = 0; i < this.#geotags.length; i++) {
            if(radius >= Math.sqrt(Math.pow(this.#geotags[i].latitude - latitude, 2) + Math.pow(this.#geotags[i].longitude - longitude, 2))){
                if(this.#geotags[i].name.includes(keyword) || this.#geotags[i].hashtag.includes(keyword)){
                    nearbyTags.push(this.#geotags[i]);
                }
            }
        }
        return nearbyTags;
    }

    searchGeoTags(keyword) {
        let searchedTags = [];
        for (let i = 0; i < this.#geotags.length; i++) {
            if(this.#geotags[i].name.includes(keyword) || this.#geotags[i].hashtag.includes(keyword)){
                searchedTags.push(this.#geotags[i]);
            }
        }
        return searchedTags;
    }

    searchGeoTagByID(id){
        let geoTag = null;
        for (let i = 0; i < this.#geotags.length; i++) {
            const tag = this.#geotags[i];
            if (tag) {
                if (tag.id == id) {
                    geoTag = this.#geotags[i];
                    break;
                }
                return geoTag;
            }
        }
        return geoTag
    }

    modifyGeoTagById(id, GeoTag){

        for (let i = 0; i < this.#geotags.length; i++) {
            if(this.#geotags[i].id == id){
               // console.log(this.#geotags[i].latitude);
                this.#geotags[i].name = GeoTag.name;
                this.#geotags[i].latitude = Number(GeoTag.latitude);
               // console.log(this.#geotags[i].latitude);
                this.#geotags[i].longitude = Number(GeoTag.longitude);
                this.#geotags[i].hashtag = GeoTag.hashtag;
                break;
            }
        }
    }

    deleteGeoTagById(id) {
        for (let i = 0; i < this.#geotags.length; i++) {
            if(this.#geotags[i].id == id){
                this.#geotags[i] = null;
                break;
            }
        }
    }

}

module.exports = InMemoryGeoTagStore
