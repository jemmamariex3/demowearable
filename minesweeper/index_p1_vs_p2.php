<?php

session_start();
$_SESSION["from"] = 0; // choosePlayer.php (this page) is page 0 (first page)
?>

<!DOCTYPE HTML>
<HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">


<script>
  var player;

  function submitPlayer()
  {
    document.getElementById("theForm").submit();
  }

  function init()
  {
    document.getElementById("submitButton").addEventListener("click", submitPlayer);
    player = document.getElementById("player");
  }

</script>

<LINK HREF="css/minesweeper.css" REL=stylesheet>

<TITLE>Ready...? Choose a player #</TITLE>
</HEAD>
<BODY onload="init()">
  <DIV CLASS="maintitle">
  <H1 ID="chooseH1"> CHOOSE A PLAYER </H1>
  </DIV>
  <DIV CLASS="mainCenter">
    <form method="POST" id="theForm" action="php/servegame_p1_vs_p2.php">
      <div>
        <select name="player" id="playerSelect">
        <option value="0">Spectate</option>
        <option value="1">Player 1</option>
        <option value="2">Player 2</option>
        </select>
      </div>

      <div>&nbsp;</div>

      <div>
        <input type="button" id="submitButton" value="Submit">
      </div>
    </form>
  </DIV>

</BODY>
</HTML>
