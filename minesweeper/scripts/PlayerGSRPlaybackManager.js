/**
 * This class handles the player GSR playback functionality.
 */
var PlayerPlaybackManager = function () {
    var self = this;

    var data = null;
    var currentIndex = 0;
    var currentSpeedInMilliseconds = 200; /* default to 200ms */
    var timer = null;

    var $playerSelect = $("#playerSelect");
    var $startPlaybackButton = $("#startPlaybackButton");
    var $pauseButton = $("#pauseButton");
    var $continueButton = $("#continueButton");
    var $resetButton = $("#resetButton");
    var $speedSelect = $("#speedSelect");
    var $playbackStatus = $("#playbackStatus");
    var $gsrHeatMap = $("#gsrHeatMap");
    var $dataPointCounter = $("#dataPointCounter");

    self.init = function () {
        /**
         * hook up buttons and dropdowns
         */
        $startPlaybackButton.click(function () {
            var player = $playerSelect.val();
            self.fetchData(player);
            self.startTimer();
            self.updateStatus("In Playback Mode");
        });

        $continueButton.click(function() {
            self.startTimer();
        });

        $pauseButton.click(function () {
            self.stopTimer();
        });
        
        $resetButton.click(function () {
            window.location.reload();
        });

        $speedSelect.change(function () {
            currentSpeedInMilliseconds = this.value;
            if (timer) {
                self.stopTimer();
                self.startTimer();
            }
        });

        /**
         * setup line chart
         */
        self.setupLineChart();
    };
    self.fetchData = function (player) {
        $.ajax({
            url: "/minesweeper/php/getPlayers.php?func=getAllGsrByPlayer&player=" + player,
            success: function (results) {
                data = results;
            },
            async: false
        });
    };
    self.iterateNext = function () {
        if (!data) {
            return;
        }

        if (currentIndex < data.length) {
            self.udpateHeatMap(data[currentIndex]);
            self.updateLineChart(currentIndex, data[currentIndex]);
            $dataPointCounter.html(currentIndex);
            currentIndex++;
        } else {
            /* end of data */
            self.updateStatus("End of Data");
            self.stopTimer();
        }
    };
    self.startTimer = function () {
        timer = setInterval(self.iterateNext, currentSpeedInMilliseconds);
    };
    self.stopTimer = function () {
        clearTimeout(timer);
        timer = null;
    };
    self.udpateHeatMap = function (obj) {
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
        var gsr = obj.data;
        var fontColor = "white", bgColor = "black";
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

        $gsrHeatMap.animate({ color: fontColor, backgroundColor: bgColor }, currentSpeedInMilliseconds);
        $gsrHeatMap.html(gsr);
    };
    self.updateStatus = function (text) {
        $playbackStatus.html(text);
    };

    /**
     * Line Chart
     */
    self.setupLineChart = function () {
        var data = {
            labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            datasets: [
                {
                    label: "",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    strokeColor: "rgba(151,187,205,1)"
                }
            ]
        };
        self.chartOptions = {
            type: 'line',
            data: data,
			showTooltips: true,
            options: {
                responsive: true,
                showLines: true,
                scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            autoSkip: false,
                            display: true
                        }
                    }],
                    yAxes: [{
                        display: true,
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            display: true,
                            beginAtZero: true,
                            min: 0,
                            max: 20000
                        }
                    }]

                }
            }
        };
        self.chartContext = new Chart("gsrLineChart", self.chartOptions);
	};
    self.updateLineChart = function (index, obj) {
        var value = obj.data;
        var timestamp = obj.time;

        self.chartOptions.data.datasets[0].data.push(value);
        self.chartOptions.data.datasets[0].label = "GSR";
        self.chartOptions.data.labels.push(timestamp);

        // this bit is to make sure we have a continuous transition
        self.chartOptions.data.datasets[0].data[0] = self.chartOptions.data.datasets[0].data[1];
        self.chartOptions.data.datasets[0].data.splice(1, 1);
        self.chartOptions.data.labels[0] = self.chartOptions.data.labels[1];
        self.chartOptions.data.labels.splice(1, 1);

        self.chartContext.update();
    };
};