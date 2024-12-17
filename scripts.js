const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 게임 속도
const gameSpeed = 2;

// 주인공 전투기 이미지 로딩
const planeImg = new Image();
planeImg.src = 'fighter_plane.png'; // 본인의 PNG 파일 경로에 맞게 수정하세요.

const planeWidth = 60;
const planeHeight = 60;
let planeX = canvas.width / 2 - planeWidth / 2;
let planeY = canvas.height - planeHeight - 20;
let planeSpeed = 5;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

// 총알 배열
let bullets = [];
let enemies = [];
let score = 0;

// 키 입력 감지
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') leftPressed = true;
    if (event.key === 'ArrowRight') rightPressed = true;
    if (event.key === 'ArrowUp') upPressed = true;
    if (event.key === 'ArrowDown') downPressed = true;
    if (event.key === ' ') spacePressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') leftPressed = false;
    if (event.key === 'ArrowRight') rightPressed = false;
    if (event.key === 'ArrowUp') upPressed = false;
    if (event.key === 'ArrowDown') downPressed = false;
    if (event.key === ' ') spacePressed = false;
});

// 비행기 이동 함수
function movePlane() {
    if (leftPressed && planeX > 0) planeX -= planeSpeed;
    if (rightPressed && planeX < canvas.width - planeWidth) planeX += planeSpeed;
    if (upPressed && planeY > 0) planeY -= planeSpeed;
    if (downPressed && planeY < canvas.height - planeHeight) planeY += planeSpeed;
}

// 총알 클래스
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 6;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// 적 비행기 클래스
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = gameSpeed;
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// 총알 발사 함수
function shootBullet() {
    if (spacePressed) {
        bullets.push(new Bullet(planeX + planeWidth / 2 - 2.5, planeY));
    }
}

// 충돌 검사 함수
function checkCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        if (
            enemies[i].y + enemies[i].height >= planeY &&
            enemies[i].x < planeX + planeWidth &&
            enemies[i].x + enemies[i].width > planeX
        ) {
            alert('Game Over!');
            document.location.reload();
        }

        for (let j = 0; j < bullets.length; j++) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                break;
            }
        }
    }
}

// 게임 화면 그리기
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 화면 지우기
    ctx.drawImage(planeImg, planeX, planeY, planeWidth, planeHeight); // 전투기 그리기

    // 총알 그리기 및 이동
    bullets.forEach((bullet, index) => {
        bullet.move();
        bullet.draw();
        if (bullet.y < 0) bullets.splice(index, 1); // 화면 밖으로 나가면 제거
    });

    // 적 비행기 그리기 및 이동
    if (Math.random() < 0.02) { // 적 생성 확률
        let enemyX = Math.random() * (canvas.width - 60);
        enemies.push(new Enemy(enemyX, -60));
    }

    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw();
        if (enemy.y > canvas.height) enemies.splice(index, 1); // 화면 밖으로 나가면 제거
    });

    checkCollisions();
    shootBullet();
    movePlane();

    // 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    requestAnimationFrame(draw); // 화면 계속 갱신
}

planeImg.onload = () => {
    draw(); // 게임 시작
};
