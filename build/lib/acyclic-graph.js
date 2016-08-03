define(["exports", "./conditioned-graph.js"], function (exports, _conditionedGraph) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _conditionedGraph2 = _interopRequireDefault(_conditionedGraph);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class AcyclicGraph
   * A class implementing cycleless graphs.
   * #Following https://en.wikipedia.org/wiki/Cycle_%28graph_theory%29
   * */
  class AcyclicGraph extends _conditionedGraph2.default {
    /**
     * @function postCondition
     * @override
     * @return {Boolean} - Whether the graph is acyclic
     * */
    postCondition() {
      return !super.hasCycle();
    }
    /**
     * @function hasCycle
     * @param {boolean} real - Whether a real test shall be performed (for debugging | must return false as acyclic graph).
     * @return {boolean} - Whether the graph has a cycle.
     * */
    hasCycle(real = false) {
      return real ? super.hasCycle() : false;
    }
    /**
    * @function getAllCyclesFromNode
    * @param {any} node - The node contained by all cycles
     * @param {boolean} real - Whether a real test shall be performed (for debugging | must return empty Set as acyclic graph).
    * @return {Set} - A set of all cycles containing the node
    * */
    getAllCyclesByNode(start_node, real = false) {
      return real ? super.getAllCyclesByNode(start_node) : new Set();
    }
    /**
     * @function getMaximalCycleLengthByNode
     * @param {any} node - The node contained by all cycles
     * @param {boolean} real - Whether a real test shall be performed (for debugging | must return 0 as acyclic graph).
     * @return {Number} - An integer presenting the number of links in the cycle (number of unique nodes)
     * */
    getMaximalCycleLengthByNode(start_node, real = false) {
      return real ? super.getMaximalCycleLengthByNode(start_node) : 0;
    }
  }
  exports.default = AcyclicGraph;
});