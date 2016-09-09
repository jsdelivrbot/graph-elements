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
    /*
    const dependencies_ready = new Promise(async resolve => {
        await require_ready;
        require(["../../lib/d3-force/d3-force.js", "../../lib/jamtis/requestAnimationFunction.js"], (...args) => resolve(args));
    });
    */
    const style_ready = _asyncToGenerator(function* () {
        const style = document.createElement("style");
        style.textContent = yield (yield fetch(document.currentScript.src + "/../graphjs-sidebar.css")).text();
        return style;
    })();
    /*
     const [{
        default: D3Force
    },{
        default: requestAnimationFunction
    }] = await dependencies_ready;
    */
    // asserts fulfilled
    const __private = {};
    class GraphjsSidebar extends HTMLElement {
        createdCallback() {
            var _this = this;

            Object.defineProperties(this, {
                private: {
                    value: new WeakMap()
                },
                root: {
                    value: this.createShadowRoot(),
                    enumerable: true
                }
            });
            const _private = {};
            this.private.set(__private, _private);
            _asyncToGenerator(function* () {
                const style = yield style_ready;
                _this.root.appendChild(style.cloneNode(true));
            })();
            for (const child of this.children) {
                this.root.appendChild(child);
            }
        }
    }
    // Complete Functionality Registration
    document.registerElement("graphjs-sidebar", GraphjsSidebar);
})();