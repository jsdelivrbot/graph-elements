"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _conditionedGraph = require("./conditioned-graph.js");

var _conditionedGraph2 = _interopRequireDefault(_conditionedGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $maxCycleLength = Symbol();

/**
 * @class MaxCyclicGraph
 * A class implementing graphs with a maximal cycle length.
 * */
class MaxCyclicGraph extends _conditionedGraph2.default {
    set maxCycleLength(maxCycleLength) {
        this[$maxCycleLength] = Math.max(0, parseInt(maxCycleLength));
    }
    get maxCycleLength() {
        return this[$maxCycleLength] || 0;
    }
    postCondition() {
        return this.getMaximalCycleLength() <= this.maxCycleLength;
    }
}
exports.default = MaxCyclicGraph;