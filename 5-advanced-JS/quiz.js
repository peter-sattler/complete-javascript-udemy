//Coding Challenge #7

(function() {
    var Question = function(question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;

    };

    Question.prototype.displayQuestion = function() {
        console.log(this.question);
        for(var i = 0; i < this.answers.length; i++)
            console.log(i + ': ' + this.answers[i]);
    }

    Question.prototype.checkAnswer = function(answer) {
        if(answer === this.correct) {
            score++;
            console.log('Correct answer!');
        }
        else
            console.log('Wrong answer. Try again :)');
        this.displayScore(score);
    }
  
    Question.prototype.displayScore = function(score) {
        console.log('Your current score is: ' + score);
        console.log('------------------------------');
    }
    
    function nextQuestion(n) {
        var n = Math.floor(Math.random() * questions.length);
        questions[n].displayQuestion();
        var answer = prompt('Please select the correct answer [exit to end]: ');
        if (answer !== 'exit') {
            questions[n].checkAnswer(parseInt(answer));
            nextQuestion();
        }
    }

    var score = 0;
    var questions = [new Question('What is the meaning of life?', [10, 42, 50], 1),
                     new Question('Is JavaScript awesome?', ['Yes', 'No'], 0),
                     new Question('Do you like this game?', ['Yes', 'No'], 0)];
    
    nextQuestion();
})();
