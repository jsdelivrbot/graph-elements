(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./StaticAnalysis.js", "../../lib/graph/DirectedGraph.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./StaticAnalysis.js"), require("../../lib/graph/DirectedGraph.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.StaticAnalysis, global.DirectedGraph);
        global.toGraph = mod.exports;
    }
})(this, function (exports, _StaticAnalysis, _DirectedGraph) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _StaticAnalysis2 = _interopRequireDefault(_StaticAnalysis);

    var _DirectedGraph2 = _interopRequireDefault(_DirectedGraph);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    Object.defineProperties(_StaticAnalysis2.default, {
        toGraph: {
            value(scope) {
                return scope.toGraph();
            },
            writable: true,
            enumerable: true
        }
    });
    const scope = _StaticAnalysis2.default.analyze("");
    Object.defineProperties(Object.getPrototypeOf(scope), {
        toGraph: {
            value() {
                const graph = new _DirectedGraph2.default();
                graph.addNode(this);
                const scopes = this.scopes;
                for (const scope of scopes) {
                    scopes.delete(scope);
                    if (scope.scopes.size) {
                        scopes.add(...scope.scopes);
                    }
                    graph.addNode(scope);
                    graph.addLink(scope.parent, scope);
                }
                return graph;
            },
            writable: true,
            enumerable: true
        }
    });
    exports.default = _StaticAnalysis2.default;
});