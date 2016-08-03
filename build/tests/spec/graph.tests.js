"use strict";

require("babel/polyfill");

require("amdefine/intercept");

var _libGraph = require("../../lib/graph");

var Graph = _libGraph.Graph;

var AcyclicGraph = _libGraph.AcyclicGraph;

var Tree = _libGraph.Tree;

describe("Graph", function() {
    var graph = new Graph();
    var dgraph = new Graph(true);
    it("Direction", function(done) {
        expect(graph.directed).toBe(false);
        expect(dgraph.directed).toBe(true);
        done();
    });
    it("Consistency", function(done) {});
});

describe("AcyclicGraph", function() {
    var graph = new AcyclicGraph();
    var dgraph = new AcyclicGraph(true);
    it("Direction", function(done) {
        expect(graph.directed).toBe(false);
        expect(dgraph.directed).toBe(true);
    });
    it("Consistency", function(done) {});
});

describe("Tree", function() {
    var graph = new Tree();
    var dgraph = new Tree(true);
    it("Direction", function(done) {
        expect(graph.directed).toBe(false);
        expect(dgraph.directed).toBe(true);
    });
    it("Consistency", function(done) {});
});