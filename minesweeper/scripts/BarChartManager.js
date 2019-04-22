/**
 * This class handles the overall progress for each player
 */
var BarChartManager = function () {
    var self = this;
    self.config = {
        type: 'bar',
        showTooltips: false,
        data: {
            labels: ["Player 1", "Player 2", "Player 3", "Player 4"],
            datasets: [
                {
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: false,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 100
                        }
                    }
                ]
            }
        }
    };
    self.chart = document.getElementById("TilesTurnedBarChart");

    self.init = function () {
        var canvas = self.chart;
        var ctx = canvas.getContext('2d');
        self.chart = new Chart(ctx, self.config);
    }
    self.update = function (player, value) {
        self.config.data.datasets[0].data[player] = value;
        self.chart.update();
    }



}