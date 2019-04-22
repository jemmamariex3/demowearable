<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
    <title>Wearables - D3 Visualizations</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css">

    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/skeleton.css">
    <link rel="stylesheet" href="css/charts.css">

    <script src="scripts/jquery.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="scripts/wearables-api.js"></script>
    <script src="scripts/multi-user-chart.js"></script>
    <script src="scripts/multi-signal-chart.js"></script>
    <script src="scripts/charts.js"></script>
</head>

<body>
    <div id="nav">
        <button class="button-primary"><a href="/index.php">Home</a></button>
    </div>
  
    <div class="container">
        <div id="chart-select">
            <div class="row">
                <button id="multi-user" class="toggle-select-chart">Multi-User Chart</button>
                <button id="multi-signal" class="toggle-select-chart">Multi-Signal Chart</button>
            </div>
        </div>
        <div id="type-select">
            <div class="row" id="multi-user-select" style="display:none">
                <button id="hr" class="toggle-select-type">Heart Rate</button>
                <button id="gsr" class="toggle-select-type">GSR</button>
                <button id="skin" class="toggle-select-type">Skin Temperature</button>
                <button id="ac" class="toggle-select-type">Accelerometer</button>
                <button id="ba" class="toggle-select-type">Breath Amplitude</button>
                <button id="csv" class="toggle-select-type">Custom CSV Data</button>
            </div>
            <div class="row" id="multi-signal-select" style="display:none">
                <button id="player1" class="toggle-select-type">Player 1</button>
                <button id="player2" class="toggle-select-type">Player 2</button>
                <button id="player3" class="toggle-select-type">Player 3</button>
                <button id="player4" class="toggle-select-type">Player 4</button>
            </div>
        </div>
        <div id="session-select" style="display:none">
            <div class="row">
                <div class="twelve columns session">
                    <button id="s1" class="toggle-select-session"> Session 1 (03-17-2017)</button>
                    <button id="s2" class="toggle-select-session"> Session 2 (03-17-2017)</button>
                    <button id="custom" class="toggle-select-session"> Custom Time</button>
                </div>
            </div>
        </div>
        <div id="game-select" style="display:none">
            <div class="row" id="s1games" style="display:none">
                <div class="twelve columns session">
                    <button id="s1g1" class="toggle-select-game">Game One: 14:23 to 14:30</button>
                    <button id="s1g2" class="toggle-select-game">Game Two: 14:37 to 14:44</button>
                    <button id="s1g3" class="toggle-select-game">Game Three: 14:48 to 14:55</button>
                    <button id="s1g4" class="toggle-select-game">Game Four: 15:00 to 15:07</button>
                </div>
            </div>
            <div class="row" id="s2games" style="display:none">
                <div class="twelve columns session">
                    <button id="s2g1" class="toggle-select-game">Game One: 15:22 to 15:29</button>
                    <button id="s2g2" class="toggle-select-game">Game Two: 15:35 to 15:42</button>
                    <button id="s2g3" class="toggle-select-game">Game Three: 15:45 to 15:52</button>
                    <button id="s2g4" class="toggle-select-game">Game Four: 15:54 to 16:01</button>
                    <button id="s2g5" class="toggle-select-game">Game Five: 16:07 to 16:14</button>
                </div>
            </div>
            <div class="row" id="customGames" style="display:none">
                <div class="twelve columns custom">
                    <label>Start: <input class="" id="customStart" type="datetime-local" value="2017-03-17T14:23"></label>
                    <label>End: <input class="" id="customEnd" type="datetime-local" value="2017-03-17T14:25"></label>
                    <button id="customFilter" class="small-button toggle-select-game">Filter</button>
                </div>
                <div class="twelve columns custom">
                    <!-- TODO: Make timestamp filter work -->
                    <label>Start: <input class="" id="customStartStamp" type="text" placeholder="1512249646767"></label>
                    <label>End: <input class="" id="customEndStamp" type="text" placeholder="1512249691855"></label>
                    <button id="customFilter" class="small-button toggle-select-game">Filter</button>
                </div>
            </div>
        </div>
    </div>

    <div id="chart-container" style="display:none">
        <h5 id="chart-title">No Game Selected</h5>
        <svg id="chart"></svg>
    </div>

</body>

</html>

