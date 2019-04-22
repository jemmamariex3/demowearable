<?php

session_start();
if(!isset($_SESSION["from"]) || $_SESSION["from"] != 0 || !isset($_POST["player"]) )
{
    error_log("from is " . $_SESSION["from"] . " and player is " . $_POST["player"] . "\n");
    header("Location: ../index_p3_vs_p4_turn.php");
    die();
}

$cols = 8;
$rows = 8;
$mines = 10;
$player = $_POST["player"];


$_SESSION["from"] = 1; // serveGame.php (this page) is page 1 (second page)

?>
<script>
var cols = <?php echo $cols; ?>;
var rows = <?php echo $rows; ?>;
var gameMode = 4;
</script>

<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link href="../css/minesweeper.css" rel="stylesheet" />
    <link href="../css/styles.css" rel="stylesheet" />
    <title>Minesweeper Demo</title>
</head>
<body>
    <div class="maintitle">

  <?php if($player != -1) : ?>
    <H3 style = "margin-left: -20%;"> M I N E S W E E P E R --- Welcome <span class="greentextunderlined">Player <?php echo $player; ?></span></H3>
  <?php endif; ?>

  <?php if($player == -1) : ?>
    <H3 style = "margin-left: -20%;"> M I N E S W E E P E R --- Welcome Spectator! Enjoy the show.</H3>
  <?php endif; ?>

    </div>
    <div class="main limited">
        <table border="0" width="100%">
            <tr>
                <td width="50%">
                     <?php require("statsTable.php") ?>
                </td>
                <td>
                    <?php require("minesweeper.php") ?>
                </td>
                <td width="20%" align="center">
                    % COMPLETED
                    <br />
                    <canvas id="TilesTurnedBarChart" width="300" height="300"></canvas>
                </td>
            </tr>
        </table>
    </div>

    <div class="stats">
        <div>
            Tiles turned:
            <span id="localTilesTurned">0</span>
        </div>
        <div>
            Elapsed time (secs):
            <span id="elapsedTime">0</span>
        </div>
        <div>
            Current time:
            <span id="currentTime">0</span>
        </div>
    </div>
    <p>
        <p>
            <script src="../scripts/jquery.js"></script>
            <script src="../scripts/jquery-ui.js"></script>
            <script src="../scripts/minesweeper_pvp_turn.js"></script>
            <script src="../scripts/Chart.bundle.js"></script>
            <script src="../scripts/HeartRateManager.js"></script>
            <script src="../scripts/BarChartManager.js"></script>
            <script src="../scripts/GSRManager.js"></script>
            <script src="../scripts/SkinTempManager.js"></script>
            <script src="../scripts/Timer.js"></script>
            <script src="../scripts/TimerManager.js"></script>
            <script>
                $(function () {
                    window.HeartRateManager = new HeartRateManager();
                    HeartRateManager.init();

                    window.BarChartManager = new BarChartManager();
                    BarChartManager.init();

                    window.GSRManager = new GSRManager();
                    GSRManager.init();

                    window.SkinTempManager = new SkinTempManager();
                    SkinTempManager.init();

                    window.TimerManager = new TimerManager();
                    TimerManager.reset();
                    TimerManager.start();

                    init(<?php echo "$cols, " . ($cols*$rows) . ", $mines, $player"; ?>);
                    var interval = setInterval(updateStats, 2000);
                });

                $("#simulating").change(function () {
                    var checked = $(this).is(':checked');
                    window.isSimulating = checked;
                    if(checked) {
                        window.TimerManager.stop();
                    } else {
                        TimerManager.reset();
                        TimerManager.start();
                    }
                });

                function updateStats() {
                    if (window.isSimulating) {
                        simulate();
                    } else {
                        fetchAllPlayerStats();
                    }
                };

                function simulate() {
                    for (var i = 1; i <= 4; ++i) {
                        var percentageCompleted = Math.floor(Math.random() * 100) + 1;
                        var skinTemp = Math.floor(Math.random() * 20) + 10;
                        var heartRate = Math.floor(Math.random() * 70) + 40;
                        var gsr = Math.floor(Math.random() * 10000) + 10;

                        window.BarChartManager.update(i-1, percentageCompleted);
                        window.SkinTempManager.update(i, { "temp": skinTemp, "time": (new Date()).getTime() });
                        window.HeartRateManager.update(i, { "hr": heartRate, "time": (new Date()).getTime() });
                        window.GSRManager.update(i, { "gsr": gsr, "time": (new Date()).getTime() });
                    }
                };
            </script>
</body>
</html>
