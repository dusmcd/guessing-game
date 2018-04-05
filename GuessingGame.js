$(document).ready(function() {
    var newGame = new Game();

    // DOM elements
    var title = $('#title'),
        subtitle =$('#subtitle'),
        submit = $('#submit'),
        hint = $('#hint');

    // event handler for player input
    function processGuess() {
        var inputBox = $('#player-input');
        var playerGuess = +inputBox.val();
        var result = newGame.playersGuessSubmission(playerGuess);
        var titleHint = newGame.isLower() ? 'You\'re too low' : 'You\'re too high';
        
        inputBox.val('');
        title.text(result + ' ' + titleHint);
        if (result !== 'You have already guessed that number.') {
            $('#guess-list li:nth-child(' + newGame.pastGuesses.length + ')')
            .text(playerGuess);
        }
        

        if (result === 'You Lose.' || result === 'You Win!')  {
            title.text(result);
            subtitle.text('Press the reset button to play again!');
            submit.prop('disabled', true);
            hint.prop('disabled', true);
        }
    }

    // event listeners
    submit.on('click', processGuess);
    $(document).keypress(function(event) {
        if (event.which == 13) {
            processGuess();
        }
    });
    hint.on('click', function() {
        title.text(newGame.provideHint());
    });
    $('#reset').on('click', function() {
        subtitle.text('Enter a number between 1-100');
        title.text('Play the Guessing Game!');
        submit.prop('disabled', false);
        hint.prop('disabled', false);
        resetGuesses();
        newGame = new Game();
    });
});

function resetGuesses() {
    $('#guess-list').html('<li class="guess">-</li><li class="guess">-</li>' +
                          '<li class="guess">-</li><li class="guess">-</li>' +
                          '<li class="guess">-</li>')
}


function generateWinningNumber() {
    var num;
    if (Math.ceil(Math.random() * 100) === 0) {
        num = 1;
    }
    else {
        num = Math.floor(Math.random() * 100) + 1;
    }
    return num;
}

function shuffle(arr) {
    var m = arr.length, temp, i;

    while (m) {

        i = Math.floor(Math.random() * m);
        m--;

        temp = arr[m];
        arr[m] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true;
    }
    return false;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || isNaN(num)) {
        throw 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    var result;
    if (this.playersGuess === this.winningNumber) {
        result = 'You Win!';
    }
    else if (this.pastGuesses.includes(this.playersGuess)) {
        result = 'You have already guessed that number.';
    }
    else if (this.pastGuesses.length >= 4) {
        result = 'You Lose.';
    }
    else if (this.difference() < 10) {
        result = 'You\'re burning up!';
        this.pastGuesses.push(this.playersGuess);
    }
    else if (this.difference() < 25) {
        result = 'You\'re lukewarm.';
        this.pastGuesses.push(this.playersGuess);
    }
    else if (this.difference() < 50) {
        result = 'You\'re a bit chilly.';
        this.pastGuesses.push(this.playersGuess);
    }
    else if (this.difference() < 100) {
        result = 'You\'re ice cold!';
        this.pastGuesses.push(this.playersGuess);
    }
    return result;
}

Game.prototype.provideHint = function() {
    var hint = [generateWinningNumber(), this.winningNumber, generateWinningNumber()];

    shuffle(hint);

    return hint;
}

function newGame() {
    return new Game();
}