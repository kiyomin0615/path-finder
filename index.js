// 0 is block, 1 is empty, 2 is player
let maze = [];
let found = [];
let visited = [];
let parents = [];

const deltaY = [-1, 0, 1, 0];
const deltaX = [0, 1, 0, -1];

// 좌표 객체
class Pos {
  constructor(y, x) {
    this.x = x;
    this.y = y;
  }
}

// 큐 객체
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

// 버튼 '클릭'하면 게임 시작
buttonElement.addEventListener("click", gameStart);

// 게임 시작 함수
function gameStart() {
  resetMaze();

  generateRandomMaze();

  BFS();

  renderMaze();
}

// 2차원 배열 생성 함수
function createArray2d(row, col) {
  let array2d = new Array(row);  
 
	for(let i = 0; i < col; i++) { 
		array2d[i] = new Array(col);  
	} 
 
	return array2d; 
}

// 미로 초기화 함수
function resetMaze() {
  maze = createArray2d(15, 15);
  found = createArray2d(15, 15);
  visited = createArray2d(15, 15);
  parents = createArray2d(15, 15);

  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      maze[y][x] = 0;
      found[y][x] = false;
      visited[y][x] = false;
      parents[y][x] = new Pos(-1, -1);
    }
  }
}

// 랜덤 미로 생성 함수
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

// 미로 렌더링 함수
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

// BFS 알고리즘
function BFS() {
  let playerPosition = new Pos(1, 1);
  let positionY = playerPosition.y;
  let positionX = playerPosition.x;

  let q = new Queue();

  // 시작 좌표 발견 및 예약
  found[positionY][positionX] = true; // 발견
  q.enqueue(new Pos(positionY, positionX)); // 예약
  parents[positionY][positionX] = new Pos(positionY, positionX); // 시작 좌표의 부모는 시작 좌표

  while (true) {
    // 예약한 좌표가 더이상 없으면 종료
    if (q.length() <= 0) {
      break;
    }

    // 예약 좌표 방문
    let nowPosition = q.dequeue();
    visited[nowPosition.y][nowPosition.x] = true;

    // 다음 좌표 후보
    for (let i = 0; i < 4; i++) {
      let nextPosition = new Pos(nowPosition.y + deltaY[i], nowPosition.x + deltaX[i]);

      if (maze[nextPosition.y][nextPosition.x] === 0) {
        continue;
      }
      if (found[nextPosition.y][nextPosition.x] === true) {
        continue;
      }

      // 다음 좌표 발견 및 예약
      found[nextPosition.y][nextPosition.x] = true;
      q.enqueue(nextPosition);
      parents[nextPosition.y][nextPosition.x] = nowPosition;
    }
  }

  shortestPath();
}

// 최단 경로 함수
function shortestPath() {
  // 도착 좌표
  let y = 13;
  let x = 13;

  const points = [];

  points.push(new Pos(y, x));

  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      console.log(new Pos(y,x), parents[y][x]);
    }
  }

  while (true) {
    if (parents[y][x].y === y && parents[y][x].x === x) {
      break;
    }

    y = parents[y][x].y; // 13
    x = parents[y][x].x; // 12

    points.push(new Pos(y, x));
  }

  points.push(new Pos(y, x));

  points.reverse();

  for (let point of points) {
    maze[point.y][point.x] = 2;
  }
}