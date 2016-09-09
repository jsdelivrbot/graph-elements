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
            require(["../../lib/d3-force/d3-force.js", "../../lib/jamtis/requestAnimationFunction.js", "../../lib/early-element/early-element.js"], function (...args) {
                return resolve(args);
            });
        });

        return function (_x) {
            return _ref2.apply(this, arguments);
        };
    })());
    const style_ready = _asyncToGenerator(function* () {
        const style = document.createElement("style");
        style.textContent = yield (yield fetch(document.currentScript.src + "/../d3-force-graphjs-display.css")).text();
        return style;
    })();
    const [{
        default: D3Force
    }, {
        default: requestAnimationFunction
    }, {
        default: EarlyElement
    }] = yield dependencies_ready;
    // asserts fulfilled
    const __private = {};
    class D3ForceGraphjsDisplay extends EarlyElement {
        createdCallback() {
            var _this = this;

            Object.defineProperties(this, {
                private: {
                    value: new WeakMap()
                },
                root: {
                    value: this.attachShadow({
                        mode: "open"
                    }),
                    enumerable: true
                }
            });
            const _private = {
                force: new D3Force(),
                graphjsDisplay: document.createElement("graphjs-display")
            };
            this.private.set(__private, _private);
            _asyncToGenerator(function* () {
                const style = yield style_ready;
                _this.root.appendChild(style.cloneNode(true));
            })();
            this.root.appendChild(_private.graphjsDisplay);
            // check for assignments before registration
            this.adoptProperties();
            // link tick to drawing
            _asyncToGenerator(function* () {
                while (true) {
                    yield _this.force.tick;
                    _this.graphjsDisplay.updateGraph();
                }
            })();
            this.graphjsDisplay.addEventListener("track", requestAnimationFunction(function (event) {
                // use instance force
                // update graph on force
                _this.force.graph = _private.graph;
            }));
            // fire update-event
            this.dispatchEvent(new CustomEvent("update"));
        }
        get force() {
            return this.private.get(__private).force;
        }
        set force(force) {
            Object.assign(this.private.get(__private).force, force);
        }
        get graphjsDisplay() {
            return this.private.get(__private).graphjsDisplay;
        }
        set graphjsDisplay(graphjsDisplay) {
            Object.assign(this.private.get(__private).graphjsDisplay, graphjsDisplay);
        }
        set graph(graph) {
            this.private.get(__private).graph = graph;
            this.force.graph = graph;
            this.graphjsDisplay.graph = graph;
        }
    }
    // Complete Functionality Registration
    document.registerElement("d3-force-graphjs-display", D3ForceGraphjsDisplay);
})();