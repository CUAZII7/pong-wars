// ページ遷移を行う関数
function goToPage(page) {
    window.location.href = page;
}

//定数
// カラーパレットの定義
const colorPalette = {
    Blue: "#4a99bb",
    Red: "#e03d44",
    Green: "#59bb89",
    Yellow: "#ffab00"
};
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const scriptSource = document.currentScript.src.substr(-1, 1);
console.log("このスクリプトは以下の HTML ファイルから呼び出されました:", scriptSource);
let ballSpeed = 0;
switch(scriptSource){
    case "1": ballSpeed = 1; break;
    case "2": ballSpeed = 2; break;
    case "3": ballSpeed = 3; break;
    case "4": ballSpeed = 4; break;
    case "5": ballSpeed = 5; break;
    case "6": ballSpeed = 6; break;
    case "7": ballSpeed = 7; break;
    case "8": ballSpeed = 8; break;
    case "9": ballSpeed = 9; break;       
}

//ボール1
const B1_COLOR = colorPalette.Blue;
const B1_BALL_COLOR = colorPalette.Green;
//ボール2
const B2_COLOR = colorPalette.Red;
const B2_BALL_COLOR = colorPalette.Yellow;
//ボール3
const B3_COLOR = colorPalette.Green;
const B3_BALL_COLOR = colorPalette.Blue;
//ボール4
const B4_COLOR = colorPalette.Yellow;
const B4_BALL_COLOR = colorPalette.Red;
// ボールとスクエアのサイズの設定
const SQUARE_SIZE = 25;
const numSquaresX = canvas.width / SQUARE_SIZE;
const numSquaresY = canvas.height / SQUARE_SIZE;


// スクエアの初期化
let squares = [];
for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
        if (i < numSquaresX / 2 && j < numSquaresY / 2) {
        squares[i][j] = B1_COLOR;  // 左上: 昼の色
        } else if (i >= numSquaresX / 2 && j < numSquaresY / 2) {
            squares[i][j] = B2_COLOR;  // 右上: 夜の色
        } else if (i < numSquaresX / 2 && j >= numSquaresY / 2) {
            squares[i][j] = B3_COLOR;  // 左下: 夜の色
        } else {
            squares[i][j] = B4_COLOR;  // 右下: 昼の色
        }
    }
}

let x1 = canvas.width / 4;
let y1 = canvas.height / 4;
let dx1 = -ballSpeed;
let dy1 = ballSpeed;

let x2 = (canvas.width / 4) * 3;
let y2 = canvas.height / 4;
let dx2 = -ballSpeed;
let dy2 = -ballSpeed;

let x3 = canvas.width / 4;
let y3 = (canvas.height / 4) * 3;
let dx3 = ballSpeed;
let dy3 = ballSpeed;

let x4 = (canvas.width / 4) * 3;
let y4 = (canvas.height / 4) * 3;
let dx4 = ballSpeed;
let dy4 = -ballSpeed;   

let iteration = 0;

// ボールの描画
function drawBall(x, y, color) {    
    ctx.beginPath();
    ctx.arc(x, y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// スクエアの描画
function drawSquares() {   
    for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
            ctx.fillStyle = squares[i][j];
            ctx.fillRect(
            i * SQUARE_SIZE,
            j * SQUARE_SIZE,
            SQUARE_SIZE,
            SQUARE_SIZE
            );
        }
    }
}

// スクエアの更新とボールの反射
function updateSquareAndBounce(x, y, dx, dy, color) {
    let updatedDx = dx;
    let updatedDy = dy;

    // ボール周囲の複数の点をチェック
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        let checkX = x + Math.cos(angle) * (SQUARE_SIZE / 2);
        let checkY = y + Math.sin(angle) * (SQUARE_SIZE / 2);

        let i = Math.floor(checkX / SQUARE_SIZE);
        let j = Math.floor(checkY / SQUARE_SIZE);

        // スクエア配列の範囲内かどうかを確認
        if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
            // スクエアの色が異なる場合、色を更新し反射方向を決定
            if (squares[i][j] !== color) {
                squares[i][j] = color;
                // 角度に基づいて反射方向を決定
                if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
                    updatedDx = -updatedDx;
                } else {
                    updatedDy = -updatedDy;
                }
            }
        }
    }

    return { dx: updatedDx, dy: updatedDy };
}


// スコアの更新
let bestPlayer = "";
let bestScore = 0;

function updateScoreElement() {
    let B1Score = 0;
    let B2Score = 0;
    let B3Score = 0;
    let B4Score = 0;

    for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
            if (squares[i][j] === B1_COLOR) {
                B1Score++;
            } else if (squares[i][j] === B2_COLOR) {
                B2Score++;
            } else if (squares[i][j] === B3_COLOR) {
                B3Score++;
            } else if (squares[i][j] === B4_COLOR) {
                B4Score++;
            }
        }
    }

    // ベストスコアのトラッキング
    if (B1Score > bestScore) {
        bestScore = B1Score;
        bestPlayer = "BRUE";
    }
    if (B2Score > bestScore) {
        bestScore = B2Score;
        bestPlayer = "PINK";
    }
    if (B3Score > bestScore) {
        bestScore = B3Score;
        bestPlayer = "ORANGE";
    }
    if (B4Score > bestScore) {
        bestScore = B4Score;
        bestPlayer = "YELLOW";
    }

    scoreElement.textContent = `BRUE:${B1Score} RED:${B2Score} GREEN:${B3Score} YELLOW:${B4Score}`;

    // ベストスコアの表示を更新
    updateBestScoreElement();

}

function updateBestScoreElement() {
    // ベストスコアの表示を更新
    bestScoreElement.textContent = `HIGH SCORE : ${bestPlayer} ${bestScore}`;
}

function checkBoundaryCollision(x, y, dx, dy) {
    // 境界との衝突をチェックし、必要に応じて反射
    if (x + dx > canvas.width - SQUARE_SIZE / 2 || x + dx < SQUARE_SIZE / 2) {
        dx = -dx;
    }
    if (
        y + dy > canvas.height - SQUARE_SIZE / 2 ||
        y + dy < SQUARE_SIZE / 2
    ) {
        dy = -dy;
    }

    return { dx: dx, dy: dy };
}

function draw() {
    // 描画関数
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares();

    drawBall(x1, y1, B1_BALL_COLOR);
    let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, B1_COLOR);
    dx1 = bounce1.dx;
    dy1 = bounce1.dy;

    drawBall(x2, y2, B2_BALL_COLOR);
    let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, B2_COLOR);
    dx2 = bounce2.dx;
    dy2 = bounce2.dy;

    drawBall(x3, y3, B3_BALL_COLOR);
    let bounce3 = updateSquareAndBounce(x3, y3, dx3, dy3, B3_COLOR);
    dx3 = bounce3.dx;
    dy3 = bounce3.dy;

    drawBall(x4, y4, B4_BALL_COLOR);
    let bounce4 = updateSquareAndBounce(x4, y4, dx4, dy4, B4_COLOR);
    dx4 = bounce4.dx;
    dy4 = bounce4.dy;

    let boundary1 = checkBoundaryCollision(x1, y1, dx1, dy1);
    dx1 = boundary1.dx;
    dy1 = boundary1.dy;

    let boundary2 = checkBoundaryCollision(x2, y2, dx2, dy2);
    dx2 = boundary2.dx;
    dy2 = boundary2.dy;

    let boundary3 = checkBoundaryCollision(x3, y3, dx3, dy3);
    dx3 = boundary3.dx;
    dy3 = boundary3.dy;

    let boundary4 = checkBoundaryCollision(x4, y4, dx4, dy4);
    dx4 = boundary4.dx;
    dy4 = boundary4.dy;

    x1 += dx1;
    y1 += dy1;

    x2 += dx2;
    y2 += dy2;

    x3 += dx3;
    y3 += dy3;

    x4 += dx4;
    y4 += dy4;

    iteration++;
    if (iteration % 1_000 === 0) console.log("iteration", iteration);

    updateScoreElement();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);