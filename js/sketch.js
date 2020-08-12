import PriorityQueue from './pq.js';

const canvW = 1202;
const canvH = 802;
const rectW = 40;
const rectH = 40;
var gridW = Math.floor(canvW / rectW);
var gridH = Math.floor(canvH / rectH);
var startX = 0;
var startY = 0;
var endX = 29;
var endY = 19;
var grid = new Array(gridH);
let unvisited = new PriorityQueue((a, b) => -a.dist > -b.dist);
let frSlider;
let fr = 60;

function setup() {
    frSlider = createSlider(1, 101, 51, 1);
    frSlider.position(canvW / 2 - 120, canvH + 10);
    frSlider.style('width', '240px');
    createCanvas(canvW, canvH);
    background(200);

    // Creating the vertices
    for (var i = 0; i < gridH; i++) {
        grid[i] = new Array(gridW);
        for (var j = 0; j < gridW; j++) {
            if (i == startY && j == startX) grid[i][j] = new Vertex(j, i, 0);
            else grid[i][j] = new Vertex(j, i, Infinity);
            unvisited.push(grid[i][j]);
        }
    }

    // Creating the initial grid visual
    let clr;
    for (var i = 0; i < gridH; i++) {
        for (var j = 0; j < gridW; j++) {
            if (grid[i][j].dist == 0) clr = [0, 255, 0];
            else if (i == endY && j == endX) clr = [255, 0, 0];
            else clr = [255];
            fill(clr);
            rect(1 + j * rectW, 1 + i * rectH, rectW, rectH);
        }
    }
}

function draw() {

}

function dijkstra() {
    let clr;
    fr = frSlider.value();
    frameRate(fr);
    let curr = unvisited.peek();
    if (!unvisited.isEmpty() && !(curr.x == endX && curr.y == endY)) {
        curr = unvisited.pop();
        curr.inQueue = false;
        let neighbors = _neighbors(curr);
        let len = neighbors.length;
        let dist;
        for (var i = 0; i < len; i++) {
            if (neighbors[i].x == curr.x || neighbors[i].y == curr.y) dist = 1; // If the vertex is not on a diagonal
            else dist = sqrt(2); // If the vertex is diagonal
            let alt = curr.dist + dist;
            if (alt < neighbors[i].dist) {
                neighbors[i].dist = alt;
                neighbors[i].prev = curr;
            }
        }
        var temp = new PriorityQueue((a, b) => -a.dist > -b.dist);
        while (!unvisited.isEmpty()) {
            temp.push(unvisited.pop());
        }
        unvisited = temp;

    }
    for (var i = 0; i < gridH; i++) {
        for (var j = 0; j < gridW; j++) {
            if (grid[i][j].dist == 0) clr = [0, 255, 0];
            else if (i == endY && j == endX) clr = [255, 0, 0];
            else if (i == curr.y && j == curr.x) clr = [255, 0, 0];
            else if (grid[i][j].inQueue == false) clr = [0, 0, 255];
            else clr = [255];
            fill(clr);
            rect(1 + j * rectW, 1 + i * rectH, rectW, rectH);
        }
    }
    if (curr.x == endX && curr.y == endY) {
        fill(0, 0, 255);
        rect(1 + curr.x * rectW, 1 + curr.y * rectH, rectW, rectH);
        let path = new Array();
        let ver = grid[endY][endX];
        while (ver != undefined) {
            path.push(ver);
            ver = ver.prev;
        }
        path.forEach(function (vertex) {
            fill(255, 255, 0);
            rect(1 + vertex.x * rectW, 1 + vertex.y * rectH, rectW, rectH);
        })
        fill(0, 255, 0);
        rect(1 + startX * rectW, 1 + startY * rectH, rectW, rectH);
        fill(255, 0, 0);
        rect(1 + endX * rectW, 1 + endY * rectH, rectW, rectH);
    }
    if (unvisited.isEmpty()) {
        fill(0, 0, 255);
        rect(1 + curr.x * rectW, 1 + curr.y * rectH, rectW, rectH);
    }
}

function _neighbors(vertex) {
    var neighbors = new Array();
    for (var i = 1; i >= -1; i--) {
        for (var j = 1; j >= -1; j--) {
            if (vertex.y + i >= 0 && vertex.y + i < gridH && vertex.x + j >= 0 && vertex.x + j < gridW) {
                if (grid[vertex.y + i][vertex.x + j].inQueue == true) neighbors.push(grid[vertex.y + i][vertex.x + j]);
            }
        }
    }
    return neighbors;
}

window.setup = setup;
window.draw = dijkstra;

class Vertex {
    constructor(x, y, dist) {
        this.x = x;
        this.y = y;
        this.dist = dist;
        this.inQueue = true;
        this.isWall = false;
        var prev;
    }
}
