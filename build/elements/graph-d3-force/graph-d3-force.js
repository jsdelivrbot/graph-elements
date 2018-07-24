"use strict";

import console from "../../helper/console.js";

import GraphAddon from "../graph-addon/graph-addon.js";
import require from "../../helper/require.js";
import requestAnimationFunction from "https://rawgit.com/Jamtis/7ea0bb0d2d5c43968c4a/raw/910d7332a10b2549088dc34f386fbcfa9cdd8387/requestAnimationFunction.js";

const default_configuration = {
    link: {
        distance: 300,
        strength: 0.02
    },
    charge: {
        strength: -40
    },
    gravitation: {
        strength: 100
    }
};
const worker_string = `importScripts("https://d3js.org/d3.v4.min.js");
// importScripts(this.origin + "/node_modules/d3/build/d3.js");

const simulation = d3.forceSimulation();
const link_force = d3.forceLink();
const center_force = d3.forceCenter(0, 0);
const charge_force = d3.forceManyBody();
let buffer_array;
simulation.force("link", link_force);
simulation.force("center", center_force);
simulation.force("charge", charge_force);
simulation.stop();
simulation.on("tick", () => {
    const nodes = simulation.nodes();
    for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        buffer_array[i * 2] = node.x;
        buffer_array[i * 2 + 1] = node.y;
    }
    // console.log(nodes.map(JSON.stringify), buffer_array);
    // dispatch draw message to main window
    // write graph data into buffer
    const buffer_length = buffer_array.buffer.byteLength;
    // console.log("WORKER: buffer length", buffer_length);
    // transfer buffer for faster propagation to display
    postMessage({
        buffer: buffer_array.buffer
    }, [buffer_array.buffer]);
    buffer_array = new Float32Array(new ArrayBuffer(buffer_length));
});
addEventListener("message", ({ data }) => {
    console.log("WORKER: get message", data);
    if (data.configuration) {
        const {
            link,
            charge,
            gravitation,
            alpha,
            alphaTarget,
            alphaMin,
            alphaDecay,
            velocityDecay
        } = data.configuration;
        if (link) {
            if ("distance" in link) {
                link_force.distance(link.distance);
            }
            if ("strength" in link) {
                link_force.strength(link.strength);
            }
            simulation.force("link", link_force);
        }
        if (charge) {
            if ("strength" in charge) {
                charge_force.strength(charge.strength);
            }
            if ("maxDistance" in charge) {
                charge_force.maxDistance(charge.maxDistance);
            }
            if ("minDistance" in charge) {
                charge_force.minDistance(charge.minDistance);
            }
            simulation.force("charge", charge_force);
        }
        if (alpha !== undefined) {
            simulation.alpha(alpha);
        }
        if (alphaTarget !== undefined) {
            simulation.alphaTarget(alphaTarget);
        }
        if (alphaMin !== undefined) {
            simulation.alphaMin(alphaMin);
        }
        if (alphaDecay !== undefined) {
            simulation.alpha(alphaDecay);
        }
        if (velocityDecay !== undefined) {
            simulation.velocityDecay(velocityDecay);
        }
    }
    if (data.graph && data.buffer) {
        buffer_array = new Float32Array(data.buffer);
        const { nodes, links } = data.graph;
        simulation.nodes(nodes);
        link_force.links(links);
    }
    if (data.updatedNode && data.updatedNode[Symbol.iterator]) {
        let i = 0;
        const nodes = simulation.nodes();
        for (const updated_node of data.updatedNode) {
            const node = nodes[i++];
            node.x = updated_node.x;
            node.y = updated_node.y;
        }
    }
    if ("run" in data) {
        if (data.run) {
            simulation.restart();
        } else {
            simulation.stop();
        }
    }
});`;
// web worker same origin policy requires host to support OPTIONS CORS
export class GraphD3Force extends GraphAddon {
    constructor() {
        super();
        let _configuration = this.configuration;
        delete this.configuration;
        // define own properties
        Object.defineProperties(this, {
            worker: {
                // value: new Worker(worker_data)
                value: new Worker("data:application/javascript," + encodeURIComponent(worker_string)),
                enumerable: true
            },
            configuration: {
                set(configuration) {
                    this.worker.postMessage({
                        configuration
                    });
                    _configuration = configuration;
                },
                get() {
                    return _configuration;
                },
                enumerable: true
            }
        });
        const on_worker_message = requestAnimationFunction(async ({ data }) => {
            try {
                console.log("receive worker update");
                const buffer_array = new Float32Array(data.buffer);
                await this.__applyGraphUpdate(buffer_array);
            } catch (error) {
                console.error(error);
            }
        });
        this.worker.addEventListener("message", on_worker_message);
        this.configuration = _configuration || default_configuration;
        // initiate worker with preassigned graph
    }
    async sendGraphToWorker() {
        console.log("");
        const host = await this.host;
        const nodes = [...host.nodes.values()];
        const d3_nodes = nodes.map(({ x, y }, index) => ({ x, y, index }));
        const links = [...host.links].map(({ source, target }) => ({
            source: nodes.indexOf(source), // index for d3
            target: nodes.indexOf(target) // index for d3
        }));
        // 32 bit * 2 * N
        const buffer = new ArrayBuffer(nodes.length * 4 * 2);
        const buffer_array = new Float32Array(buffer);
        for (let i = 0; i < nodes.length; ++i) {
            const node = nodes[i];
            buffer_array[i * 2] = node.x;
            buffer_array[i * 2 + 1] = node.y;
        }
        this.worker.postMessage({
            graph: {
                nodes: d3_nodes,
                links
            },
            buffer
        });
    }
    async start() {
        await this.host;
        this.worker.postMessage({
            run: true
        });
    }
    async stop() {
        await this.host;
        this.worker.postMessage({
            run: false
        });
    }
    async __applyGraphUpdate(buffer_array) {
        console.log(buffer_array.length);
        const host = await this.host;
        const vertices = [...host.graph.vertices()];
        for (let i = 0; i < vertices.length; ++i) {
            const node = vertices[i][1];
            const x = buffer_array[i * 2];
            const y = buffer_array[i * 2 + 1];
            node.x = x;
            node.y = y;
        }
        this.dispatchEvent(new Event("graph-update", {
            composed: true
        }));
    }
};
(async () => {
    try {
        // ensure requirements
        await require(["d3"]);
        await customElements.whenDefined("graph-display");
        customElements.define("graph-d3-force", GraphD3Force);
    } catch (error) {
        console.error(error);
    }
})();