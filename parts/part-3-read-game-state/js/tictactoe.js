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

// getGame is the entry point. That's how we fetch data about the game
// It returns the state and the metadata of the game.
// So far the state is empty (it is what we will put into it) but the
// metadata contains info that we will use
Plynd.getGame(function(_state, _metadata) {
    state = _state;
    metadata = _metadata;

    showPlayers();
});