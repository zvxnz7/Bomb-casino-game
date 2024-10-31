const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('[data-cell]');
const betButton = document.getElementById('betButton');

let money = 1000;
let multiplier = 1;
let array = [];
let mines = 5;
let time = 0;
let betAmount = 0;
let gameStarted = false;

function generateArray() {
    array = Array(20).fill(0).concat(Array(5).fill(1));
    time = 0;
    multiplier = 1; // Reset multiplier at the start of each game
    gameStarted = true;

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    cells.forEach((cell) => {
        cell.classList.remove('win', 'red', 'blue', 'gameover');
        cell.textContent = '';
        cell.style.backgroundColor = '';
        cell.style.backgroundImage = '';

        // Add this line to ensure each cell listens for a click event
        cell.addEventListener("click", handleClick);
    });
    updateMltplierDisplay();
}

function updateMoneyDisplay() {
    document.getElementById("moneyAmount").innerText = money;
}

function updateMltplierDisplay() {
    document.getElementById("multiplier").innerText = multiplier;
}

updateMoneyDisplay();

betButton.addEventListener("click", function () {
    if (!gameStarted) {
        betAmount = parseInt(document.getElementById("betAmount").value);

        if (!isNaN(betAmount) && betAmount > 0 && betAmount <= money) {
            money -= betAmount;
            updateMoneyDisplay();
            generateArray();
            betButton.textContent = 'Payout';
        } else {
            alert("Invalid bet amount or insufficient funds.");
        }
    } else {
        revealBombs();
        const payout = betAmount * multiplier;
        money += payout;
        updateMoneyDisplay();
        gameStarted = false;
        betButton.textContent = 'Place bets';
    }
});

function revealBombs(){
    cells.forEach((cell, index) => {
        if (array[index] == 1) {
            cell.style.backgroundImage = "url('bomb.png')";
            cell.classList.add('red');
        } else {
            cell.style.backgroundImage = "url('gem.png')";
            cell.classList.add('blue');
        }
    });
}

function handleClick(e) {
    if (!gameStarted) return;

    const cell = e.target;
    // Prevent clicking on already-clicked cells
    if (cell.classList.contains('win') || cell.classList.contains('red') || cell.classList.contains('blue')) {
        return;
    }
    const cellIndex = Array.from(cells).indexOf(cell);

    if (array[cellIndex] == 1) { // Bomb cell
        betButton.textContent = 'Place bets';
        cells.forEach((cell, index) => {
            if (array[index] == 1) {
                cell.style.backgroundImage = "url('bomb.png')";
                cell.classList.add('red');
            } else {
                cell.style.backgroundImage = "url('gem.png')";
                cell.classList.add('blue');
            }
        });
        gameStarted = false;
    } else { // Safe cell
        cell.style.backgroundImage = "url('gem.png')";
        cell.classList.add('win');
        time++;
        multiplier = calculateMultiplier(time);
        updateMltplierDisplay();
    }
}

function calculateMultiplier(time) {
    if (time === 0) return 0;
    return (0.83 * Math.pow(1.32, time)).toFixed(2);
}