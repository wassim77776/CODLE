# CODLE

A Wordle-style guessing game focused on **computer science
terminology**. Test your knowledge of programming, hardware, software,
networking, and other computing concepts by guessing the hidden word.

## How to Play

1.  Clone or download the project.
2.  Open the project folder.
3.  Start the game by opening `index.html` in your browser, or run the
    local server described below.
4.  Enter a valid computer-science word using the on-screen keyboard or
    your physical keyboard.
5.  Submit your guess and use the tile colors to work out which letters
    belong in the hidden word.
6.  Keep guessing until you find the answer or run out of attempts.

Each puzzle uses a word with a fixed length. Guesses must be accepted
words from the game's word list.

## Features

-   **Random words:** A new computer-science term is selected for each
    game.
-   **Wordle-style feedback:** Letter colors help you narrow down the
    answer.
-   **Hints:** Use the hint button when you need a clue. Hints give a
    broad description of the term rather than revealing the answer.
-   **Computer-science definitions:** Look up the answer's meaning with
    a Google search focused on its computer-science definition.
-   **Game statistics:** View your games played, win rate, and guess
    distribution.
-   **Responsive layout:** The board and keyboard are designed to fit
    comfortably on the screen.

## Clone the Project

Open a terminal and run:

``` bash
git clone <your-repository-url>
cd <project-folder>
```

Replace `<your-repository-url>` with the Git repository URL and
`<project-folder>` with the folder created by cloning.

## Set Up the Conda Environment

CODLE is a front-end project and does not require Python packages to
run. If you want to use Conda to manage a local environment and run a
simple development server, create and activate an environment with
Python:

``` bash
conda create --name codle python=3.11
conda activate codle
```

To start a local server from the project folder:

``` bash
python -m http.server 8000
```

Then open this address in your browser:

``` text
http://localhost:8000
```

Stop the server with `Ctrl+C` when you are finished.

## Project Files

  -----------------------------------------------------------------------
  File                                Purpose
  ----------------------------------- -----------------------------------
  `index.html`                        Game page and layout

  `style.css`                         Colors, styling, and responsive
                                      layout

  `script.js`                         Game logic, word list, hints,
                                      keyboard input, and statistics
  -----------------------------------------------------------------------

## Built With

-   HTML
-   CSS
-   JavaScript

## Notes

CODLE is a browser-based project made for learning and practicing
computer-science vocabulary. The word list and game behavior are managed
in JavaScript.
