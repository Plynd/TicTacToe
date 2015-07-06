// Keep the game state and the metadata globally so
// that they can be used in all the different functions
var state, metadata;

///////////////////////////////////////////////////////////////////////////////////////////
// The functions to update the UI according to the game state and metadata
///////////////////////////////////////////////////////////////////////////////////////////

// The first player has the symbol "X"
// The second has the symbol "O"
// We use metadata.orderOfPlay to know who is the first player
function getPlayerSymbol(playerID) {
    if (playerID == metadata.orderOfPlay[0]) return "X";
    return "O";
}

// Show the players, based on the metadata object
function showPlayers() {
    // metadata contains a lot of information, among which
    // * metadata.players contains the info about all the players in the game, given by their ID
    // * metadata.ownPlayer contains the info about the player with the point of view on the game
    // * metadata.orderOfPlay is the list of the player IDs in the game
    var players = metadata.players;
    var ownPlayer = metadata.ownPlayer;
    var orderOfPlay = metadata.orderOfPlay;

    for (var i = 0; i < orderOfPlay.length ; i++) {
        var playerID = orderOfPlay[i];
        var player = players[playerID];

        // Select the left div for "ownPlayer", the right one for the other
        var playerDiv;
        if (playerID == ownPlayer.playerID) {
            playerDiv = $('#player-left');
        }
        else {
            playerDiv = $('#player-right');
        }

        // Show the name, the status and the player image
        playerDiv.find('img').prop('src', player.user.picture);
        playerDiv.find('.player-name').text(player.playerName);
        playerDiv.find('.player-status').text(player.status);
        playerDiv.find('.player-symbol').text("(" + getPlayerSymbol(player.playerID) + ")");
    }
}

// Show the game state
function showBoard() {
    for (var cell = 1; cell <= 9; cell++) {
        var playerOnCell = state[cell];
        if (playerOnCell) {
            var cellDiv = $("td[data-magicnumber=" + cell + "]");
            cellDiv.html(getPlayerSymbol(playerOnCell));
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
// The hook to react to events happening on the game
///////////////////////////////////////////////////////////////////////////////////////////

function onEvent(event, _metadata) {
    // Copy the updated metadata in our local object and refresh the display of players
    metadata = _metadata;
    showPlayers();

    // Update the state from the validated event and refresh the display of the board
    state[event.cell] = event.playerID;
    showBoard();

    // Check if the game is over
    if (metadata.status == "game_is_over") {
        alert("The game is over!");
    }
}

// getGame is the entry point.
// There we initialize state and metadata
Plynd.getGame(function(_state, _metadata) {
    state = _state;
    metadata = _metadata;

    showPlayers();
    showBoard();

    // Register the click handler
    $("#board td").on("click", function() {
        var cellID = $(this).data("magicnumber");

        // Do some basic validation on the client side
        if (metadata.ownPlayer.status != "has_turn") {
            return alert("It's not your turn");
        }

        if (state[cellID]) {
            return alert("This cell is already taken");
        }

        // Delegate the update logic to submitEvent
        Plynd.call("submitEvent", {cell:cellID}, onEvent);
    });

    // Register to the realtime channel
    Plynd.Realtime.onEvent(onEvent);
});