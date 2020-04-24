var statementTitleHtml = document.getElementById("stelling-titel");
var statementTextHtml = document.getElementById("stelling-text");
var statementNumber = 0;
var maxScore = subjects.length;
var answerArray = [];
for (let i = 0; i < subjects.length; i++) {
    answerArray[i] = {};
}

function calculateScore() {
    resetScore();
    for (let i = 0; i < answerArray.length; i++) {
        let currentStatement = subjects[i];
        let answer = answerArray[i]["answer"];
        let extraWeight = answerArray[i]["extraWeight"];

        if (extraWeight) {
            maxScore++;
        }

        for (let j = 0; j < currentStatement.parties.length; j++) {
            let currentParty = currentStatement.parties[j];
            let partyName = currentParty.name;
            let partyPosition = currentParty.position;

            for (let k = 0; k < parties.length; k++) {
                if (parties[k].name === partyName) {
                    if (partyPosition === answer) {
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

function compare(a, b) {
    let comparison = 0;
    let scoreA = a.score;
    let scoreB = b.score;
    if (scoreA > scoreB) {
        comparison = -1;
    } else if (scoreA < scoreB) {
        comparison = 1;
    }
    return comparison;
}

function answerStatement(answer) {
    answerArray[statementNumber]["answer"] = answer;
    console.log(answerArray);
}

function resetScore() {
    for (let i = 0; i < parties.length; i++) {
        parties[i].score = 0;
    }
}

function loadStatement() {
    let currentStatement = subjects[statementNumber];
    statementTitleHtml.innerHTML = currentStatement.title;
    statementTextHtml.innerHTML = currentStatement.statement;

    let weight = answerArray[statementNumber]["extraWeight"];
    if (typeof weight === "undefined" || weight === false) {
        uncheckImportant();
    } else if (weight === true) {
        checkImportant();
    }

    console.log(statementNumber);
}

function startStemwijzer() {
    statementNumber = 0;
    loadStatement();
    resetScore();

    //debug: alle antwoorden willekeurig invullen
    for (let i = 0; i < subjects.length; i++) {
        if (Math.random() <= 0.5) {
            answerArray[statementNumber]["answer"] = "pro";
        } else {
            answerArray[statementNumber]["answer"] = "contra";
        }
        answerArray[statementNumber]["extraWeight"] = Math.random() <= 0.2; //20% kans op true
        nextStatement();
    }
}

function nextStatement() {
    if (statementNumber === (subjects.length - 1)) {
        calculateScore();
        showResult();
    } else {
        statementNumber++;
        loadStatement();
    }
}

function previousStatement() {
    if (statementNumber === 0) {
        window.location = "index.html";
    } else {
        statementNumber--;
        loadStatement();
    }
}

function checkImportant() {
    answerArray[statementNumber]["extraWeight"] = true;
    document.getElementById("checkLabel").onclick = function() {uncheckImportant();};
    document.getElementById("checkLabel").classList.add("labelChecked");
    document.getElementById("checkLabel").classList.remove("labelUnchecked");
    document.getElementById("check").checked = "checked";
}

function uncheckImportant() {
    answerArray[statementNumber]["extraWeight"] = false;
    document.getElementById("checkLabel").onclick = function() {checkImportant();};
    document.getElementById("checkLabel").classList.remove("labelChecked");
    document.getElementById("checkLabel").classList.add("labelUnchecked");
    document.getElementById("check").checked = null;
}

function newElement(type, appendTo) {
    let element = document.createElement(type);
    appendTo.appendChild(element);
    return element;
}

function showResult(mode) {
    let resultScreen = document.getElementById("resultaatScherm");
    let stemwijzerScreen = document.getElementById("stemwijzerScherm");
    let results = document.getElementById("results")
    let percent = 100 / maxScore;

    resultScreen.classList.remove("invisible");
    stemwijzerScreen.classList.add("invisible");

    if (results.innerHTML) {
        results.innerHTML = "";
    }

    for (let i = 0; i < parties.length;  i++) {
        let result = newElement("DIV", results);
        let percentBar = newElement("DIV", result);
        let text = newElement("DIV", result);
        let party = parties[i];
        let partyName = party.name;
        if (!(typeof party.long === "undefined")) {
            partyName = party.long;
        }
        let percentParty = percent * party.score;

        text.innerText = partyName + ": " + Math.round(percentParty) + "%";
        percentBar.style.width = Math.round(percentParty) + "%";
        result.classList.add("resultaat");
        text.classList.add("resultaat-text");
        percentBar.classList.add("procent-bar");

        if (mode === "seculier" && !party.secular) {
            result.classList.add("invisible");
        }
        if (mode === "groot" && party.size === 0) {
            result.classList.add("invisible");
        }
    }
}

function home() {
    window.location = "index.html";
}

console.log(parties);
