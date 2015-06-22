define(["player/player-the-youtube"], function(playerTheYoutube) {
    var playTheInternet;

    playTheInternet = {
        _data: {
            currentTime: null,
            duration: null,
            index: null,
            playing: null,
            started: null
        },
        _player: null,
        _players: [],
        _ready: null,
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
        init: function() {
            var playersReady;

            if (playTheInternet._ready == null) {
                playTheInternet._ready = $.Deferred();
                playersReady = _.map(playTheInternet._players, _.method('init'));
                $.when.apply($, playersReady).then(playTheInternet._ready.resolve);
            }

            return playTheInternet._ready;
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
        ready: function() {
            return playTheInternet._ready;
        },
        volume: function(vol) {
            if (arguments.length) {
                playTheInternet._data.volume = vol;
            }
            return playTheInternet._data.volume;
        }
    };

    playTheInternet.addPlayers([
        playerTheYoutube
    ]);

    return playTheInternet;
});
