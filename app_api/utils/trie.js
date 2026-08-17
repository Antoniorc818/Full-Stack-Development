// app_api/utils/trie.js
//
// A prefix tree (trie) used to power autocomplete-style search over trip
// names and resorts. The naive approach to "find every trip whose name or
// resort starts with the user's query" is a linear scan: check every trip
// document, every keystroke, and compare the field against the query with
// startsWith(). That is O(n * m) per query, where n is the number of trips
// and m is the length of the field being compared -- and it gets slower as
// the trip catalog grows, even though the query itself hasn't gotten any
// longer.
//
// A trie flips that relationship. Each node represents one character of a
// path from the root, and every node also stores the set of trip codes for
// any indexed string that passes through it. That means a prefix lookup is
// just a walk of one node per character in the query -- O(k), where k is
// the length of the query -- followed by handing back a set that was
// already sitting there. The cost of "knowing which trips match" is paid
// once, at insert time, instead of being repaid on every search.

class TrieNode {
  constructor() {
    this.children = new Map();
    // Trip codes for every indexed string that passes through this node,
    // i.e. every string that has this node's path as a prefix.
    this.tripCodes = new Set();
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Index a single string (a trip name or resort) against a trip code.
   * Every prefix of `word` -- including the empty prefix at the root --
   * gets `tripCode` added to its node, which is what lets searchPrefix
   * return matches in O(k) instead of walking back down the subtree.
   */
  insert(word, tripCode) {
    if (!word) return;
    let node = this.root;
    node.tripCodes.add(tripCode);
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
      node.tripCodes.add(tripCode);
    }
  }

  /**
   * Remove a single string's association with a trip code. Used when a
   * trip is deleted or its name/resort changes, so the index doesn't go
   * stale. Nodes are left in place even if they end up with an empty set
   * (cheap to keep, and another trip's string may still need that path) --
   * the trade-off is documented in the Milestone Three narrative.
   */
  remove(word, tripCode) {
    if (!word) return;
    let node = this.root;
    node.tripCodes.delete(tripCode);
    for (const char of word.toLowerCase()) {
      const next = node.children.get(char);
      if (!next) return; // nothing indexed for this path
      next.tripCodes.delete(tripCode);
      node = next;
    }
  }

  /**
   * Return every trip code indexed under the given prefix. O(k) where k
   * is the length of the prefix, regardless of how many trips exist.
   */
  searchPrefix(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      const next = node.children.get(char);
      if (!next) return [];
      node = next;
    }
    return Array.from(node.tripCodes);
  }
}

module.exports = { Trie, TrieNode };
