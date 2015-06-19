define([], function() {
    var playTheInternet;

    playTheInternet = {
        _data: {
            currentTime: null,
            duration: null,
            index: null,
            playing: null
        },
        _player: null,
        _players: null,
        addPlayer: function(player) {
            playTheInternet.addPlayers([player]);
        },
        addPlayers: function(players) {
            playTheInternet._players = playTheInternet._players.concat(players);
        },
        get: function() {
            var result;

            result = _.map(arguments, function(key) {
                return _.object([key], [playTheInternet._data[key]]);
            });

            return result;
        },
        load: function(type, id, state) {
            var player;

            if (playTheInternet.player) {
                playTheInternet.player.stop();
            }
            player = _.find(players, { type: type });
            playTheInternet.player = player;
            player.load(id, state);
        },
        play: function() {
            playTheInternet.playing(true);
        },
        playing: function(bool) {
            if (arguments.length) {
                playTheInternet._data.playing = bool;
            }
            return playTheInternet._data.playing;
        },
        pause: function() {
            playTheInternet.playing(false);
        },
        volume: function(vol) {
            if (arguments.length) {
                playTheInternet._data.volume = vol;
            }
            return playTheInternet._data.volume;
        }
    };

    return playTheInternet;
});
