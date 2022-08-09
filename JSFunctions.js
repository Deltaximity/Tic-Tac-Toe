"use strict";

/**
 * Globalt objekt som innehåller de attribut som ni skall använda.
 * Initieras genom anrop till funktionern initGlobalObject().
 */
let oGameData = {};

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
oGameData.initGlobalObject = function() {

    //Datastruktur för vilka platser som är lediga respektive har brickor
    oGameData.gameField = Array('', '', '', '', '', '', '', '', '');
    
    /* Testdata för att testa rättningslösning */
    // oGameData.gameField = Array('X', 'X', 'X', '', '', '', '', '', '');
    // oGameData.gameField = Array('X', '', '', 'X', '', '', 'X', '', '');
    // oGameData.gameField = Array('X', '', '', '', 'X', '', '', '', 'X');
    // oGameData.gameField = Array('', '', 'X', '', 'X', '', 'X', '', '');
    // oGameData.gameField = Array('X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O');

    //Indikerar tecknet som skall användas för spelare ett.
    oGameData.playerOne = "X";

    //Indikerar tecknet som skall användas för spelare två.
    oGameData.playerTwo = "O";

    //Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
    oGameData.currentPlayer = "";

    //Nickname för spelare ett som tilldelas från ett formulärelement,
    oGameData.nickNamePlayerOne = "";

    //Nickname för spelare två som tilldelas från ett formulärelement.
    oGameData.nickNamePlayerTwo = "";

    //Färg för spelare ett som tilldelas från ett formulärelement.
    oGameData.colorPlayerOne = "";

    //Färg för spelare två som tilldelas från ett formulärelement.
    oGameData.colorPlayerTwo = "";

    //"Flagga" som indikerar om användaren klickat för checkboken.
    oGameData.timerEnabled = false;

    //Timerid om användaren har klickat för checkboxen. 
    oGameData.timerId = null;

}

// en lyssnare som lyssnar på när sidan laddas och kör koden inuti
// "() =>" är en anonym/local function, samma som att skriva function() {...}
window.addEventListener('load', () => {
    // här kör vi funktionen initGlobalObject()
    oGameData.initGlobalObject();

    // hämta spelplanen och knappen starta spelet och deklarera de som variabler
    let gameArea = document.querySelector('#gameArea');
    let startGame = document.querySelector('#newGame');

    // lägg klassen "d-none" till spelplanen så att den blir gömd
    gameArea.classList.add("d-none");

    // nedanstående kod skapar en checkbox i formuläret
    // hämtar containern i form
    let formContainer = document.querySelector('#divInForm');

    // skapar alla element för checkbox och text
    let div = document.createElement('div');
    let checkbox = document.createElement('input');
    let label = document.createElement('label');
    let text = document.createTextNode("Vill du begränsa tiden till 5 sekunder per drag?");
    let startBtn = document.querySelector('#divWithA');

    // lägger till några viktiga attribut
    div.classList.add('m-3'); // bootstrap klass för att göra det lite snyggare (ej nödvändigt)
    checkbox.type = 'checkbox';
    checkbox.id = 'timerCheckbox';
    label.setAttribute('for', checkbox.id);

    // skapar en struktur genom att tilldela rätt barn till respektive förälder
    formContainer.insertBefore(div, startBtn);
    div.appendChild(checkbox);
    div.appendChild(label);
    label.appendChild(text);

    // lägg till en lyssnare på knappen starta spel
    // lyssnar på ett klick och kör funktionen validateForm()
    startGame.addEventListener('click', validateForm);
});

function validateForm() {
    // vi kör try och catch för att hantera undantag, ifall något går fel
    try {
        // hämta och deklarera variablerna till input fälten (inkl. färgfälten)
        let nick1 = document.querySelector('#nick1');
        let nick2 = document.querySelector('#nick2');
        let color1 = document.querySelector('#color1');
        let color2 = document.querySelector('#color2');
        let checkbox = document.querySelector('#timerCheckbox');

        // vi kör olika kontroller
        if (nick1.value.length < 5 || nick2.value.length < 5) { // om namn är under 5 tecken
            throw "Namn måste vara minst 5 tecken"; // throwar vi ett error meddelande (en sträng)
        } else if (nick1.value === nick2.value) { // om namn1 och namn2 är lika
            throw "Namn får inte vara lika";
            // här nedan kontrollerar vi om färg1 och färg2 är svart (#000000) eller vit (#ffffff)
        } else if (color1.value === "#ffffff" || color2.value === "#ffffff" || color1.value === "#000000" || color2.value === "#000000") {
            throw "Färgen får inte vara svart eller vit";
        } else if (color1.value === color2.value) { // om färgerna är lika
            throw "Färgen får inte vara samma";
        }

        // kontrollerar ifall timern är ibockad, ändrar timerEnabled beroende på det true eller false
        checkbox.checked ? oGameData.timerEnabled = true : oGameData.timerEnabled = false;

        // om allt går igenom så uppropar vi funktionen initaiteGame()
        initiateGame();

    } catch (error) { // här tar vi emot error meddelandet
        document.querySelector('#errorMsg').textContent = error; // vi skriver ut det i ett HTML element med id:et #errorMsg
    }
}

// nedanstående variabler kommer att användas i flera funktioner

// variabel som kommer användas för att ändra titeln "TicTacToe"
let title = document.querySelector('.jumbotron h1');

// skapar variablerna för att hålla viktiga värden
let playerChar, playerName;

// gömmer bort formuläret
let form = document.querySelector('form');


function initiateGame() {
    form.classList.add("d-none");

    // tar bort klassen "d-none" från #gameArea, då visas spel planen
    gameArea.classList.remove("d-none");
    
    // tömmer p-elementet under titeln
    document.querySelector('#errorMsg').textContent = "";
    
    // här lägger vi till de angivna värderna på respektive attribut i objektet oGameData
    oGameData.nickNamePlayerOne = nick1.value;
    oGameData.nickNamePlayerTwo = nick2.value;
    oGameData.colorPlayerOne = color1.value;
    oGameData.colorPlayerTwo = color2.value;

    // hämtar alla td-element med querySelectorAll() (returnerar en array)
    let rutor = gameArea.querySelectorAll('td');

    // vi loopar igenom vektorn och tar bort text och bakgrundsfärg från varje td
    for (let i = 0; i < rutor.length; i++) {
        rutor[i].textContent = "";
        rutor[i].style.backgroundColor = "";
    }

    // tömmer gameField vektorn
    for (let i = 0; i < oGameData.gameField.length; i++) {
        oGameData.gameField[i] = "";
    }

    // generar ett slumptal mellan 0 och 1
    let slump = Math.random(0, 1);

    // kontrollbesked för vilken spelare som ska köra först
    if (slump < 0.5) { // om slumptalet är mindre än 0.5
        playerChar = oGameData.playerOne; // sätt spelartecknet från objektet till playerChar
        playerName = oGameData.nickNamePlayerOne; // sätt spelarnamnet från objektet till playerName 
        oGameData.currentPlayer = oGameData.playerOne; // sätt attributet currentPlayer till playerOne (kommer användas senare för spelmotorn)
    } else if (slump > 0.5) { // annars om slumptalet är större än 0.5 så gör vi samma sak fast för den andra spelaren
        playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
        oGameData.currentPlayer = oGameData.playerTwo;
    }

    // hämta h1 och sätt textContent till följande sträng
    // tycker att det är smidigare att skriva strängar och variabler med `text ${variabel} text`
    title.textContent = `Aktuell spelare är: ${playerName} (${playerChar})`;

    // vi lägger en lyssnare på spelplanen
    gameArea.addEventListener('click', executeMove);

    // om timerEnabled är true, kör startTimer() funktionen
    if (oGameData.timerEnabled) startTimer();
}

function executeMove(e) {    
    // om det tryckta elementet matchar 'td'
    if (e.target.matches('td')) {
        // om textContent innehåller text, returnerar den true, vi vänder på den
        // då om det finns textinnehåll så returneras false och då går den inte igenom kontrollen
        if (!e.target.textContent) {
            let dataId = e.target.getAttribute('data-id');

            oGameData.gameField[dataId] = oGameData.currentPlayer;
            e.target.textContent = oGameData.currentPlayer;

            // byter färg på spelare (förenklat)
            oGameData.currentPlayer === oGameData.playerOne ? e.target.style.backgroundColor = oGameData.colorPlayerOne : e.target.style.backgroundColor = oGameData.colorPlayerTwo;

            changePlayer();
        }

        oGameData.checkForGameOver();
        // om funktionen returnerar antigen 1,2 eller 3
        if (oGameData.checkForGameOver() === 1 || oGameData.checkForGameOver() === 2 || oGameData.checkForGameOver() === 3) {
            // avslutar timer
            clearInterval(oGameData.timerId);

            // ta bort lyssnaren
            gameArea.removeEventListener('click', executeMove);

            // ta bort klassen d-none från formuläret så den syns
            form.classList.remove('d-none');

            // lägg på klassen d-none så att spelplanen försvinner
            gameArea.classList.add('d-none');
            
            // om checkForGameOver() returnerar motsvarande siffra, gör följande
            if (oGameData.checkForGameOver() === 1) {
                title.textContent = `Vinnare är ${oGameData.nickNamePlayerOne} (X)! Spela igen?`;
            } else if (oGameData.checkForGameOver() === 2) {
                title.textContent = `Vinnare är ${oGameData.nickNamePlayerTwo} (O)! Spela igen?`;
            } else if (oGameData.checkForGameOver() === 3) {
                title.textContent = "Det blev oavgjort";
            }

            // initierar initGlobalObject()
            oGameData.initGlobalObject();
        }
    }
}

// funktion för att starta timer
function startTimer() {
    oGameData.timerId = setInterval(() => {
        changePlayer();
    }, 5000);
}

// funktion för att byta spelare
function changePlayer() {
    if (oGameData.currentPlayer === oGameData.playerOne) {
        oGameData.currentPlayer = oGameData.playerTwo // byter spelare

        // egna variabler
        playerName = oGameData.nickNamePlayerTwo; // byter spelare namn
        playerChar = oGameData.playerTwo; // byter spelare tecken
    } else {
        oGameData.currentPlayer = oGameData.playerOne;

        playerName = oGameData.nickNamePlayerOne;
        playerChar = oGameData.playerOne;
    }

    // skriv ut den nuvarande spelaren som titel
    title.textContent = `Aktuell spelare är: ${playerName} (${playerChar})`;

    // ställer om timer så att den börjar på 0 sekunder
    // men först kontrollerar vi ifall timern är på
    if (oGameData.timerEnabled) {
        clearInterval(oGameData.timerId);
        startTimer();
    }
}

/**
 * Kontrollerar för tre i rad.
 * Returnerar 0 om det inte är någon vinnare, 
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */
oGameData.checkForGameOver = function() {
    
    // kontrollera om en av följande funktionerna returnerar 1
    if (checkHorizontal() === 1 || checkVertical() === 1 || checkDiagonalLeftToRight() === 1 || checkDiagonalRightToLeft() === 1) {
        return 1 // vi returnerar 1 om ovan stämmer, då vet vi att X har vunnit

        // annars kontrollerar vi om någon av funktionerna returnerar 2 
    } else if (checkHorizontal() === 2 || checkVertical() === 2 || checkDiagonalLeftToRight() === 2 || checkDiagonalRightToLeft() === 2) {
        return 2 // då returnerar vi 2 för O vinner

    } else if (checkForDraw() === 3) { // vi kör checkForDraw() som returnerar 3 eller inget
        return 3 // om den ovan returnerar 3, då är den true, och då kan vi returnera 3
    } else {
        return 0 //annars returnerar vi 0, eftersom ingen har vunnit
    }
}

function checkHorizontal() {
    // Denna loop har egentligen 3 iterationer, men för att stämma överens med
    // vår vektor gameField så ökar vi med tre vid varje iteration upp till 9

    for (let i = 0; i < 9; i+=3) {
        // vid varje iteration kollar vi om rutan nr i och de två rutorna precis efter stämmer med X eller O

        if (oGameData.gameField[i] === "X" && oGameData.gameField[i+1] === "X" && oGameData.gameField[i+2] === "X") {
            return 1; // om ovan stämmer så returnerar vi 1

        } else if (oGameData.gameField[i] === "O" && oGameData.gameField[i+1] === "O" && oGameData.gameField[i+2] === "O") {
            return 2; // om ovan stämmer returnerar vi 2

        }
    }
}

function checkVertical() {
    // Denna loop kör igenom hela vektorn men med ett undantag (se if-satsen)

    for (let i = 0; i < 9; i++) {
        // Vid varje iteration kollar vi här om rutan nr i och rutorna som ligger 3 rutor ifrån 
        // varandra respiktivt i om de stämmer med X eller O

        if (oGameData.gameField[i] === "X" && oGameData.gameField[i+3] === "X" && oGameData.gameField[i+6] === "X") {
            return 1; // samma sak som funktionen ovan. returnerar 1 om X vinner

        } else if (oGameData.gameField[i] === "O" && oGameData.gameField[i+3] === "O" && oGameData.gameField[i+6] === "O") {
            return 2; // returnerar 2 om O vinner
        }
    }
}

function checkDiagonalLeftToRight() {
    // Här behöver vi ingen loop eftersom det finns bara ett mönster som kan uppstå
    // Vi kollar om X eller O ligger på dessa platser i vektorn
    if (oGameData.gameField[0] === "X" && oGameData.gameField[4] === "X" && oGameData.gameField[8] === "X") {
        return 1;
    } else if (oGameData.gameField[0] === "O" && oGameData.gameField[4] === "O" && oGameData.gameField[8] === "O") {
        return 2;
    } else return 0;
}

// Samma som funktionen ovan, fast med olika platser i vektorn
function checkDiagonalRightToLeft() {
    if (oGameData.gameField[2] === "X" && oGameData.gameField[4] === "X" && oGameData.gameField[6] === "X") {
        return 1;
    } else if (oGameData.gameField[2] === "O" && oGameData.gameField[4] === "O" && oGameData.gameField[6] === "O") {
        return 2;
    } else return 0;
}

// kollar om det blir oavgjort
function checkForDraw() {
    let count = 0;
    // Här har vi en enkel loop som itererar genom hela vektorn
    for (let i = 0; i < 9; i++) {
        // kollar ifall det finns X eller O i platsen nummer "i"
        if (oGameData.gameField[i] === "X" || oGameData.gameField[i] === "O") {
            // om det finns, räknar vi up med ett i vår variabel
            count++
        }

        // om variabeln har nått 9 så vet vi att det finns inga lediga platser kvar
        if (count === 9) {
            // och returnerar 3 
            return 3
        }
    }
}