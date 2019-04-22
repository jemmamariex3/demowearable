  function Timer(callback, timeoutInMilliseconds) {
    var self = this;
    var timeoutId = null;
    var playerLastUpdateTime = 0;

    var handleLostConnection = function () {
        self.playerHasLostConnection = true;
        self.stop();
        callback();
    };

    self.playerHasLostConnection = false;

    self.start = function () {
      if (!timeoutId) {
          timeoutId = setTimeout(handleLostConnection, timeoutInMilliseconds);
      }
    };
    self.stop = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    self.restart = function() {
      self.stop();
      self.start();
    };
    self.savePlayerLastTimeUpdate = function (time) {
        if (playerLastUpdateTime < time) {
            playerLastUpdateTime = time;
            self.restart();
            self.playerHasLostConnection = false;
        }
    }

  };

