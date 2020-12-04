import PriorityQueue from './pq.js';

const canvW = 1202;
const canvH = 802;
const rectW = 40;
const rectH = 40;
const rectFillClr = [14, 39, 60];
const rectStrokeClr = [148, 76, 192];
const startClr = [95, 173, 86];
const endClr = [228, 87, 46];
const currClr = [168, 130, 221];
const visitedClr = [14, 20, 40];
const pathClr = [204, 164, 59];
var gridW = Math.floor(canvW / rectW);
var gridH = Math.floor(canvH / rectH);
var startX = random(30);
var startY = random(20);
var endX = random(30);
var endY = random(20);
let grid = new Array(gridH);
let unvisited = new PriorityQueue((a, b) => -a.dist > -b.dist);
let frSlider;
let fr = 60;
let path;

function setup() {
    createCanvas(canvW, canvH);
    background(200);
    frSlider = createSlider(1, 101, 51, 1);
    frSlider.style('width', '240px', 'text-align','center');

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
            if (grid[i][j].dist == 0) clr = startClr;
            else if (i == endY && j == endX) clr = endClr;
            else clr = rectFillClr;
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
            if (grid[i][j].dist == 0) clr = startClr;
            else if (i == endY && j == endX) clr = endClr;
            else if (i == curr.y && j == curr.x) clr = currClr;
            else if (grid[i][j].inQueue == false) clr = visitedClr;
            else clr = rectFillClr;
            fill(clr);
            stroke(rectStrokeClr);
            rect(1 + j * rectW, 1 + i * rectH, rectW, rectH);
        }
    }
    if (curr.x == endX && curr.y == endY) {
        path = new Array();
        let vertex = grid[endY][endX];
        while (!(vertex.x == startX && vertex.y == startY)) {
            path.push(vertex);
            vertex = vertex.prev;
        }
        window.draw = drawPath;
        print("End node was found successfully.");
    } else if (unvisited.isEmpty()) {
        print("End node couldn't be found.");
        window.draw = draw;
    }
}

function _neighbors(v) {
    var neighbors = new Array();
    for (var i = 1; i >= -1; i--) {
        for (var j = 1; j >= -1; j--) {
            if (v.y + i >= 0 && v.y + i < gridH && v.x + j >= 0 && v.x + j < gridW) {
                if (grid[v.y + i][v.x + j].inQueue == true) neighbors.push(grid[v.y + i][v.x + j]);
            }
        }
    }
    return neighbors;
}

function drawPath() {
    frameRate(20);
    let v = path.pop();
    if (!(v.x == endX && v.y == endY)) {
        fill(pathClr);
        rect(1 + v.x * rectW, 1 + v.y * rectH, rectW, rectH);
    } else {
        window.draw = draw;
    }
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
