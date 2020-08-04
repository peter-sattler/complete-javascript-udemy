/*
 * PIG GAME ORIGINAL RULES:
 *
 *  -The game has 2 players, playing in rounds
 *  -In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
 *  -BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
 *  -The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
 *  -The first player to reach 100 points on GLOBAL score wins the game
 *
 *
 * CHALLENGE RULE CHANGES:
 *
 * 1. A player looses his ENTIRE score when he rolls two 6s in a row. After that, it's the next player's turn. (Hint: Always save the previous 
 *    dice roll in a separate variable)
 * 2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you 
 *    can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
 * 3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you 
 *    will need CSS to position the second dice, so take a look at the CSS code for the first one.)
 *
 * NOTE: Since I combined all changes into one program, I assumed RULE CHANGE #1 applied to both dice. The instructor implemented #1 and #3
         independent of one another.
 */
var activePlayer, gamePlaying, prevDice1, prevDice2, roundScore, scores;

init();

//Reset the game:
document.querySelector('.btn-new').addEventListener('click', init);

//Roll the dice:
document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying) {
        //Roll the dice and display the result:
        var dice1 = rollDice();
        var dice2 = rollDice();
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        document.getElementById('dice-1').src = 'dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = 'dice-' + dice2 + '.png';
        console.log('dice1=' + dice1 + ', prevDice1=' + prevDice1 + ', dice2=' + dice2 + ', prevDice2=' + prevDice2);

        //Update the round score ONLY IF BOTH rolled numbers are NOT 1 AND two 6 PAIRs were not rolled in a row:
        if (dice1 === 6 && prevDice1 === 6 && dice2 === 6 && prevDice2 === 6) {
            //Reset ENTIRE score to zero and update the UI:
            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = '0';
            nextPlayer();
        }
        else if (dice1 === 1 || dice2 === 1) {
            nextPlayer();
        }
        else {
            //Accumulate ROUND score and update the UI:
            roundScore += dice1 + dice2;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
            prevDice1 = dice1;
            prevDice2 = dice2;
        }
    }
});

//Hold the score:
document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        //Add ROUND (current) score to GLOBAL score and update the UI:
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        //Determine winning score:
        var finalScore = document.querySelector('.final-score').value;
        var winningScore = finalScore ? finalScore : 100;  //Undefined, 0, null or "" are COERCED to false. Rest COERCED to true
        console.log('Winning score:', winningScore);
        
        //Check if player WON the game:
        if (scores[activePlayer] >= winningScore) {
            gamePlaying = false;
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.getElementById('name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        }
        else {  
            nextPlayer();
        }
    }
});

function init() {
    //Reset variables:
    activePlayer = 0;
    gamePlaying = true;
    prevDice1 = 0;
    prevDice2 = 0;
    roundScore = 0;
    scores = [0, 0];

    //Reset scores:
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    //Reset the winner on the UI:
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    
    //Reset the active player on the UI:
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    
    //Disable dice display:
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function nextPlayer() {
    //Next player:
    activePlayer = activePlayer === 0 ? 1 : 0;
    prevDice1 = 0;
    prevDice2 = 0;
        
    //Reset scores:
    roundScore = 0;     
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
        
    //Toggle active player in the UI:
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
        
    //Disable dice display:
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}