<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<?php
    //session_destroy();
?>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <!--Style Sheets-->
    <link rel="stylesheet" href="css/wearables.css" />

    <!--Scripts-->
    <script src="scripts/jquery.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="scripts/getResultsScript.js"></script>

    <title>Wearables</title>

</head>

<body>
    <div id="wrapper">
        <h1 align="center"> Wearables </h1><hr />

        <div id="buttonsDiv">
            <button id="live" class="buttonDesign">Live D3 Charts</button>
            <button id="charts" class="buttonDesign">D3 Charts</button>
            <button id="gameTimer" class="buttonDesign">Game Timer</button>
            <button id="singlePlayer" class="buttonDesign">Single Player</button>
            <button id="playTurn" class="buttonDesign">Minesweeper 4-Player Turn</button>
            <button id="play_p1_vs_p2" class="buttonDesign">Minesweeper P-1 vs P-2 Coop</button>
            <button id="play_p3_vs_p4" class="buttonDesign">Minesweeper P-3 vs P-4 Coop</button>
            <button id="play_p1_vs_p2_turn" class="buttonDesign">Minesweeper P-1 vs P-2 Turn</button>
            <button id="play_p3_vs_p4_turn" class="buttonDesign">Minesweeper P-3 vs P-4 Turn</button>
            <button id="heartButton" class="buttonDesign">Get Heart Rate</button>
            <button id="skinButton" class="buttonDesign">Get Skin Temperature</button>
            <button id="stressButton" class="buttonDesign">Get Galvanic Response</button>
            <button id="hideButton" class="buttonDesign">Hide Results</button>
            <button id="liveScriptButton" class="buttonDesign">Run Live Script</button>
            <button id="stopScriptButton" class="buttonDesign">Stop Live Script</button>
            <button id="playbackButton" class="buttonDesign">Player GSR Playback</button>
            <p style="color: #FFF; text-align: center; background-color: black;">Error Messages:</p>
        <p id ="errorMsg" style="color: red; background-color: black; text-align: center;"></p>
        </div>

        <div id="results">

        </div>

        </br></br>

        <div id = "player1">
            <span id="playerHeader1"><h3>Player 1</h3></span>
            <span id="results2">

            </span>

            <span id="results3">

            </span>

            <span id="results4">

            </span>
        </div>

        </br></br>

        <div id = "player2">
            <span id="playerHeader2"><h3>Player 2</h3></span>
            <span id="results5">

            </span>

            <span id="results6">

            </span>

            <span id="results7">

            </span>
        </div>

        </br></br>

        <div id = "player3">
            <span id="playerHeader3"><h3>Player 3</h3></span>

            <span id="results8">

            </span>

            <span id="results9">

            </span>

            <span id="results10">

            </span>
        </div>

        </br></br>

        <div id = "player4">
        <span id="playerHeader4"><h3>Player 4</h3></span>

            <span id="results11">

            </span>

            <span id="results12">

            </span>

            <span id="results13">

            </span>
        </div>

    </div> <!--end of wrapper div-->
</body>
</html>
