/**
 * This class handles the GSR (kOhms) levels for each player.
 */
var GSRManager = function () {
    var self = this;
    
    self.init = function () {
        /* add setup code here */
    };
    self.update = function(player, data) {
        /* only update if connection is not lost */
        var timerId = window.TimerManager.getTimerId(player);
        if (window.TimerManager[timerId].playerHasLostConnection) {
            return;
        }

        /**
         * https://tasks.sandbox.csun.edu/browse/WEAR-50
         * 0 - 50: black  (with white font-color)
         * 50 - 100:  purple  (with white font-color)
         * 100 - 200: blue  (with white font-color)
         * 200 - 560: lightblue
         * 560 - 760: green  (with white font-color)
         * 760 - 1000: red  (with white font-color)
         * 1000 - 3300: orange
         * 3300 - 10000: yellow
         * 10000:  white
         */
        var fontColor = "white", bgColor = "black";
        var gsr = data.gsr || 0;

        if (gsr >= 0 && gsr < 50) {
            fontColor = "white";
            bgColor = "black";
        } else if (gsr >= 50 && gsr < 100) {
            fontColor = "white";
            bgColor = "purple";
        } else if (gsr >= 100 && gsr < 200) {
            fontColor = "white";
            bgColor = "blue";
        } else if (gsr >= 200 && gsr < 560) {
            fontColor = "black";
            bgColor = "#ADD8E6";
        } else if (gsr >= 560 && gsr < 760) {
            fontColor = "white";
            bgColor = "green";
        } else if (gsr >= 760 && gsr < 1000) {
            fontColor = "white";
            bgColor = "red";
        } else if (gsr >= 1000 && gsr < 3300) {
            fontColor = "black";
            bgColor = "#FFA500";
        } else if (gsr >= 3300 && gsr < 10000) {
            fontColor = "black";
            bgColor = "yellow";
        } else if (gsr >= 10000) {
            fontColor = "black";
            bgColor = "white";
        }

        var $chart = self.getPlayerGsrChart(player);
        $chart.animate({ color: fontColor, backgroundColor: bgColor }, "slow");
        $chart.html(gsr);
    };
    self.getPlayerGsrChart = function (player) {
        return $("#player" + player + "GSR");
    };

};


