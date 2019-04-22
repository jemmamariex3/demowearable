<?php

session_start();
if(!isset($_SESSION["from"]) || $_SESSION["from"] != 0 || !isset($_POST["player"]) )
{
  error_log("from is " . $_SESSION["from"] . " and player is " . $_POST["player"] . "\n");
  header("Location: ../");
  die();
}

$cols = 8;
$rows = 8;
$mines = 10;
$player = $_POST["player"];


$_SESSION["from"] = 1; // serveGame.php (this page) is page 1 (second page)

?>


<!DOCTYPE HTML>
<HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

<script src="../scripts/jquery.js"></script>
<SCRIPT TYPE="text/javascript" SRC="../scripts/minesweeper.js"></SCRIPT>

<LINK HREF="../css/minesweeper.css" REL=stylesheet>

<style type="text/css">
	#sqTable {
		width: 30%;
		margin-left: auto;
		margin-right: auto;
	/* 	margin-left: 58%; margin-right: 30%;    */
	}
</style>
<TITLE>Minesweeper Demo</TITLE>
</HEAD>
<BODY onload="init(<?php echo "$cols, " . ($cols*$rows) . ", $mines, $player"; ?>);">
  <DIV CLASS="maintitle">

  <?php if($player != 0) : ?>
    <H3> M I N E S W E E P E R --- Welcome <span class="greentextunderlined">Player <?php echo $player; ?></span></H3>
  <?php endif; ?>

  <?php if($player == 0) : ?>
    <H3> M I N E S W E E P E R --- Welcome Spectator! Enjoy the show.</H3>
  <?php endif; ?>

  </DIV>
  <DIV CLASS="main limited">
  <?php require("minesweeper.php") ?>
  </DIV>

  <DIV CLASS="stats">
  <div> Tiles turned:  <span id="localTilesTurned">0</span></div>
  <div> Elapsed time (secs):  <span id="elapsedTime">0</span></div>
  <div> Current time:  <span id="currentTime">0</span></div>
  </DIV>
  <DIV>
  <TABLE CLASS="statsTable">
    <TR>
      <TH ID="player1Heading">PLAYER 1</TD>
      <TH ID="player2Heading">PLAYER 2</TD>
      <TH ID="player3Heading">PLAYER 3</TD>
      <TH ID="player4Heading">PLAYER 4</TD>
    </TR>
    <TR style="background: #aaaaaa;">
      <TD ID="player1Data">
        <table class="playerTable">
        <tr><td>Elapsed Time</td><td><span id="player1Elapsed">&nbsp;</td></tr>
        <tr><td>Tiles Turned</td><td> <span id="player1Tiles">&nbsp;</td></tr>
        <tr><td>Heart Rate (bpm)</td><td> <span id="player1HR">&nbsp;</td></tr>
        <tr><td>GSR (kOhms)</td><td> <span id="player1GSR">&nbsp;</td></tr>
        <tr><td>Skin Temp (degF)</td><td> <span id="player1Skintemp">&nbsp;</td></tr>
        </table>
      </TD>
      <TD ID="player2Data">
        <table class="playerTable">
        <tr><td>Elapsed Time</td><td><span id="player2Elapsed">&nbsp;</td></tr>
        <tr><td>Tiles Turned</td><td> <span id="player2Tiles">&nbsp;</td></tr>
        <tr><td>Heart Rate (bpm)</td><td> <span id="player2HR">&nbsp;</td></tr>
        <tr><td>GSR (kOhms)</td><td> <span id="player2GSR">&nbsp;</td></tr>
        <tr><td>Skin Temp (degF)</td><td> <span id="player2Skintemp">&nbsp;</td></tr>
        </table>
      </TD>
      <TD ID="player3Data">
        <table class="playerTable">
        <tr><td>Elapsed Time</td><td><span id="player3Elapsed">&nbsp;</td></tr>
        <tr><td>Tiles Turned</td><td> <span id="player3Tiles">&nbsp;</td></tr>
        <tr><td>Heart Rate (bpm)</td><td> <span id="player3HR">&nbsp;</td></tr>
        <tr><td>GSR (kOhms)</td><td> <span id="player3GSR">&nbsp;</td></tr>
        <tr><td>Skin Temp (degF)</td><td> <span id="player3Skintemp">&nbsp;</td></tr>
        </table>
      </TD>
      <TD ID="player4Data">
        <table class="playerTable">
        <tr><td>Elapsed Time</td><td><span id="player4Elapsed">&nbsp;</td></tr>
        <tr><td>Tiles Turned</td><td> <span id="player4Tiles">&nbsp;</td></tr>
        <tr><td>Heart Rate (bpm)</td><td> <span id="player4HR">&nbsp;</td></tr>
        <tr><td>GSR (kOhms)</td><td> <span id="player4GSR">&nbsp;</td></tr>
        <tr><td>Skin Temp (degF)</td><td> <span id="player4Skintemp">&nbsp;</td></tr>
        </table>
      </TD>
    </TR>
  </TABLE>
  </DIV>
<p>
<p>

</BODY>
</HTML>
