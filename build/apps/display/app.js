function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator(function* () {
    const require_ready = new Promise(function (resolve) {
        // require bootstrap
        if (window.require) {
            resolve();
        } else {
            const descriptor = Object.getOwnPropertyDescriptor(window, "require");
            const setter = descriptor && descriptor.set;
            Object.defineProperty(window, "require", {
                set(require) {
                    if (setter) {
                        setter(require);
                    } else {
                        delete window.require;
                        window.require = require;
                    }
                    setTimeout(resolve, 0);
                },
                configurable: true
            });
        }
    });
    const dependencies_ready = new Promise((() => {
        var _ref2 = _asyncToGenerator(function* (resolve) {
            yield require_ready;
            require(["../../lib/graph/AcyclicUndirectedGraph.js"], function (...args) {
                return resolve(args);
            });
        });

        return function (_x) {
            return _ref2.apply(this, arguments);
        };
    })());
    const [{
        default: AcyclicUndirectedGraph
    }] = yield dependencies_ready;
    // asserts fulfilled
    const graph = new AcyclicUndirectedGraph();
    window.graph = graph;
    for (let i = 0; i < 100; ++i) {
        graph.addNode({
            x: Math.random() * 500,
            y: Math.random() * 500,
            radius: 10,
            index: i
        });
    }
    const nodes = [...graph.keys()];
    for (let i = 0; i < 300; ++i) {
        graph.addLink(nodes[Math.floor(Math.random() * nodes.length)], nodes[Math.floor(Math.random() * nodes.length)]);
    }
    const display = document.querySelector("graphjs-display");
    window.display = display;
    // top level assignment is copable
    display.graph = graph;
})();