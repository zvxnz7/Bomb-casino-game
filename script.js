const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('[data-cell]');
const betButton = document.getElementById('betButton');

let money = 1000;
let array = []; // Declare array globally
let mines = 5;
let time = 0;
let betAmount = 0;
let gameStarted = false;

function generateArray() {
    array = Array(20).fill(0).concat(Array(5).fill(1)); // Assign array globally
    time = 0;
    gameStarted = true;

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    cells.forEach((cell, index) => {
        cell.classList.remove('win', 'red', 'blue', 'gameover'); // Reset any previous game styling
        cell.textContent = '';
        cell.style.backgroundColor = '';
        cell.style.backgroundImage = ''; // Reset background images
    });
}

function updateMoneyDisplay() {
    document.getElementById("moneyAmount").innerText = money;
}

updateMoneyDisplay();

betButton.addEventListener("click", function () {
    if (!gameStarted) {
        betAmount = parseInt(document.getElementById("betAmount").value);

        if (!isNaN(betAmount) && betAmount > 0 && betAmount <= money) {
            money -= betAmount;  
            updateMoneyDisplay(); 
            console.log("Array generated with bet amount:", betAmount);
            generateArray();
        } else {
            alert("Invalid bet amount or insufficient funds.");
        }
    } else {
        // If the game is already started, pay out winnings
        const payout = betAmount * calculateMultiplier(mines, time);
        money += payout;
        updateMoneyDisplay();
        gameStarted = false;  // Reset game state
    }
});

function handleClick(e) {
    if (!gameStarted) return; // Ignore clicks if game hasn't started

    calculateMultiplier(mines, time);
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (array[cellIndex] == 1) { // Bomb cell
        cells.forEach((cell, index) => {
            if (array[index] == 1) {
                cell.style.backgroundImage = "url('bomb.png')";
                cell.classList.add('red');
            } else {
                cell.style.backgroundImage = "url('gem.png')";
                cell.classList.add('blue');
            }
        });
        gameStarted = false;  // End game if a mine is clicked
    } else { // Safe cell
        cell.style.backgroundImage = "url('gem.png')";
        cell.classList.add('win');
        time++;  // Increment time (or turns taken) if a safe cell is clicked
    }
}

function calculateMultiplier(mines, time) {
    return (0.83 * Math.pow(1.32, time)).toFixed(2);  // Adjust multiplier based on time (successful steps)
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
