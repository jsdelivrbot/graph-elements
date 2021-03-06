"use strict";
import console from "../../helper/console.js";

import GraphAddon from "../graph-addon/graph-addon.js";
import require from "../../helper/require.js";

const canvas_contextmenu_html = `<!-- inject: ./canvas.contextmenu.html -->`;
const style = document.createElement("style");
style.textContent = `<!-- inject: ./graph-contextmenu.css -->`;

export default
class GraphContextmenu extends GraphAddon {
    static tagName = "graph-contextmenu";
    static styleElement = style;
    constructor() {
        super();
        console.log("");
        this.__contextmenusElement = document.createElement("div");
        this.__contextmenusElement.id = "contextmenus";
        this.appendChild(this.__contextmenusElement);
        this.canvasContextmenu = document.createElement("div");
        this.canvasContextmenu.classList.add("contextmenu", "canvas-menu");
        this.canvasContextmenu.innerHTML += canvas_contextmenu_html;
        this.clearCanvas = this.canvasContextmenu.querySelector("#clear-canvas");
        this.clearCanvas.hammer = new Hammer(this.clearCanvas);
        this.addNode = this.canvasContextmenu.querySelector("#add-node");
        this.addNode.hammer = new Hammer(this.addNode);
        // this.canvasContextmenu.hammer = new Hammer(this.canvasContextmenu);
        // this.canvasContextmenu.hammer.options.domEvents = true;
        // this.canvasContextmenu.hammer.on("tap", this.hideContextmenu.bind(this));
        this.canvasTemplate = this.querySelector("#canvas");
        if (this.canvasTemplate instanceof HTMLTemplateElement) {
            const canvas_content = document.importNode(this.canvasTemplate.content, true);
            this.canvasContextmenu.appendChild(canvas_content);
        }
        this.__contextmenusElement.appendChild(this.canvasContextmenu);
        this.nodeTemplate = this.querySelector("#node");
        // add style
        this.styleElement = this.constructor.styleElement.cloneNode(true);
        this.appendChild(this.styleElement);
    }
    async hosted(host) {
        console.log("");
        this.clearCanvas.hammer.on("tap", () => {
            const graph = host.graph;
            graph.clear();
            host.graph = graph;
            this.hideContextmenu();
        });
        this.addNode.hammer.on("tap", () => {
            const graph = host.graph;
            let i = 0;
            while (graph.hasVertex(i)) {
                ++i;
            }
            const {baseVal} = host.svg.viewBox;
            graph.addNewVertex(i, {
                x: (this.x / host.clientWidth - .5) * baseVal.width,
                y: (this.y / host.clientHeight - .5) * baseVal.height
            });
            host.graph = graph;
            this.hideContextmenu();
        });
        host.addEventListener("resize", event => {
            this.hideContextmenu();
        }, {
            passive: true
        });
        if (!host.svg.hammer) {
            host.svg.hammer = new Hammer(host.svg);
        }
        host.svg.hammer.on("tap", event => {
            this.hideContextmenu();
        });
        this.canvasConfigurationPromise = getConfiguration(this.canvasTemplate);
        const canvas_configuration = await this.canvasConfigurationPromise;
        if (canvas_configuration && canvas_configuration.initContextmenu) {
            await canvas_configuration.initContextmenu(this, host);
        }
        host.svg.addEventListener("contextmenu", event => {
            try {
                this.__contextmenuCanvas(host, event);
            } catch (error) {
                console.error(error);
            }
        }, {
            passive: false
        });
        this.nodeConfigurationPromise = getConfiguration(this.nodeTemplate);
        host.addEventListener("graph-structure-change", event => {
            try {
                this.__bindNodes(host);
            } catch (error) {
                console.error(error);
            }
        }, {
            capture: true, // ignored?
            passive: true
        });
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
                }, {
                    passive: false
                });
            }
        }
    }
    async __contextmenuCanvas(host, event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
        // const x = (event.layerX / host.svg.clientWidth - .5) * host.svg.viewBox.baseVal.width;
        // const y = (event.layerY / host.svg.clientHeight - .5) * host.svg.viewBox.baseVal.height;
        const x = event.pageX - host.offsetLeft;
        const y = event.pageY - host.offsetTop;
        await this.showContextmenu(this.canvasContextmenu, x, y);
        const canvas_configuration = await this.canvasConfigurationPromise;
        if (canvas_configuration && canvas_configuration.showContextmenu) {
            await canvas_configuration.showContextmenu(this, host);
        }
    }
    async __contextmenuNode(node, event) {
        console.log(node, event);
        event.preventDefault();
        event.stopPropagation();
        const host = await this.host;
        const node_configuration = await this.nodeConfigurationPromise;
        if (!node.contextmenu) {
            if (this.nodeTemplate instanceof HTMLTemplateElement) {
                // create contextmenu from template
                node.contextmenu = document.createElement("div");
                node.contextmenu.classList.add("contextmenu", "node-menu");
                const node_content = document.importNode(this.nodeTemplate.content, true);
                node.contextmenu.appendChild(node_content);
                if (node_configuration && node_configuration.initContextmenu) {
                    await node_configuration.initContextmenu(this, host, node);
                }
            }
        }
        // const x = (event.layerX / host.svg.clientWidth - .5) * host.svg.viewBox.baseVal.width;
        // const y = (event.layerY / host.svg.clientHeight - .5) * host.svg.viewBox.baseVal.height;
        const x = event.pageX - host.offsetLeft;
        const y = event.pageY - host.offsetTop;
        await this.showContextmenu(node.contextmenu, x, y);
        if (node_configuration && node_configuration.showContextmenu) {
            await node_configuration.showContextmenu(this, host, node);
        }
    }
    async showContextmenu(contextmenu, x, y) {
        console.log(contextmenu, x, y);
        if (this.activeContextmenu) {
            this.activeContextmenu.classList.remove("visible");
        }
        contextmenu.classList.add("visible");
        this.activeContextmenu = contextmenu;
        // this.__contextmenusElement.classList.add("visible");
        // this.__contextmenusElement.innerHTML = "";
        if (contextmenu.parentElement !== this.__contextmenusElement) {
            this.__contextmenusElement.appendChild(contextmenu);
        }
        // this.__contextmenusElement.x.baseVal.value = x;
        // this.__contextmenusElement.y.baseVal.value = y;
        this.__contextmenusElement.style.left = x + "px";
        this.__contextmenusElement.style.top = y + "px";
        // prevent overlapping
        const host = await this.host;
        const max_x = innerWidth - contextmenu.clientWidth - host.offsetLeft;
        if (parseFloat(x) > max_x) {
            this.__contextmenusElement.style.left = max_x + "px";
            this.boundX = max_x;
        } else {
            this.boundX = x;
        }
        this.x = x;
        const max_y = innerHeight - contextmenu.clientHeight - host.offsetTop - 1;
        if (parseFloat(y) > max_y) {
            this.__contextmenusElement.style.top = max_y + "px";
            this.boundY = max_y;
        } else {
            this.boundY = y;
        }
        this.y = y;
    }
    hideContextmenu() {
        console.log(this.activeContextmenu);
        // this.__contextmenusElement.classList.remove("visible");
        if (this.activeContextmenu) {
            this.activeContextmenu.classList.remove("visible");
            this.activeContextmenu = undefined;
            this.x = undefined;
            this.y = undefined;
        }
    }
}
(async () => {
    try {
        // ensure requirements
        await require(["Hammer"]);
        await customElements.whenDefined("graph-display");
        customElements.define(GraphContextmenu.tagName, GraphContextmenu);
    } catch (error) {
        console.error(error);
    }
})();


function getConfiguration(template) {
    if (template instanceof HTMLElement) {
        let script_url = template.dataset.script;
        // console.log("script url", script_url);
        if (script_url) {
            if (!/^(?:[a-z]+:)?\/\//i.test(script_url)) {
                const path = location.pathname.match(/(.*\/).*?/i)[1];
                script_url = location.origin + path + script_url;
                // console.log(path, script_url);
            }
            return import(script_url);
        }
        console.warn("no Configuration script specified");
    }
}