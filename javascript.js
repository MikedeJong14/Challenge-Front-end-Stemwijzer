var statementNumber = 0; // At what question is the user
var maxScore = subjects.length; // The maximum score a party can have to achieve 100%
var answerArray = []; // Keeps track of every answer given. Is filled with objects with properties
for (let i = 0; i < subjects.length; i++) {
    answerArray[i] = {}; // Initializes every answer object
}

// Calculate the score for all the answers
function calculateScore() {

    resetScore();

    // Each answer of the answer array
    for (let i = 0; i < answerArray.length; i++) {
        let currentStatement = subjects[i];
        let answer = answerArray[i]["answer"];
        let extraWeight = answerArray[i]["extraWeight"];

        // Increases max score so parties can't go above 100%
        if (extraWeight) {
            maxScore++;
        }

        // For each of the parties who answered the current statement
        for (let j = 0; j < currentStatement.parties.length; j++) {
            let currentParty = currentStatement.parties[j];
            let partyName = currentParty.name;
            let partyPosition = currentParty.position;

            // For each of the parties with a score
            for (let k = 0; k < parties.length; k++) {

                // Match the names of parties with scores and parties who answered the statement
                if (parties[k].name === partyName) {

                    // If the position of the party who answered the statement equals user's answer, add score.
                    if (partyPosition === answer) {

                        // If user has specified the question to weigh more, add double the score
                        if (extraWeight) {
                            parties[k].score += 2;
                        } else {
                            parties[k].score += 1;
                        }
                    }
                    break;
                }
            }
        }
    }

    parties.sort(compare);
    console.log(parties);
    console.log(maxScore);
}

// Sort parties on score DESCENDING
// Runs continuously until all the parties are sorted from high score to low score
function compare(a, b) {

    let comparison = 0;

    // Get scores of two parties
    let scoreA = a.score;
    let scoreB = b.score;

    // If scoreA is higher than scoreB, do nothing because we're sorting from high to low
    if (scoreA > scoreB) {
        comparison = -1;
    } else if (scoreA < scoreB) { // Else, swap the two values
        comparison = 1;
    }

    return comparison;
}

// Answer a statement
function answerStatement(answer) {

    answerArray[statementNumber]["answer"] = answer;
    console.log(answerArray);
}

// Reset the score of every party
function resetScore() {

    for (let i = 0; i < parties.length; i++) {
        parties[i].score = 0;
    }
}

// Display the title and text of a statement
function loadStatement() {

    let statementTitleHtml = document.getElementById("stelling-titel");
    let statementTextHtml = document.getElementById("stelling-text");

    // The current statement is determined by the global variable 'statementNumber'
    let currentStatement = subjects[statementNumber];

    statementTitleHtml.innerHTML = currentStatement.title;
    statementTextHtml.innerHTML = currentStatement.statement;

    // Checks if user has already specified added weight to a question
    let weight = answerArray[statementNumber]["extraWeight"];

    // typeof "undefined" describes if the 'extraWeight' property doesnt exist yet
    if (typeof weight === "undefined" || weight === false) {
        uncheckImportant();
    } else if (weight === true) {
        checkImportant();
    }

    console.log(statementNumber);
}

// Runs on every page load
function startStemwijzer() {

    // Reset the question number to 0
    statementNumber = 0;

    loadStatement();
    resetScore();

    // DEBUG: randomly fills in every answer so devs don't have to click 30 times
/*    for (let i = 0; i < subjects.length; i++) {
        if (Math.random() <= 0.5) { // 50% chance of either agreeing or disagreeing with statement
            answerArray[statementNumber]["answer"] = "pro";
        } else {
            answerArray[statementNumber]["answer"] = "contra";
        }
        answerArray[statementNumber]["extraWeight"] = Math.random() <= 0.2; // 20% chance of True
        nextStatement();
    }*/
}

function nextStatement() {

    // If global statement number equals max amount of questions, show the result
    if (statementNumber === (subjects.length - 1)) {
        calculateScore();
        showResult();
    } else { // Else, go to next question
        statementNumber++;
        loadStatement();
    }
}

function previousStatement() {

    // If global statement number equals 0, go to home page
    if (statementNumber === 0) {
        window.location = "index.html";
    } else { // Else, go to previous question
        statementNumber--;
        loadStatement();
    }
}

// These next two functions are largely DOM manipulation to change CSS properties of the check button
function checkImportant() {

    // Inputs True in the extraWeight property of the current answer
    answerArray[statementNumber]["extraWeight"] = true;

    document.getElementById("checkLabel").onclick = function() {uncheckImportant();};
    document.getElementById("checkLabel").classList.add("labelChecked");
    document.getElementById("checkLabel").classList.remove("labelUnchecked");
    document.getElementById("check").checked = "checked";
}

function uncheckImportant() {

    // Inputs False in the extraWeight property of the current answer
    answerArray[statementNumber]["extraWeight"] = false;

    document.getElementById("checkLabel").onclick = function() {checkImportant();};
    document.getElementById("checkLabel").classList.remove("labelChecked");
    document.getElementById("checkLabel").classList.add("labelUnchecked");
    document.getElementById("check").checked = null;
}

/** Creates a new HTML element
 * @param {string} type - Type of the new element (div, img, button)
 * @param {object} appendTo - The element that the new item gets appended to
 * @return {object} element - The newly created element
 */
function newElement(type, appendTo) {
    let element = document.createElement(type);
    appendTo.appendChild(element);
    return element;
}

// Calculate the percentage a party has scored
function calculatePercentage(party) {
    let percent = 100 / maxScore;
    return percent * party.score;
}

/** Show the final result
 * @param {string} mode - Different displays of parties
 */
function showResult(mode) {

    let resultScreen = document.getElementById("resultaatScherm");
    let stemwijzerScreen = document.getElementById("stemwijzerScherm");
    let results = document.getElementById("results");

    // Hide the answering screen and show the result screen
    resultScreen.classList.remove("invisible");
    stemwijzerScreen.classList.add("invisible");

    // If already filled with results, empty
    if (results.innerHTML) {
        results.innerHTML = "";
    }

    // For each party
    for (let i = 0; i < parties.length;  i++) {

        let result = newElement("DIV", results);
        let percentBar = newElement("DIV", result);
        let text = newElement("DIV", result);
        let party = parties[i];
        let partyName = party.name;

        // Check if a party has a full name
        if (!(typeof party.long === "undefined")) {
            partyName = party.long;
        }

        let percentParty = calculatePercentage(party);

        // Display percentage and specify width of percentage bar
        text.innerText = partyName + ": " + Math.round(percentParty) + "%";
        percentBar.style.width = Math.round(percentParty) + "%";

        result.classList.add("resultaat");
        text.classList.add("resultaat-text");
        percentBar.classList.add("procent-bar");

        // Hide parties that aren't secular
        if (mode === "seculier" && !party.secular) {
            result.classList.add("invisible");
        }

        // Hide parties that have a size of 0
        if (mode === "groot" && party.size === 0) {
            result.classList.add("invisible");
        }
    }
}

// Back to index
function home() {
    window.location = "index.html";
}