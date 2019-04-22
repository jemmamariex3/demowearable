/**
 * This class handles the Skin Temp (degF) for all players
 */
var SkinTempManager = function() {
    var self = this;

    var convertCelsiusToFarenheit = function (temp) {
        return (temp * 9 / 5 + 32);
    };

    self.init = function () {
        /* add setup code here */
    };
    self.update = function(player, data) {
        /* only update if connection is not lost */
        var timerId = window.TimerManager.getTimerId(player);
        if (window.TimerManager[timerId].playerHasLostConnection) {
            return;
        }

        var $playerSkinTemp = self.getPlayerSkintemp(player);
        var temperature = convertCelsiusToFarenheit(data.temp);
        $playerSkinTemp.html(temperature);
    }
    self.getPlayerSkintemp = function (player) {
        return $("#player" + player + "Skintemp");
    }


};
