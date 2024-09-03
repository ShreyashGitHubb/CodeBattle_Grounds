document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const birdImage = new Image();
    birdImage.src = "https://i.postimg.cc/bJN9Z3Vp/Bird.png";

    const pipeImage = new Image();
    pipeImage.src = "https://i.postimg.cc/pdBBVgZs/Pipe.png";

    const background = new Image();
    background.src = "https://i.postimg.cc/VNwR8YjS/Background.png";

    const bird = {
        x: 50,
        y: canvas.height / 2 - 15,
        width: 34,
        height: 24,
        velocity: 0,
        gravity: 0.4,
        jump: -7,
    };

    const pipes = [];
    const pipeWidth = 50;
    const pipeGap = 150;
    let pipeSpeed = 2;

    let score = 0;
    let gameRunning = false;

    const gameOverPopup = document.getElementById("gameOverPopup");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const restartButton = document.getElementById("restartButton");

    function drawBird() {
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipe(x, height) {
        ctx.drawImage(pipeImage, x, 0, pipeWidth, height);
        ctx.drawImage(pipeImage, x, height + pipeGap, pipeWidth, canvas.height - height - pipeGap);
    }

    function drawScore() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, canvas.width - 100, 30);
    }

    function update() {
        if (!gameRunning) return;

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y < 0 || bird.y + bird.height > canvas.height) {
            endGame();
        }

        if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 200) {
            createPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            if (
                bird.x < pipes[i].x + pipeWidth &&
                bird.x + bird.width > pipes[i].x &&
                (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + pipeGap)
            ) {
                endGame();
            }

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
                score++;
                increaseSpeed();
            }
        }
    }

    function createPipe() {
        const height = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, height: height });
    }

    function endGame() {
        gameRunning = false;
        displayGameOverPopup();
    }

    function resetGame() {
        bird.y = canvas.height / 2 - 15;
        bird.velocity = 0;
        pipes.length = 0;
        score = 0;
        pipeSpeed = 2;
    }

    function startGame() {
        gameRunning = true;
        requestAnimationFrame(gameLoop);
    }

    function increaseSpeed() {
        pipeSpeed += 0.05;
    }

    function gameLoop() {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        drawBird();
        drawScore();

        for (const pipe of pipes) {
            drawPipe(pipe.x, pipe.height);
        }

        update();

        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }

    function displayGameOverPopup() {
        scoreDisplay.textContent = "Your Score: " + score;
        gameOverPopup.style.display = "block";
    }

    function hideGameOverPopup() {
        gameOverPopup.style.display = "none";
    }

    function restartGame() {
        hideGameOverPopup();
        resetGame();
        startGame();
    }

    document.addEventListener("click", function () {
        if (!gameRunning) {
            restartGame();
        } else {
            bird.velocity = bird.jump;
        }
    });

    restartButton.addEventListener("click", restartGame);

    function onWindowResize() {
        // Adjust canvas dimensions when the window is resized
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", onWindowResize);

    // Initial canvas dimensions setup
    onWindowResize();
});
