
Plynd.ServerFunctions.submitEvent = function(event, success, error) {
    var cellID = parseInt(event.cell);

    // Verify that the cellID is valid
    if (cellID < 1 || cellID > 9) {
        return error({
            code:400,
            data:"cell must be an integer between 1 and 9"
        });
    }

    // Need to fetch the most recent and valid state of the game
    Plynd.getGame(function(state, metadata) {
        var ownPlayer = metadata.ownPlayer;

        // Check if the current player is allowed to play
        if (ownPlayer.status != "has_turn") {
            return error({
                code:403,
                data:"It's not your turn"
            });
        }

        // Check if this position is already taken
        if (state[cellID]) {
            return error({
                code:403,
                data:"This cell is already taken"
            });
        }

        // Update the state with the validated event
        state[cellID] = ownPlayer.playerID;

        // Create the event to send to everybody
        var event = {
            cell:cellID
        };

        // Check if there is a victory or a tie
        var numCellsOccupied = Object.keys(state).length;

        // This is a winning move
        if (checkVictory(ownPlayer.playerID, state)) {
            event.winnerID = ownPlayer.playerID;
        }
        // No more cells available - declare the game a tie
        else if (numCellsOccupied == 9) {
            event.winnerID = metadata.orderOfPlay.join(",");
        }
        // Still turns to play, just end this player turn
        else {
            event.endTurn = true;
        }

        // Invoke updateGame, and pass it the success callback of submitEvent.
        // success will therefore be invoked at the end of the call with [validatedEvent, metadata]
        Plynd.updateGame(event, state, success, error);
    });
};

///////////////////////////////////////////////////////////////////////////////////////////
// Win evaluation
///////////////////////////////////////////////////////////////////////////////////////////

function checkVictory(playerID, state) {
    var cellsOccupiedByPlayer = [];
    for (var cell = 1; cell <= 9; cell++) {
        if (state[cell] == playerID) {
            cellsOccupiedByPlayer.push(cell);
        }
    }

    return hasMagicSquare(cellsOccupiedByPlayer);
}

// Logic taken from http://fr.mathworks.com/moler/exm/chapters/tictactoe.pdf
function hasMagicSquare(cells) {
    for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells.length; j++) {
            for (var k = 0; k < cells.length; k++) {
                if (j == k || i == k || i == j) continue;
                if (cells[i] + cells[j] + cells[k] == 15) return true;
            }
        }
    }
    return false;
}
