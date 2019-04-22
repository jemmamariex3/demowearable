<?php
  $conn = 0;

//########################################
//### CONNECT AND DISCONNECT FUNCTIONS ###
//########################################

  function connect()
  {
    global $conn;
    $servername = "localhost";
    $username = "wearteam";
    $password = "w3@r@b!e5";
    $dbname = "wearables";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error)
      die("Connection failed: " . $conn->connect_error);

  }

  function disconnect()
  {
    global $conn;
    $conn->close();
  }


//######################
//### GAME FUNCTIONS ###
//######################

  //### INSERTS GAMEID, PLAYERID, AND MATRIXTILES INTO DATABASE | EXPOSURE, MINE = 0 BY DEFAULT ###
  function insertGameTurn($gameid, $total, $playerid, $gametype)
  {
    global $conn;

    for($i = 0; $i < $total; $i++)
    {
       $sql = "INSERT INTO games (gameId, matrixTile, playerId, exposure, mine, gameState, gameType) VALUES ($gameid, $i, $playerid, 0, 0, 1, $gametype)";

       if($conn->query($sql) != TRUE)
         error_log("MYSQL error msg: " .  $conn->error . "\n") ;
    }

    $conn->close();
  }

  //### 2 PLAYER GAME INSERTION - PLAYER 1 VS PLAYER 2
  function insertGame1vs2($gameid, $rows, $cols, $gametype)
  {
    global $conn;

    for($i = 0; $i < $rows; $i++)
    {
      for($j = 0; $j < $cols; $j++)
      {
        $tile = ($i * $cols + $j);
        if($j < 4)
        {
          $sql = "INSERT INTO games (gameId, matrixTile, playerId, exposure, mine, gameState, gameType) VALUES ($gameid, $tile, 1, 0, 0, 1, $gametype)";
        }
        else
        {
          $sql = "INSERT INTO games (gameId, matrixTile, playerId, exposure, mine, gameState, gameType) VALUES ($gameid, $tile, 2, 0, 0, 1, $gametype)";
        }

        if($conn->query($sql) != TRUE)
          error_log("MYSQL error msg: " .  $conn->error . "\n") ;
      }
    }

    $conn->close();
  }

  //### 2 PLAYER GAME INSERTION - PLAYER 3 VS PLAYER 4
  function insertGame3vs4($gameid, $rows, $cols, $gametype)
  {
    global $conn;

    for($i = 0; $i < $rows; $i++)
    {
      for($j = 0; $j < $cols; $j++)
      {
        $tile = ($i * $cols + $j);
        if($j < 4)
        {
          $sql = "INSERT INTO games (gameId, matrixTile, playerId, exposure, mine, gameState, gameType) VALUES ($gameid, $tile, 3, 0, 0, 1, $gametype)";
        }
        else
        {
          $sql = "INSERT INTO games (gameId, matrixTile, playerId, exposure, mine, gameState, gameType) VALUES ($gameid, $tile, 4, 0, 0, 1, $gametype)";
        }

        if($conn->query($sql) != TRUE)
          error_log("MYSQL error msg: " .  $conn->error . "\n") ;
      }
    }

    $conn->close();
  }

  //### UPDATES THE PLAYER TURN IN THE GAME. IT SETS ALL TILES TO A CERTAIN PLAYER SO ONLY THAT PLAYER CAN CLICK THEM ###
  function updatePlayerTurn($playerid, $gameid)
  {
    global $conn;

    $sql = "UPDATE games SET playerId = $playerid WHERE gameId = $gameid";

    if($conn->query($sql) != TRUE)
    	error_log("MYSQL error msg: " .  $conn->error . "\n") ;

    $conn->close();
  }

  //### UPDATE THE EXPOSURE OF TILE ON CLICK & ALGORITHM FROM MINESWEEPER.JS
  function updateTileExposure($gameid, $tileid)
  {
    global $conn;

    $sql = "UPDATE games SET exposure = 1 WHERE gameId = $gameid AND matrixTile = $tileid";

    if($conn->query($sql) != TRUE)
    	error_log("MYSQL error msg: " .  $conn->error . "\n") ;

    $conn->close();
  }

  //### INSERTS / UPDATES THE MINE STATUS OF A TILE. THIS IS CALLED FROM MINESWEEPER.JS: SETMINES()
  function insertMine($gameid, $tileid)
  {
    global $conn;

    $sql = "UPDATE games SET mine = 1 WHERE gameId = $gameid AND matrixTile = $tileid";

    if($conn->query($sql) != TRUE)
    	error_log("MYSQL error msg: " .  $conn->error . "\n") ;

    $conn->close();
  }

  //INSERTS MINES AS ARRAY SO IT'S FASTER THAN INSERTMINE() FUNCTION
  function insertMines($gameid, $mines)
  {
    global $conn;
    $length = sizeof($mines);
    for($i = 0; $i < sizeof($mines); $i++)
    {
      $matrixMine = $mines[$i];
      $sql = "UPDATE games SET mine = 1 WHERE gameId = $gameid AND matrixTile = $matrixMine";

      if($conn->query($sql) != TRUE)
    	error_log("MYSQL error msg: " .  $conn->error . "\n") ;
    }
    $conn->close();
  }

  //### UPDATES GAME STATUS FROM TRUE TO FALSE SO WE CREATE A NEW GAME RECORD IN THE MINESWEEPER.JS FILE
  function setToGameOver($gameid)
  {
    global $conn;

    $sql = "UPDATE games SET gameState = 0 WHERE gameId = $gameid";

    if($conn->query($sql) != TRUE)
    	error_log("MYSQL error msg: " .  $conn->error . "\n") ;

    $conn->close();
  }

  //CHANGES THE PLAYER TURN
  function setPlayerTurn($playerid, $gameid)
  {
    global $conn;

    $sql = "UPDATE games SET playerId = $playerid WHERE gameId = $gameid";

    if($conn->query($sql) != TRUE)
    	error_log("MYSQL error msg: " .  $conn->error . "\n") ;

    $conn->close();
  }

//################################################## MAIN WEBSERVICE CODE ##################################################

  connect(); // to DB


  $func = isset($_REQUEST['func']) ? mysqli_real_escape_string($conn, $_REQUEST['func']) : "";
  $gameid = isset($_REQUEST['gameid']) ? mysqli_real_escape_string($conn, $_REQUEST['gameid']) : 0;
  $tileid = isset($_REQUEST['tileid']) ? mysqli_real_escape_string($conn, $_REQUEST['tileid']) : 0;
  $playerid = isset($_REQUEST['playerid']) ? mysqli_real_escape_string($conn, $_REQUEST['playerid']) : 0;
  $total = isset($_REQUEST['total']) ? mysqli_real_escape_string($conn, $_REQUEST['total']) : 0;
  $rows = isset($_REQUEST['rows']) ? mysqli_real_escape_string($conn, $_REQUEST['rows']) : 0;
  $cols = isset($_REQUEST['cols']) ? mysqli_real_escape_string($conn, $_REQUEST['cols']) : 0;
  $mines = json_decode(isset($_REQUEST['mines']) ? mysqli_real_escape_string($conn, $_REQUEST['mines']) : 0);
  $gametype = json_decode(isset($_REQUEST['gametype']) ? mysqli_real_escape_string($conn, $_REQUEST['gametype']) : 0);
  //$mines = json_decode($_GET['mines']);

  error_log("func is $func and gameid is $gameid and tileid is $tileid and playerid is $playerid");

  $response = 0;

  switch($func)
  {
    case 'turn' :
      insertGameTurn($gameid, $total, $playerid, $gametype); break;
    case 'quad1' :
      insertGame1vs2($gameid, $rows, $cols, $gametype); break;
    case 'quad2' :
      insertGame3vs4($gameid, $rows, $cols, $gametype); break;
    case 'changeTurn' :
      updatePlayerTurn($playerid, $gameid); break;
    case 'exposed' :
      updateTileExposure($gameid, $tileid); break;
    case 'mine' :
      insertMine($gameid, $tileid); break;
    case 'setMines' :
      insertMines($gameid, $mines); break;
    case 'gameOver' :
      setToGameOver($gameid); break;
    case 'changeTurn' :
      setPlayerTurn($playerid, $gameid); break;
    default : break; // and do nothing else, as the response JSON will be default (0)
  }

  header('Content-Type: application/json; charset=utf-8');
  /*
  $responseJSON = json_encode($response);

  echo $responseJSON;
  */
  disconnect(); // from DB

?>
