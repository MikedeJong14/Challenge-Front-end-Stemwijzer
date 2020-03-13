var statementTitleHtml = document.getElementById("stelling-titel");
var statementTextHtml = document.getElementById("stelling-text");
var statementNumber = 0;
var answerArray = [];

function calculateScore() {
    resetScore();
    for (let i = 0; i < answerArray.length; i++) {
        var currentStatement = subjects[i];
        var answer = answerArray[i];

        for (let j = 0; j < currentStatement.parties.length; j++) {
            var currentParty = currentStatement.parties[j];
            var partyName = currentParty.name;
            var partyPosition = currentParty.position;

            for (let k = 0; k < parties.length; k++) {

                if (parties[k].name === partyName) {
                    if (partyPosition === answer) {
                        parties[k].score++;
                    }
                    break;
                }
            }
        }
    }
    console.log(parties);
}

function answerStatement(answer) {
    answerArray[statementNumber] = answer;
    console.log(answerArray);
}

function resetScore() {
    for (let i = 0; i < parties.length; i++) {
        parties[i].score = 0;
    }
}

function loadStatement() {
    currentStatement = subjects[statementNumber];
    statementTitleHtml.innerHTML = currentStatement.title;
    statementTextHtml.innerHTML = currentStatement.statement;
}

function startStemwijzer() {
    statementNumber = 0;
    loadStatement();
    for (let i = 0; i < parties.length; i++) {
        parties[i].score = 0;
    }
}

function nextStatement() {
    if (statementNumber === (subjects.length - 1)) {
        window.location = "stemwijzer.html";
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

console.log(parties);
