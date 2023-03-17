// 0 is block, 1 is empty, 2 is player
let maze = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];

class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Queue {
  constructor() {
    this.arr = [];
  }
  enqueue(item) {
    this.arr.push(item);
  }
  dequeue() {
    return this.arr.shift();
  }
  length() {
    return this.arr.length;
  }
}

const buttonElement = document.querySelector("button");

buttonElement.addEventListener("click", gameStart);

function gameStart() {
  resetMaze();

  generateRandomMaze();

  BFS();

  renderMaze();
}

function resetMaze() {
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      maze[y][x] = 0;
    }
  }
}

function generateRandomMaze() {
  // 1. 미로를 막는다
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
        if (x % 2 === 0 || y % 2 === 0) {
          maze[y][x] = 0;
        } else {
          maze[y][x] = 1;
        }
    }
  }

  // 2. 미로를 뚫는다
  for (let y = 0; y < 15; y++) {
    let count = 0;
    for (let x = 0; x < 15; x++) {
      if (x % 2 === 0 || y % 2 === 0) {
        continue;
      }
      if (x === 13 && y === 13) {
        continue;
      }
      if (x === 13) {
        maze[y+1][x] = 1;
        continue;
      }
      if (y === 13) {
        maze[y][x+1] = 1;
        continue;
      }
      if (Math.random() < 0.5) {
        maze[y][x+1] = 1;
        count++;
      } else {
        let random = Math.floor(Math.random() * (count + 1)); // 0 ~ counter
        maze[y + 1][x-2*random] = 1;
        count = 0;
      }
    }
  }
}

function renderMaze() {
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      let liElement = document.querySelector(`.row-${y+1}.col-${x+1}`);

      if (maze[y][x] === 0) {
        liElement.style.backgroundColor = "red";
      } else if (maze[y][x] === 2) {
        liElement.style.backgroundColor = "yellow";
      } else {
        liElement.style.backgroundColor = "royalblue";
      }
    }
  }
}

function BFS() {
  let playerPos = new Pos(1, 1);
  let posY = playerPos.y;
  let posX = playerPos.x;

  const q = new Queue();

  const deltaY = [-1, 0, 1, 0];
  const deltaX = [0, 1, 0, -1];

  // javascript에서 배열 선언 방식을 모르겠다
  const found = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
  const visited = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
  const parents = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];

  // 시작 좌표 발견 및 예약
  found[posY][posX] = true;
  q.enqueue(new Pos(posY,posX));
  parents[posY][posX] = new Pos(posY,posX);

  while (true) {
    console.log(q.arr)
    if (q.length() <= 0) {
      break;
    }
    // 좌표 방문
    let now = q.dequeue();
    visited[now.y][now.x] = true;

    for (let i = 0; i < 4; i++) {
      let next = new Pos(now.y+deltaY[i], now.x+deltaX[i]);

      if (maze[next.y][next.x] === 0) {
        continue;
      }
      if (found[next.y][next.x] === true) {
        continue;
      }

      // 다음 좌표 발견 및 예약
      found[next.y][next.x] = true;
      q.enqueue(next);
    }
  }
  // shortestPath();
}

const pathPoints = [];

function shortestPath() {
  // 도착 좌표
  let y = 13;
  let x = 13;

  pathPoints.push(y, x);

  while (true) {
    // 출발 좌표
    if (parents[y][x].y === y && parents[y][x].x === x) {
      break;
    }

    y = parents[y][x].y;
    x = parents[y][x].x;

    pathPoints.push(y, x);
  }

  pathPoints.push(y, x);

  pathPoints.reverse();

  for (pathPoint of pathPoints) {
    maze[pathPoint.y][pathPoint.x] = 2;
  }
}