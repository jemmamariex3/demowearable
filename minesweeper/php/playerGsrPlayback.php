<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <style type="text/css">
		body {
			margin: 0 auto;
			background: #C3C3C3;
			font-family: cursive;
		}
        td {
            vertical-align: top;
			padding: 10px;
        }
        #gsrHeatMap {
            width: 700px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            vertical-align: middle;
            font-size: 20px;
            border: 1px solid #000;
        }
        #playbackStatus, #dataPointCounter {
            color: orange;
        }
    </style>
</head>
<body>
	<center>
		<h1>PLAYER GSR PLAYBACK</h1>

		<table border="0" width="1200px">
			<tr>
				<td width="300" style="background: #668E39;">
					<br />
					Status: <span id="playbackStatus">Reset Mode</span>

					<br /><br />
					Data Point Count: <span id="dataPointCounter">0</span>

					<br/><br/>
					Select Player:
					<br/>
					<select id="playerSelect">
						<option value="1">Player 1</option>
						<option value="2">Player 2</option>
						<option value="3">Player 3</option>
						<option value="4">Player 4</option>
					</select>

					<br/><br/>
					Select Playback Speed:

					<br/>
					<select id="speedSelect">
						<option value="200">200 ms</option>
						<option value="300">300 ms</option>
						<option value="400">400 ms</option>
						<option value="500">500 ms</option>
						<option value="600">600 ms</option>
						<option value="700">700 ms</option>
						<option value="800">800 ms</option>
						<option value="900">900 ms</option>
						<option value="1000">1000 ms</option>
						<option value="1250">1250 ms</option>
						<option value="1500">1500 ms</option>
						<option value="2000">2000 ms</option>
						<option value="2500">2500 ms</option>
						<option value="3000">3000 ms</option>
					</select>

					<br /><br />
					<button id="startPlaybackButton">Start Playback</button>
					
					<br /><br />
					<button id="continueButton">Continue</button>
					<button id="pauseButton">Pause</button>
					<button id="resetButton">Reset</button>
				</td>
				<td>
					<div style="width: 600px">
						<canvas id="gsrLineChart" width="100%" height="100%"></canvas>
					</div>
					<div id="gsrHeatMap">Heat Map</div>
				</td>
			</tr>
		</table>

		<script src="../scripts/jquery.js"></script>
		<script src="../scripts/jquery-ui.js"></script>
		<script src="../scripts/Chart.bundle.js"></script>
		<script src="../scripts/PlayerGSRPlaybackManager.js"></script>
		<script>
		$(function() {
			window.PlayerPlaybackManager = new PlayerPlaybackManager();
			PlayerPlaybackManager.init();
		});
		</script>
	</center>
</body>
</html>