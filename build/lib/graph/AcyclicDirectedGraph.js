(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./DirectedGraph.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./DirectedGraph.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.DirectedGraph);
        global.AcyclicDirectedGraph = mod.exports;
    }
})(this, function (exports, _DirectedGraph) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _DirectedGraph2 = _interopRequireDefault(_DirectedGraph);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    class AcyclicDirectedGraph extends _DirectedGraph2.default {
        /**
         * @function addNode
         * @param {any} node - An object to be set as a node.
         * @returns {Graph} - {this} for chaining
         * */
        addLink(source, target, meta_data) {
            const success = super.addLink(source, target, meta_data);
            if (success) {
                if (super.hasCycle()) {
                    if (this.removeLink(source, target)) {
                        return false;
                    } else {
                        throw new Error("Invalid graph state");
                    }
                }
            }
            return success;
        }
        /**
         * @function hasCycle
         * @return {boolean} - Whether the graph has a cycle.
         * No actual search.
         * */
        hasCycle() {
            return false;
        }
    }
    exports.default = AcyclicDirectedGraph;
});