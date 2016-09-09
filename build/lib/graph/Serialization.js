(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./DirectedGraph.js", "../circular-json/CircularJSON.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./DirectedGraph.js"), require("../circular-json/CircularJSON.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.DirectedGraph, global.CircularJSON);
        global.Serialization = mod.exports;
    }
})(this, function (exports, _DirectedGraph, _CircularJSON) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _DirectedGraph2 = _interopRequireDefault(_DirectedGraph);

    var _CircularJSON2 = _interopRequireDefault(_CircularJSON);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    Object.defineProperties(_DirectedGraph2.default, {
        stringify: {
            value(graph, ...args) {
                return graph.stringify(...args);
            },
            writable: true,
            configurable: true
        },
        parse: {
            value(...args) {
                // use this as correct constructor
                const graph = new this();
                return graph.parse(...args);
            },
            writable: true,
            configurable: true
        }
    });
    Object.defineProperties(_DirectedGraph2.default.prototype, {
        toJSON: {
            value(...args) {
                const nodes = [];
                const links = [];
                for (const [node] of this) {
                    nodes.push(node);
                }
                let index = 0;
                for (const [, relations] of this) {
                    for (const [source, metaData] of relations.sources) {
                        links.push({
                            source: nodes.indexOf(source),
                            target: index,
                            metaData
                        });
                    }
                    for (const [target, metaData] of relations.targets) {
                        links.push({
                            source: index,
                            target: nodes.indexOf(target),
                            metaData
                        });
                    }
                    ++index;
                }
                return {
                    nodes,
                    links
                };
            },
            writable: true,
            configurable: true
        },
        stringify: {
            value() {
                return JSON.stringify(this.toJSON());
            },
            writable: true,
            configurable: true
        },
        parse: {
            value(...args) {
                const {
                    nodes,
                    links
                } = JSON.parse(...args);
                for (const node of nodes) {
                    this.addNode(node);
                }
                for (const { source, target, metaData } of links) {
                    this.addLink(nodes[source], nodes[target], metaData);
                }
                return this;
            },
            writable: true,
            configurable: true
        }
    });
    exports.default = _DirectedGraph2.default;
});