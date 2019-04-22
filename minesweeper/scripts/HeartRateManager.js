/**
 * This class handles the Heart Rate (bpm) for all players
 */
var HeartRateManager = function() {
    var self = this;


    var getPlayerChartId = function(player) {
        return "player" + player + "HRChart";
    };
    var getPlayerConfig = function(player) {
        return "player" + player + "Config";
    };


    self.player1Config = {
        type: 'line',
        data: {
            labels: ["", "", "", ""],
            datasets: [
                {
                    label: "",
                    strokeColor: "rgba(151,187,205,1)",
                    data: [0, 0, 0, 0],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255,99,132,1)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };
    self.player2Config = {
        type: 'line',
        data: {
            labels: ["", "", "", ""],
            datasets: [
                {
                    label: "",
                    strokeColor: "rgba(151,187,205,1)",
                    data: [0, 0, 0, 0],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255,99,132,1)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };
    self.player3Config = {
        type: 'line',
        data: {
            labels: ["", "", "", ""],
            datasets: [
                {
                    label: "",
                    strokeColor: "rgba(151,187,205,1)",
                    data: [0, 0, 0, 0],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255,99,132,1)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };
    self.player4Config = {
        type: 'line',
        data: {
            labels: ["", "", "", ""],
            datasets: [
                {
                    label: "",
                    strokeColor: "rgba(151,187,205,1)",
                    data: [0, 0, 0, 0],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255,99,132,1)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };



    self.init = function() {
        for (var player = 1; player <= 4; ++player) {
            /* set up LineChart for each player */
            var chart = getPlayerChartId(player);
            var canvas = document.getElementById(chart);
            var context = canvas.getContext('2d');
            var configId = getPlayerConfig(player);
            self[chart] = new Chart(context, self[configId]);
        }
    };
    self.update = function(player, data) {
        /* only update if connection is not lost */
        var timerId = window.TimerManager.getTimerId(player);
        window.TimerManager[timerId].savePlayerLastTimeUpdate(data.time);
        if (window.TimerManager[timerId].playerHasLostConnection) {
            return;
        }

        /* update chart */
        var chart = getPlayerChartId(player);
        var configId = getPlayerConfig(player);
        self[configId].data.datasets[0].data.push(data.hr);
        self[configId].data.datasets[0].data[0] = self[configId].data.datasets[0].data[1];
        self[configId].data.datasets[0].data.splice(1, 1);
        self[chart].update();

        /* update value */
        var $playerHR = self.getPlayerHR(player);
        $playerHR.html(data.hr);
        $playerHR.fadeTo(500, 0.1).fadeTo(500, 1.0);
    };
    self.getPlayerHR = function (player) {
        return $("#player" + player + "HR");
    };


};
