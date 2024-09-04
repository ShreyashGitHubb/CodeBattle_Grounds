document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    const difficultySelect = document.getElementById('difficulty');
    const modeSelect = document.getElementById('mode');

    let currentPlayer = 'X'; // Player 'X' starts
    let gameActive = true;
    let difficulty = 'easy'; // Default difficulty
    let gameMode = 'ai'; // Default game mode (Player vs AI)

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const handleClick = (event) => {
        if (!gameActive) return;

        const cell = event.target;
        if (cell.textContent || (gameMode === 'ai' && currentPlayer === 'O')) return;

        cell.textContent = currentPlayer;

        if (checkWin()) {
            endGame(`${currentPlayer} Wins!`);
            highlightWinningCells();
        } else if (checkDraw()) {
            endGame('Draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (gameMode === 'ai' && currentPlayer === 'O') aiMove();
        }
    };

    const aiMove = () => {
        if (!gameActive) return;

        const availableCells = [...cells].filter(cell => !cell.textContent);
        let selectedCell;

        switch (difficulty) {
            case 'easy':
                selectedCell = getRandomMove(availableCells);
                break;
            case 'medium':
                selectedCell = getBestMoveMedium();
                break;
            case 'high':
                selectedCell = getBestMoveHigh();
                break;
            case 'extreme':
                selectedCell = getBestMoveExtreme();
                break;
        }

        selectedCell.classList.add('animate');
        setTimeout(() => {
            selectedCell.textContent = 'O';
            selectedCell.classList.remove('animate');
            if (checkWin()) {
                endGame('O Wins!');
                highlightWinningCells();
            } else if (checkDraw()) {
                endGame('Draw!');
            } else {
                currentPlayer = 'X';
            }
        }, 300);
    };

    const checkWin = () => winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent;
    });

    const checkDraw = () => [...cells].every(cell => cell.textContent);

    const endGame = (result) => {
        message.textContent = result;
        gameActive = false;
    };

    const getRandomMove = (availableCells) => availableCells[Math.floor(Math.random() * availableCells.length)];

    const getBestMoveMedium = () => {
        const winningMove = findWinningMove('O');
        return winningMove !== null ? cells[winningMove] : (findWinningMove('X') || getRandomMove([...cells].filter(cell => !cell.textContent)));
    };

    const getBestMoveHigh = () => {
        const winningMove = findWinningMove('O');
        if (winningMove !== null) return cells[winningMove];
        const blockingMove = findWinningMove('X');
        return blockingMove !== null ? cells[blockingMove] : getRandomMove([...cells].filter(cell => !cell.textContent));
    };

    const getBestMoveExtreme = () => {
        // Future: Implement Minimax algorithm for perfect play.
        return getBestMoveHigh(); // Placeholder for now
    };

    const findWinningMove = (player) => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            const values = [cells[a].textContent, cells[b].textContent, cells[c].textContent];
            if (values.filter(val => val === player).length === 2 && values.includes('')) {
                return combination[values.indexOf('')];
            }
        }
        return null;
    };

    const highlightWinningCells = () => {
        winningCombinations.forEach(combination => {
            const [a, b, c] = combination;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                cells[a].classList.add('winning');
                cells[b].classList.add('winning');
                cells[c].classList.add('winning');
            }
        });
    };

    const restartGame = () => {
        currentPlayer = 'X';
        gameActive = true;
        message.textContent = '';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winning');
        });
    };

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    restartButton.addEventListener('click', restartGame);

    difficultySelect.addEventListener('change', (event) => {
        difficulty = event.target.value;
        restartGame();
    });

    modeSelect.addEventListener('change', (event) => {
        gameMode = event.target.value;
        restartGame();
    });
});