// app_api/utils/tripIndex.js
//
// Wraps a Trie to build and maintain an in-memory search index over each
// trip's name and resort. The index is built once at server startup from
// whatever is already in MongoDB, then kept in sync incrementally as
// trips are added, edited, or deleted through the existing API routes --
// there is no per-request rebuild.

const { Trie } = require('./trie');

const trie = new Trie();
let built = false;

const indexableFields = (trip) => [trip.name, trip.resort].filter(Boolean);

/** Build the index from the full set of trips currently in the database. */
const buildIndex = (trips) => {
  for (const trip of trips) {
    for (const field of indexableFields(trip)) {
      trie.insert(field, trip.code);
    }
  }
  built = true;
  console.log(`Trip search index built (${trips.length} trips indexed).`);
};

/** Add a newly created trip to the index. */
const addTrip = (trip) => {
  for (const field of indexableFields(trip)) {
    trie.insert(field, trip.code);
  }
};

/**
 * Update the index after a trip's name/resort may have changed. Needs the
 * pre-update document so the old strings can be un-indexed before the new
 * ones go in -- otherwise a renamed trip would still match its old name.
 */
const updateTrip = (oldTrip, newTrip) => {
  for (const field of indexableFields(oldTrip)) {
    trie.remove(field, oldTrip.code);
  }
  for (const field of indexableFields(newTrip)) {
    trie.insert(field, newTrip.code);
  }
};

/** Remove a deleted trip from the index. */
const removeTrip = (trip) => {
  for (const field of indexableFields(trip)) {
    trie.remove(field, trip.code);
  }
};

/** Prefix search over trip name/resort. Returns an array of trip codes. */
const search = (prefix) => trie.searchPrefix(prefix);

const isBuilt = () => built;

module.exports = { buildIndex, addTrip, updateTrip, removeTrip, search, isBuilt };
