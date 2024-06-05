const statusDisplay = document.querySelector('.game--status');
const cells = document.querySelectorAll('.cell');
const restartButton = document.querySelector('.game--restart');
const onePlayerButton = document.getElementById('onePlayerButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const gameContainer = document.querySelector('.game--container');
const menu = document.getElementById('menu');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let isOnePlayer = false;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

onePlayerButton.addEventListener('click', () => startGame(true));
twoPlayerButton.addEventListener('click', () => startGame(false));
restartButton.addEventListener('click', handleRestartGame);

function startGame(onePlayer) {
    isOnePlayer = onePlayer;
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = "");
    menu.style.display = 'none';
    gameContainer.style.display = 'grid';
    restartButton.style.display = 'inline-block';
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '')
            continue;
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if (isOnePlayer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function computerMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === "") availableCells.push(index);
    });
    const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const randomCell = cells[randomCellIndex];

    handleCellPlayed(randomCell, randomCellIndex);
    handleResultValidation();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
