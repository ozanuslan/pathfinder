import PriorityQueue from './pq.js';

const canvW = 802;
const canvH = 802;
const rectW = 40;
const rectH = 40;
var gridW = Math.floor(canvW / rectW);
var gridH = Math.floor(canvH / rectH);
let unvisited = new PriorityQueue((a, b) => -a.dist > -b.dist);

function setup() {
    createCanvas(canvW, canvH);
    background(200);
    for (var i = 0; i < gridH; i++) {
        for (var j = 0; j < gridW; j++) {
            if (!(i == 0 && j == 0)) unvisited.push(new Vertex(j, i, Infinity));
            else unvisited.push(new Vertex(j, i, 0));
        }
    }
    console.log(unvisited);
}

function draw() {
    for (var i = 0; i < gridH; i++) {
        for (var j = 0; j < gridW; j++) {
            if (i == gridH - 1 && j == gridW - 1) {
                fill(255, 0, 0);
            } else {
                fill(255);
            }
            rect(1 + j * rectW, 1 + i * rectH, rectW, rectH);
        }
    }

}

window.setup = setup;
window.draw = draw;

function Vertex(x, y, dist) {
    this.x = x;
    this.y = y;
    this.dist = dist;
    var prev;
}