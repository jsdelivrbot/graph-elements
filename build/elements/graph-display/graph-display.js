import requestAnimationFunction from "https://rawgit.com/Jamtis/7ea0bb0d2d5c43968c4a/raw/910d7332a10b2549088dc34f386fbcfa9cdd8387/requestAnimationFunction.js";import { Node, Link } from "../../helper/GraphClasses.js";
const style = document.createElement("style");
style.textContent = ":host{display:flex;flex:1;overflow:hidden;position:relative}:host>svg{touch-action:none;flex:1;will-change:transform;transition:transform .5s cubic-bezier(.86,0,.07,1);transform:translateZ(0)}:host>svg>*{touch-action:none}:host>svg>circle.node{fill:#4caf50;fill:var(--node-color,#4caf50);stroke:#1b5e20;stroke-dasharray:9,0;stroke-width:3px;transition:opacity .5s,fill .5s}:host>svg>path.link{pointer-events:none;fill:#ffc107;fill:var(--link-color,#ffc107);stroke:#ffc107;stroke-width:1px;transition:opacity .5s}:host>svg>path.link[loop]{fill:none;stroke-width:2px}";
export class GraphDisplay extends HTMLElement {
  constructor() {
    super();this.attachShadow({
      mode: "open"
    });
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.__requestBroadcast = requestAnimationFunction(event_name => {
      this.__broadcast(event_name)
    });
    const request_resize = requestAnimationFunction(() => {
      this.__resize()
    });
    new ResizeObserver(() => {
      request_resize()
    }).observe(this);
    this.__requestPaint = requestAnimationFunction(this.__paint.bind(this));
    this.nodes = new Map;
    this.links = new Set;
    this.__updatedNodes = new Set;this.shadowRoot.addEventListener("addon-registry", event => {
      event.stopPropagation();try {
        event.target.host = this
      } catch (error) {
        console.error(error)
      }
    }, {
      capture: !0
    });this.shadowRoot.addEventListener("graph-structure-change", () => {
      this.__adoptGraph();this.__requestPaint()
    });this.shadowRoot.addEventListener("graph-update", () => {
      this.__requestPaint()
    });this.shadowRoot.appendChild(style.cloneNode(!0));this.shadowRoot.appendChild(this.svg);
    for (const child of [...this.children]) {
      this.shadowRoot.appendChild(child)
    }
    this.configuration = {};request_resize();
    const graph = this.graph;
    delete this.graph;
    this.graph = graph
  }
  set graph(graph) {
    this.__graph = graph;this.__broadcast("graph-structure-change")
  }
  get graph() {
    return this.__graph
  }
  __adoptGraph() {
    const valid_node_elements = new Set,
      valid_link_elements = new Set;
    this.nodes.clear();this.links.clear();
    if (this.__graph) {
      for (let [key, value] of graph.vertices()) {
        if (!(value instanceof Node)) {
          console.log("new node", value);
          value = new Node({
            value,
            key
          }, this.__requestPaintNode.bind(this));this.graph.setVertex(key, value)
        }
        valid_node_elements.add(value.element);this.nodes.set(key, value);this.__updatedNodes.add(value)
      }
      for (let [source_key, target_key, value] of graph.edges()) {
        if (!(value instanceof Link)) {
          console.log("new link", value);
          value = new Link({
            value,
            source: this.nodes.get(source_key),
            target: this.nodes.get(target_key)
          });this.graph.setEdge(source_key, target_key, value)
        }
        valid_link_elements.add(value.element);this.links.add(value)
      }
    }
    for (const child of [...this.svg.children]) {
      if (child.classList.contains("node") && !valid_node_elements.has(child) || child.classList.contains("link") && !valid_link_elements.has(child)) {
        child.parentNode.removeChild(child)
      }
    }
    for (const link_element of valid_link_elements) {
      this.svg.appendChild(link_element)
    }
    for (const node_element of valid_node_elements) {
      this.svg.appendChild(node_element)
    }
  }
  __requestPaintNode(node) {
    console.assert(this instanceof GraphDisplay, "invalid this", this);console.assert(node instanceof Node, "invalid node", node);this.__updatedNodes.add(node);this.__requestPaint()
  }
  __paint() {
    for (const node of this.__updatedNodes) {
      node.paint()
    }
    for (const link of this.links) {
      if (this.__updatedNodes.has(link.source) || this.__updatedNodes.has(link.target)) {
        link.paint()
      }
    }
    this.__updatedNodes.clear()
  }
  __resize() {
    const {width, height} = this.svg.getBoundingClientRect();
    Object.assign(this.svg.viewBox.baseVal, {
      x: -width / 2,
      y: -height / 2,
      width,
      height
    });this.shadowRoot.dispatchEvent(new CustomEvent("resize"))
  }
  __broadcast(event_name) {
    this.shadowRoot.dispatchEvent(new CustomEvent(event_name))
  }
}
customElements.define("graph-display", GraphDisplay);