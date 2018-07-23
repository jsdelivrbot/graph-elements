"use strict";

import console from "../../helper/console.js";

import GraphAddon from "../graph-addon/graph-addon.js";
import require from "../../helper/require.js";
// import requestAnimationFunction from "https://rawgit.com/Jamtis/7ea0bb0d2d5c43968c4a/raw/910d7332a10b2549088dc34f386fbcfa9cdd8387/requestAnimationFunction.js";
const style = document.createElement("style");
style.textContent = ":host>svg>foreignObject{display:block}:host>svg>foreignObject .contextmenu{font:13px Roboto;display:none;flex-direction:column;overflow-x:hidden;overflow-y:auto;width:fit-content;border-radius:1px;box-shadow:0 1px 5px #999;background:#fff;padding:5px 0}:host>svg>foreignObject .contextmenu.visible{display:flex}:host>svg>foreignObject .contextmenu>*{flex:0 0 auto;padding:5px 20px;border:0 none;margin:0}:host>svg>foreignObject .contextmenu>:hover{background:hsl(0,0%,60%,30%)}:host>svg>foreignObject .contextmenu>:focus{outline:0}";
const listener_options = {
    capture: true
};
export default class GraphContextmenu extends GraphAddon {
    constructor() {
        super();
        this.__foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.canvasTemplate = this.querySelector("#canvas");
        if (this.canvasTemplate) {
            this.canvasContextmenu = document.createElement("div");
            this.canvasContextmenu.classList.add("contextmenu");
            const canvas_content = document.importNode(this.canvasTemplate.content, true);
            this.canvasContextmenu.appendChild(canvas_content);
        }
        this.nodeTemplate = this.querySelector("#node");
        // add style
        this.appendChild(style.cloneNode(true));
    }
    async hosted(host) {
        console.log("");
        host.svg.appendChild(this.__foreignObject);
        if (!host.svg.hammer) {
            host.svg.hammer = new Hammer(host.svg);
        }
        host.svg.hammer.on("tap", event => {
            if (event.srcEvent.path[0] === host.svg) {
                this.__tapCanvas();
            }
        });
        this.canvasInitializer = await this.__getInitializer(this.canvasTemplate);
        host.svg.addEventListener("contextmenu", event => {
            try {
                this.__contextmenuCanvas(host, event);
            } catch (error) {
                console.error(error);
            }
        });
        this.nodeInitializer = await this.__getInitializer(this.nodeTemplate);
        host.shadowRoot.addEventListener("graph-structure-change", event => {
            try {
                this.__bindNodes(host);
            } catch (error) {
                console.error(error);
            }
        }, listener_options);
        this.__bindNodes(host);
    }
    __bindNodes(host) {
        console.log("");
        for (const [key, node] of host.nodes) {
            if (!node.contextmenuInstalled) {
                node.contextmenuInstalled = true;
                node.element.addEventListener("contextmenu", async event => {
                    try {
                        await this.__contextmenuNode(node, event);
                    } catch (error) {
                        console.error(error);
                    }
                });
            }
        }
    }
    async __getInitializer(template) {
        let script_url = template.dataset.script;
        // console.log("script url", script_url);
        if (script_url) {
            if (!/^(?:[a-z]+:)?\/\//i.test(script_url)) {
                const path = location.pathname.match(/(.*\/).*?/i)[1];
                script_url = location.origin + path + script_url;
                // console.log(path, script_url);
            }
            const module = await import(script_url);
            return module.default;
        }
        console.warn("no initializer script specified");
        return () => {};
    }
    __tapCanvas() {
        console.log("");
        this.hideContextmenu();
    }
    __contextmenuCanvas(host, event) {
        console.log(event);
        event.preventDefault();
        const x = (event.layerX / host.svg.clientWidth - .5) * host.svg.viewBox.baseVal.width;
        const y = (event.layerY / host.svg.clientHeight - .5) * host.svg.viewBox.baseVal.height;
        this.showContextmenu(this.canvasContextmenu, x, y);
    }
    async __contextmenuNode(node, event) {
        console.log(node, event);
        event.preventDefault();
        event.stopPropagation();
        const host = await this.host;
        if (!node.contextmenu) {
            if (this.nodeTemplate) {
                // create contextmenu from template
                node.contextmenu = document.createElement("div");
                node.contextmenu.classList.add("contextmenu");
                const node_content = document.importNode(this.nodeTemplate.content, true);
                node.contextmenu.appendChild(node_content);
                this.nodeInitializer(node);
            }
        }
        const x = (event.layerX / host.svg.clientWidth - .5) * host.svg.viewBox.baseVal.width;
        const y = (event.layerY / host.svg.clientHeight - .5) * host.svg.viewBox.baseVal.height;
        this.showContextmenu(node.contextmenu, x, y);
    }
    showContextmenu(contextmenu, x, y) {
        console.log(contextmenu, x, y);
        if (this.activeContextmenu) {
            this.activeContextmenu.classList.remove("visible");
        }
        contextmenu.classList.add("visible");
        this.activeContextmenu = contextmenu;
        // this.__foreignObject.classList.add("visible");
        // this.__foreignObject.innerHTML = "";
        this.__foreignObject.appendChild(contextmenu);
        this.__foreignObject.x.baseVal.value = x;
        this.__foreignObject.y.baseVal.value = y;
    }
    hideContextmenu() {
        console.log(this.activeContextmenu);
        // this.__foreignObject.classList.remove("visible");
        if (this.activeContextmenu) {
            this.activeContextmenu.classList.remove("visible");
            this.activeContextmenu = undefined;
        }
    }
}
(async () => {
    try {
        // ensure requirements
        await require(["Hammer"]);
        await customElements.whenDefined("graph-display");
        customElements.define("graph-contextmenu", GraphContextmenu);
    } catch (error) {
        console.error(error);
    }
})();