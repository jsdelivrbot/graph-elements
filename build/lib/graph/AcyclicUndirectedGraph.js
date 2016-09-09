(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./UndirectedGraph.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./UndirectedGraph.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.UndirectedGraph);
        global.AcyclicUndirectedGraph = mod.exports;
    }
})(this, function (exports, _UndirectedGraph) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _UndirectedGraph2 = _interopRequireDefault(_UndirectedGraph);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    class AcyclicUndirectedGraph extends _UndirectedGraph2.default {
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
    exports.default = AcyclicUndirectedGraph;
});