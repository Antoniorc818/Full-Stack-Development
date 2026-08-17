// scripts/benchmark-search.js
//
// Standalone benchmark comparing the trie-based prefix search against the
// naive linear scan it replaces. Generates synthetic trip data (no DB
// connection needed -- this only exercises the two search strategies, not
// Mongoose), runs both approaches at increasing trip counts, and prints a
// markdown table of average lookup time.
//
// Run with: node scripts/benchmark-search.js

const { Trie } = require('../app_api/utils/trie');

const RESORTS = ['Aspen', 'Whistler', 'Zermatt', 'Banff', 'Chamonix', 'Niseko', 'Telluride', 'Verbier'];
const ADJECTIVES = ['Alpine', 'Summit', 'Powder', 'Glacier', 'Ridge', 'Backcountry', 'Peak', 'Frontier'];
const NOUNS = ['Adventure', 'Getaway', 'Retreat', 'Expedition', 'Escape', 'Journey', 'Traverse', 'Circuit'];

// Deterministic pseudo-random generator so benchmark runs are repeatable.
function makeRng(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function generateTrips(count, rng) {
  const trips = [];
  for (let i = 0; i < count; i++) {
    const adjective = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(rng() * NOUNS.length)];
    const resort = RESORTS[Math.floor(rng() * RESORTS.length)];
    trips.push({
      code: `T${i.toString().padStart(6, '0')}`,
      name: `${adjective} ${noun} ${i}`,
      resort
    });
  }
  return trips;
}

// The approach being replaced: check every trip, every query, by hand.
function linearScan(trips, prefix) {
  const p = prefix.toLowerCase();
  const matches = [];
  for (const trip of trips) {
    if (trip.name.toLowerCase().startsWith(p) || trip.resort.toLowerCase().startsWith(p)) {
      matches.push(trip.code);
    }
  }
  return matches;
}

function buildTrie(trips) {
  const trie = new Trie();
  for (const trip of trips) {
    trie.insert(trip.name, trip.code);
    trie.insert(trip.resort, trip.code);
  }
  return trie;
}

function timeIt(fn, iterations) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) fn();
  const end = process.hrtime.bigint();
  return Number(end - start) / 1e6 / iterations; // avg ms per call
}

function runBenchmark() {
  const tripCounts = [100, 1000, 10000, 50000];
  const queries = ['Al', 'Sum', 'Whi', 'Adv'];
  const iterationsPerQuery = 50;

  const rows = [];

  for (const count of tripCounts) {
    const rng = makeRng(count * 7919 + 1);
    const trips = generateTrips(count, rng);
    const trie = buildTrie(trips);

    let linearTotal = 0;
    let trieTotal = 0;

    for (const q of queries) {
      linearTotal += timeIt(() => linearScan(trips, q), iterationsPerQuery);
      trieTotal += timeIt(() => trie.searchPrefix(q), iterationsPerQuery);
    }

    const linearAvgMs = linearTotal / queries.length;
    const trieAvgMs = trieTotal / queries.length;

    rows.push({
      count,
      linearAvgMs,
      trieAvgMs,
      speedup: linearAvgMs / trieAvgMs
    });
  }

  console.log('| Trips indexed | Linear scan (avg ms/query) | Trie search (avg ms/query) | Speedup |');
  console.log('|---|---|---|---|');
  for (const row of rows) {
    console.log(
      `| ${row.count.toLocaleString()} | ${row.linearAvgMs.toFixed(4)} | ${row.trieAvgMs.toFixed(4)} | ${row.speedup.toFixed(1)}x |`
    );
  }
}

runBenchmark();
