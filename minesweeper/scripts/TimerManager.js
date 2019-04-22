/**
 * This class handles the connection timer each player.
 */
var TimerManager = function () {
    var self = this;
    var MAX_STALE_VALUE_MILLISECONDS = 2000;
    
    var lostConnectionHandler = function (player) {
        var $heartRateChart = window.HeartRateManager.getPlayerHR(player);
        $heartRateChart.html("conn. lost");

        var $playerSkinTemp = window.SkinTempManager.getPlayerSkintemp(player);
        $playerSkinTemp.html("conn. lost");

        var $gsrChart = window.GSRManager.getPlayerGsrChart(player);
        $gsrChart.html("conn. lost");
    };

    self.getTimerId = function (player) {
        return "player" + player + "Timer";
    };
    self.start = function() {
        for (var player = 1; player <= 4; ++player) {
            var timerId = self.getTimerId(player);
            self[timerId].start();
        }
    };
    self.stop = function() {
        for (var player = 1; player <= 4; ++player) {
            var timerId = self.getTimerId(player);
            self[timerId].stop();
        }
    };
    self.reset = function () {
        /* set up timers for each player */
        for (var player = 1; player <= 4; ++player) {
            var timerId = self.getTimerId(player);
            self[timerId] = new Timer(lostConnectionHandler.bind(null, player), MAX_STALE_VALUE_MILLISECONDS);
        }
    };

};