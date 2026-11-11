
// ==========================================
// GAME SETTINGS
// ==========================================

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// ==========================================
// POSSIBLE ANSWERS
// ==========================================

const answerWords = [
    "STACK", "ARRAY", "CLASS", "LOGIC", "DEBUG",
    "CACHE", "QUEUE", "INPUT", "PRINT", "FLOAT",
    "WHILE", "TRACE", "CRASH", "ERROR", "PIXEL",
    "TOKEN", "CODES", "LINUX", "QUERY", "ALIAS",
    "SHELL", "TYPES", "PORTS", "FILES", "ROUTE",
    "MOUSE", "ROBOT", "PROXY", "BYTES", "GRAPH",
    "LOOPS", "BASIC", "BINARY", "CHIPS", "DRIVE",
    "FLASH", "LOGIN", "MACRO", "PATCH", "RADAR",
    "SCOPE", "SHIFT", "SPACE", "TABLE", "VIRUS"
].filter(word => word.length === WORD_LENGTH);

// ==========================================
// BROAD WORD HINTS
// ==========================================

const wordHints = {
    STACK: "A concept used in programming.",
    ARRAY: "A way of organizing information.",
    CLASS: "An important concept in software development.",
    LOGIC: "Something fundamental to computer science.",
    DEBUG: "A common part of creating software.",
    CACHE: "Related to computer performance.",
    QUEUE: "A way of managing items in order.",
    INPUT: "One way information enters a program.",
    PRINT: "A common operation in programming.",
    FLOAT: "A type of data used in programming.",
    WHILE: "Related to repeating instructions.",
    TRACE: "A technique used when examining a program.",
    CRASH: "Something that can happen when software fails.",
    ERROR: "Something developers often need to deal with.",
    PIXEL: "A basic element of digital images.",
    TOKEN: "A small unit used in computing.",
    CODES: "The instructions behind software.",
    LINUX: "Part of the world of computer systems.",
    QUERY: "Related to requesting information.",
    ALIAS: "An alternative name used in computing.",
    SHELL: "A way to interact with a computer system.",
    TYPES: "A fundamental programming concept.",
    PORTS: "Related to computer communication.",
    FILES: "A basic way of storing information.",
    ROUTE: "Related to how information travels.",
    MOUSE: "A common computer accessory.",
    ROBOT: "A machine that can perform tasks.",
    PROXY: "Something used in network communication.",
    BYTES: "A unit used to measure digital information.",
    GRAPH: "A way of representing connections.",
    LOOPS: "A programming concept involving repetition.",
    BASIC: "Related to programming languages.",
    CHIPS: "Small components found in electronic devices.",
    DRIVE: "A component used for digital storage.",
    FLASH: "A technology used in digital devices.",
    LOGIN: "A common step when accessing an account.",
    MACRO: "A way to automate repeated actions.",
    PATCH: "Something used to update or fix software.",
    RADAR: "A technology used to detect objects or movement.",
    SCOPE: "A concept related to where things can be accessed.",
    SHIFT: "A common operation in computing.",
    SPACE: "A concept related to memory and storage.",
    TABLE: "A way to organize structured information.",
    VIRUS: "A type of unwanted software."
};

// ==========================================
// HTML ELEMENTS
// ==========================================

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const popup = document.getElementById("stats-popup");

const wordHint = document.getElementById("word-hint");
const hintBox = document.getElementById("hint-box");
const hintButton = document.getElementById("hint-button");

// ==========================================
// GAME VARIABLES
// ==========================================

let answer = "";
let remainingAnswers = [];

let currentRow = 0;
let currentGuess = "";
let gameOver = false;

// ==========================================
// RANDOM WORD SYSTEM
// ==========================================

function shuffleAnswers() {
    remainingAnswers = [...answerWords];

    for (let i = remainingAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [remainingAnswers[i], remainingAnswers[j]] =
            [remainingAnswers[j], remainingAnswers[i]];
    }

    // Avoid repeating the previous answer immediately
    if (
        remainingAnswers.length > 1 &&
        remainingAnswers[remainingAnswers.length - 1] === answer
    ) {
        [remainingAnswers[0], remainingAnswers[remainingAnswers.length - 1]] =
            [remainingAnswers[remainingAnswers.length - 1], remainingAnswers[0]];
    }
}

function chooseAnswer() {
    if (remainingAnswers.length === 0) {
        shuffleAnswers();
    }

    answer = remainingAnswers.pop();

    validWords.add(answer);

    // Prepare the hint, but keep it hidden
    wordHint.textContent =
        wordHints[answer] || "A computer-science-related term.";

    hintBox.classList.add("hidden");
    hintButton.disabled = false;
    hintButton.textContent = "Show Hint";

    console.log("Today's word:", answer);
}

// ==========================================
// DICTIONARY
// ==========================================

let validWords = new Set();

async function loadDictionary() {
    try {
        message.textContent = "Loading dictionary...";

        const response = await fetch(
            "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words"
        );

        if (!response.ok) {
            throw new Error("Dictionary failed to load");
        }

        const dictionaryText = await response.text();

        validWords = new Set(
            dictionaryText
                .split(/\r?\n/)
                .map(word => word.trim().toUpperCase())
                .filter(word => /^[A-Z]{5}$/.test(word))
        );

        // Make sure every possible answer is accepted
        answerWords.forEach(word => validWords.add(word));

        console.log("Dictionary loaded:", validWords.size, "words");

    } catch (error) {
        console.error("Dictionary error:", error);
        message.textContent = "Dictionary failed to load. Check internet.";
        throw error;
    }
}

// ==========================================
// STATISTICS
// ==========================================

const defaultStats = {
    played: 0,
    wins: 0,
    currentStreak: 0,
    bestStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
};

function loadStats() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("techWordleStats")
        );

        if (
            saved &&
            typeof saved.played === "number" &&
            typeof saved.wins === "number" &&
            Array.isArray(saved.distribution)
        ) {
            return {
                ...defaultStats,
                ...saved,
                distribution: Array.from(
                    { length: MAX_ATTEMPTS },
                    (_, i) => Number(saved.distribution[i]) || 0
                )
            };
        }

    } catch (error) {
        console.error("Could not load stats:", error);
    }

    return {
        ...defaultStats,
        distribution: [...defaultStats.distribution]
    };
}

let stats = loadStats();

function saveStats() {
    try {
        localStorage.setItem(
            "techWordleStats",
            JSON.stringify(stats)
        );
    } catch (error) {
        console.error("Could not save stats:", error);
    }
}

// ==========================================
// CREATE BOARD
// ==========================================

function createBoard() {
    board.innerHTML = "";

    for (let i = 0; i < MAX_ATTEMPTS * WORD_LENGTH; i++) {
        const tile = document.createElement("div");

        tile.classList.add("tile");
        board.appendChild(tile);
    }
}

// ==========================================
// CREATE KEYBOARD
// ==========================================

function createKeyboard() {
    keyboard.innerHTML = "";

    const rows = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];

    rows.forEach((row, index) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");

        if (index === 2) {
            const enter = document.createElement("button");

            enter.textContent = "ENTER";
            enter.classList.add("key", "special-key");
            enter.addEventListener("click", submitGuess);

            rowDiv.appendChild(enter);
        }

        for (const letter of row) {
            const button = document.createElement("button");

            button.textContent = letter;
            button.classList.add("key");
            button.dataset.key = letter;

            button.addEventListener("click", () => {
                addLetter(letter);
            });

            rowDiv.appendChild(button);
        }

        if (index === 2) {
            const backspace = document.createElement("button");

            backspace.textContent = "⌫";
            backspace.classList.add("key", "special-key");
            backspace.addEventListener("click", removeLetter);

            rowDiv.appendChild(backspace);
        }

        keyboard.appendChild(rowDiv);
    });
}

// ==========================================
// ADD LETTER
// ==========================================

function addLetter(letter) {
    if (gameOver || currentGuess.length >= WORD_LENGTH) return;

    currentGuess += letter;
    updateCurrentRow();
}

// ==========================================
// REMOVE LETTER
// ==========================================

function removeLetter() {
    if (gameOver) return;

    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
}

// ==========================================
// UPDATE CURRENT ROW
// ==========================================

function updateCurrentRow() {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = board.children[
            currentRow * WORD_LENGTH + i
        ];

        tile.textContent = currentGuess[i] || "";
    }
}

// ==========================================
// CHECK GUESS
// ==========================================

function checkGuess() {
    const result = Array(WORD_LENGTH).fill("absent");
    const remaining = {};

    for (const letter of answer) {
        remaining[letter] = (remaining[letter] || 0) + 1;
    }

    // Correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (currentGuess[i] === answer[i]) {
            result[i] = "correct";
            remaining[currentGuess[i]]--;
        }
    }

    // Wrong positions
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = currentGuess[i];

        if (result[i] === "correct") continue;

        if (remaining[letter] > 0) {
            result[i] = "present";
            remaining[letter]--;
        }
    }

    // Color tiles
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = board.children[
            currentRow * WORD_LENGTH + i
        ];

        tile.classList.add(result[i]);
    }

    updateKeyboardColors(result);
}

// ==========================================
// UPDATE KEYBOARD COLORS
// ==========================================

function updateKeyboardColors(result) {
    const priority = {
        absent: 1,
        present: 2,
        correct: 3
    };

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = currentGuess[i];

        const button = keyboard.querySelector(
            `[data-key="${letter}"]`
        );

        if (!button) continue;

        const oldStatus = ["correct", "present", "absent"]
            .find(status => button.classList.contains(status));

        if (
            !oldStatus ||
            priority[result[i]] > priority[oldStatus]
        ) {
            button.classList.remove(
                "correct",
                "present",
                "absent"
            );

            button.classList.add(result[i]);
        }
    }
}

// ==========================================
// SUBMIT GUESS
// ==========================================

function submitGuess() {
    if (gameOver) return;

    if (currentGuess.length !== WORD_LENGTH) {
        message.textContent = "Enter 5 letters!";
        return;
    }

    if (!validWords.has(currentGuess)) {
        message.textContent = "Not in word list";
        return;
    }

    message.textContent = "";

    checkGuess();

    if (currentGuess === answer) {
        finishGame(true);
        return;
    }

    currentRow++;
    currentGuess = "";

    if (currentRow === MAX_ATTEMPTS) {
        finishGame(false);
    }
}

// ==========================================
// FINISH GAME
// ==========================================

function finishGame(won) {
    if (gameOver) return;

    gameOver = true;
    stats.played++;

    if (won) {
        stats.wins++;
        stats.currentStreak++;

        stats.bestStreak = Math.max(
            stats.bestStreak,
            stats.currentStreak
        );

        stats.distribution[currentRow]++;
    } else {
        stats.currentStreak = 0;
    }

    saveStats();

    document.getElementById("answer-text").textContent =
        won
            ? "Congratulations! You guessed the word!"
            : "The answer was: " + answer;

    // Search for the word specifically in computer science
    document.getElementById("definition-link").href =
        "https://www.google.com/search?q=" +
        encodeURIComponent(
            answer + " definition in computer science"
        );

    showStats();
    popup.classList.remove("hidden");
}

// ==========================================
// DISPLAY STATISTICS
// ==========================================

function showStats() {
    document.getElementById("played").textContent =
        stats.played;

    const winRate = stats.played === 0
        ? 0
        : Math.round((stats.wins / stats.played) * 100);

    document.getElementById("win-rate").textContent =
        winRate + "%";

    document.getElementById("current-streak").textContent =
        stats.currentStreak;

    document.getElementById("best-streak").textContent =
        stats.bestStreak;

    const distribution =
        document.getElementById("guess-distribution");

    distribution.innerHTML = "";

    const maxCount = Math.max(1, ...stats.distribution);

    stats.distribution.forEach((count, index) => {
        const row = document.createElement("div");
        row.classList.add("distribution-row");

        const number = document.createElement("span");
        number.textContent = index + 1;

        const bar = document.createElement("div");
        bar.classList.add("distribution-bar");

        bar.style.width =
            Math.max(25, (count / maxCount) * 100) + "%";

        bar.textContent = count;

        row.append(number, bar);
        distribution.appendChild(row);
    });
}

// ==========================================
// RESTART GAME
// ==========================================

function restartGame() {
    chooseAnswer();

    currentRow = 0;
    currentGuess = "";
    gameOver = false;

    message.textContent = "";
    popup.classList.add("hidden");

    createBoard();
    createKeyboard();
}

// ==========================================
// PHYSICAL KEYBOARD
// ==========================================

document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitGuess();

    } else if (event.key === "Backspace") {
        event.preventDefault();
        removeLetter();

    } else if (/^[a-zA-Z]$/.test(event.key)) {
        addLetter(event.key.toUpperCase());
    }
});

// ==========================================
// BUTTON EVENTS
// ==========================================

document.getElementById("restart")
    .addEventListener("click", restartGame);

document.getElementById("play-again")
    .addEventListener("click", restartGame);

// HINT BUTTON
hintButton.addEventListener("click", () => {
    if (gameOver || hintButton.disabled) return;

    hintBox.classList.remove("hidden");

    hintButton.disabled = true;
    hintButton.textContent = "Hint Used";
});

// ==========================================
// START GAME
// ==========================================

async function startGame() {
    createBoard();
    createKeyboard();

    try {
        await loadDictionary();
        restartGame();

    } catch (error) {
        message.textContent =
            "Dictionary unavailable. Refresh to retry.";
    }
}

startGame();
