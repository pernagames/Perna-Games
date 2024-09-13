const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;

let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 3, ballSpeedY = 3;

let player1Up = false, player1Down = false;
let player2Up = false, player2Down = false;

let isPaused = false; // Variável de controle de pausa

let player1Score = 0, player2Score = 0;

// Função para desenhar uma raquete branca com ilusão de 3D usando sombras
function drawPaddle(x, y, width, height) {
    // Sombra da raquete para o efeito 3D
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Raquete branca
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);

    // Remover sombra após desenhar
    ctx.shadowBlur = 0;
}

// Função para desenhar a bola branca com efeito de sombra para criar a ilusão de 3D
function drawBall(x, y, radius) {
    // Criar um leve gradiente para a bola, simulando luz e sombra
    const gradient = ctx.createRadialGradient(x - radius / 3, y - radius / 3, radius / 5, x, y, radius);
    gradient.addColorStop(0, "#ffffff"); // Cor branca no centro
    gradient.addColorStop(1, "#d9d9d9"); // Tom mais escuro para a sombra na borda

    // Sombra da bola
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Desenhar a bola com o gradiente
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    // Remover a sombra para outros elementos
    ctx.shadowBlur = 0;
}

// Função para desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar as raquetes com ilusão de 3D
    drawPaddle(20, player1Y, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - 30, player2Y, paddleWidth, paddleHeight);

    // Desenhar a bola com ilusão de 3D
    drawBall(ballX, ballY, ballRadius);

    // Desenhar as pontuações
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(player1Score, canvas.width / 4, 50);
    ctx.fillText(player2Score, canvas.width * 3 / 4, 50);
}

// Função para mover a bola
function moveBall() {
    if (!isPaused) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX - ballRadius < 30 && ballY > player1Y && ballY < player1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX + ballRadius > canvas.width - 30 && ballY > player2Y && ballY < player2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        // Verificar se alguém fez ponto
        if (ballX - ballRadius < 0) {
            player2Score++;
            checkScore();
            resetBall();
        } else if (ballX + ballRadius > canvas.width) {
            player1Score++;
            checkScore();
            resetBall();
        }
    }
}

// Função para verificar a pontuação e aumentar a velocidade
function checkScore() {
    if (player1Score === 5 || player2Score === 5) {
        // Aumentar a velocidade da bola
        ballSpeedX *= 1.2;
        ballSpeedY *= 1.2;

        // Resetar pontuação
        player1Score = 0;
        player2Score = 0;
    }
}

// Função para resetar a bola
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

// Função para mover as raquetes
function movePaddles() {
    if (!isPaused) {
        if (player1Up && player1Y > 0) player1Y -= 5;
        if (player1Down && player1Y < canvas.height - paddleHeight) player1Y += 5;
        if (player2Up && player2Y > 0) player2Y -= 5;
        if (player2Down && player2Y < canvas.height - paddleHeight) player2Y += 5;
    }
}

// Eventos de teclado para controlar as raquetes
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "w": player1Up = true; break;
        case "s": player1Down = true; break;
        case "ArrowUp": player2Up = true; break;
        case "ArrowDown": player2Down = true; break;
        case " ": togglePause(); break; // Pausar o jogo com espaço
    }
});

document.addEventListener("keyup", function(event) {
    switch (event.key) {
        case "w": player1Up = false; break;
        case "s": player1Down = false; break;
        case "ArrowUp": player2Up = false; break;
        case "ArrowDown": player2Down = false; break;
    }
});

// Função de alternância de pausa
function togglePause() {
    isPaused = !isPaused;
}

// Função principal de atualização
function update() {
    moveBall();
    movePaddles();
    draw();
}

// Carregar a música de fundo
const backgroundMusic = new Audio('musica_de_fundo.mp3'); 
backgroundMusic.loop = true; // Configura a música para tocar em loop
backgroundMusic.volume = 0.5; // Ajuste o volume conforme necessário

// Função de alternância de pausa
function togglePause() {
    isPaused = !isPaused;
    
    // Pausar ou tocar a música com base no estado do jogo
    if (isPaused) {
        backgroundMusic.pause(); // Pausar a música quando o jogo estiver pausado
    } else {
        backgroundMusic.play(); // Tocar a música quando o jogo continuar
    }
}

// Função para iniciar a música assim que o jogador interagir (prevenir políticas de autoplay dos navegadores)
document.addEventListener('keydown', function(event) {
    if (event.key === " " && !backgroundMusic.playing) { // Tocar a música ao iniciar o jogo
        backgroundMusic.play();
    }
});

// Verificar se o áudio está tocando (essa função serve para identificar se o áudio está em pausa ou não)
backgroundMusic.playing = false;
backgroundMusic.onplaying = function() {
    backgroundMusic.playing = true;
};
backgroundMusic.onpause = function() {
    backgroundMusic.playing = false;
};

// Função principal de atualização (continua igual)
function update() {
    moveBall();
    movePaddles();
    draw();
}

setInterval(update, 16);



