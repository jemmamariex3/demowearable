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

//############################################## PLAYER HEALTH RELATED FUNCTIONS ###################################################\\

//########################################
//### GET LATEST AND ALL GSR FUNCTIONS ###
//########################################

  function getLatestGSRForPlayer($player)
  {
    global $conn;
    $gsr = -1;
    $stmt = $conn->prepare("SELECT data, time FROM gsr_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($data, $time);
      while($row = $stmt->fetch())
      {
        $gsr = $data;
      }
    }
    $stmt->close();
    return $gsr;
  }

  function getAllGSRForPlayers()
  {
    global $conn;
    $sql = "SELECT id, data, time FROM gsr_rate_table ORDER BY time DESC";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        // $array[] = "ID: " . $row["id"] . " - Data: " . $row["data"] . " - Time " . $row["time"]. "<br>";
        $array[] = $row["id"] . "," . $row["data"] . "," . $row["time"];
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

//###############################################
//### GET LATEST AND ALL HEART RATE FUNCTIONS ###
//###############################################

  function getLatestHRForPlayer($player)
  {
    global $conn;
    $hr = -1;
    $stmt = $conn->prepare("SELECT data, time FROM heart_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($data, $time);
      while($row = $stmt->fetch())
      {
        $hr = $data;
      }
    }
    $stmt->close();
    return $hr;
  }

  function getLatestSkinTimeForPlayers($player)
  {
    global $conn;
    $temp = -1;
    $stmt = $conn->prepare("SELECT data, time FROM skin_temp_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
        $stmt->bind_result($temp, $time);
        $arr = array();
        while($row = $stmt->fetch())
      {
          if ($temp != -1)  // convert from Celsius to Fahrenheit
          {
              $temp = $temp * 9 / 5 + 32;
          }

          $arr["temp"] = $temp;
          $arr["time"] = $time;
      }
    }
    $stmt->close();

    return $arr;
  }


  function getLatestHRTimeForPlayers($player)
  {
    global $conn;
    $hr = -1;
    $stmt = $conn->prepare("SELECT data, time FROM heart_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($hr, $time);
      $arr = array();
      while($row = $stmt->fetch())
      {
          $arr["hr"] = $hr;
          $arr["time"] = $time;
      }
    }
    $stmt->close();
    return $arr;
  }


  function getLatestGSRTimeForPlayers($player)
  {
    global $conn;
    $gsr = -1;
    $stmt = $conn->prepare("SELECT data, time FROM gsr_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($gsr, $time);
      $arr = array();
      while($row = $stmt->fetch())
      {
          $arr["gsr"] = $gsr;
          $arr["time"] = $time;
      }
    }
    $stmt->close();
    return $arr;
  }

  function getAllHRForPlayers()
  {
    global $conn;
    $sql = "SELECT id, data, time FROM heart_rate_table ORDER BY time DESC";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = "ID: " . $row["id"] . " - Data: " . $row["data"] . " - Time " . $row["time"]. "<br>";
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

//##############################################
//### GET LATEST AND ALL SKIN TEMP FUNCTIONS ###
//##############################################

  function getLatestSkinTempForPlayer($player)
  {
    global $conn;
    $temp = -1;
    $stmt = $conn->prepare("SELECT data, time FROM skin_temp_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($data, $time);
      while($row = $stmt->fetch())
      {
        $temp = $data;
      }
    }
    $stmt->close();

    if ($temp != -1)  // convert from Celsius to Fahrenheit
    {
      $temp = $temp * 9 / 5 + 32;
    }
    return $temp;
  }

  function getAllSkinForPlayers()
  {
    global $conn;
    $sql = "SELECT id, data, time FROM skin_temp_table ORDER BY time DESC";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = "ID: " . $row["id"] . " - Data: " . $row["data"] . " - Time " . $row["time"]. "<br>";
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

//############################################## MINESWEEPER RELATED FUNCTIONS ###################################################\\

  function getLatestGameStateForPlayer($player)
  {
    global $conn;
    $elapsed = -1;
    $tilesTurned = -1;
    $minesFlagged = -1;

    $stmt = $conn->prepare("SELECT elapsedTime, tilesTurned, minesFlagged FROM gameState where ID = ? ORDER BY elapsedTime DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($elapsed, $tilesTurned, $minesFlagged);
      while($row = $stmt->fetch());
    }
    $stmt->close();

    return array('elapsedTime' => $elapsed , 'tilesTurned' => $tilesTurned,
                         'minesFlagged' => $minesFlagged);
  }


  function resetGameStateForPlayer($player)
  {
    global $conn;

    $stmt = $conn->prepare("UPDATE gameState SET elapsedTime = 0, tilesTurned = 0, minesFlagged = 0 where ID = ?");
    $stmt->bind_param('i', $player);
    $stmt->execute();
    $stmt->close();
  }


  function updateGameStateForPlayer($player, $elapsedTime, $tilesTurned, $minesFlagged)
  {
    global $conn;

    $stmt = $conn->prepare("UPDATE gameState SET elapsedTime = ?, tilesTurned = ?, minesFlagged = ? WHERE ID = ?");
    $stmt->bind_param("iiii", $elapsedTime, $tilesTurned, $minesFlagged, $player);
    if (! $stmt->execute())
      error_log("MYSQL error msg: " .  $conn->error . "\n") ;
    $stmt->close();

  }

  function getLatestGameStatus()
  {
    global $conn;
    $gameState = -1;
    $stmt = $conn->prepare("SELECT gameState FROM games ORDER BY gameId DESC LIMIT 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $gameState = $data;
      }
    }
    $stmt->close();

    return $gameState;
  }

  function getLatestGameId()
  {
    global $conn;
    $gameId = -1;
    $stmt = $conn->prepare("SELECT gameId FROM games ORDER BY gameId DESC LIMIT 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $gameId = $data;
      }
    }
    $stmt->close();

    return $gameId;
  }

  function getAllTileMines($gameid)
  {
    global $conn;
    $sql = "SELECT matrixTile FROM games where gameId = $gameid AND mine = 1";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = $row["matrixTile"];
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

  function getAllTileExposures($gameid)
  {
    global $conn;
    $sql = "SELECT matrixTile FROM games where gameId = $gameid AND exposure = 1";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = $row["matrixTile"];
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

  function getTileExposure($gameid, $tileid)
  {
    global $conn;
    $tileExposure = -1;
    $stmt = $conn->prepare("SELECT exposure FROM games WHERE gameId = $gameid AND matrixTile = $tileid");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $tileExposure = $data;
      }
    }
    $stmt->close();

    return $tileExposure;
  }

  function getCurrentPlayerTurn($gameid)
  {
    global $conn;
    $playerTurn = -1;
    $stmt = $conn->prepare("SELECT playerId FROM games WHERE gameId = $gameid ORDER BY gameId ASC LIMIT 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $playerTurn = $data;
      }
    }
    $stmt->close();

    return $playerTurn;
  }

//############################################## 2 PLAYER GET FUNCTIONS  ###################################################\\

  function getPvPGameStatus($player1id, $player2id)
  {
    global $conn;
    $gameState = -1;
    $stmt = $conn->prepare("SELECT gameState FROM games where playerId = $player1id OR playerId = $player2id ORDER BY gameId DESC LIMIT 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $gameState = $data;
      }
    }
    $stmt->close();

    return $gameState;
  }

  function getPvPGameId($player1id, $player2id)
  {
    global $conn;
    $game_id_pvp = -1;
    $stmt = $conn->prepare("SELECT gameId FROM games where playerId = $player1id OR playerId = $player2id AND gameState = 1 ORDER BY gameId DESC LIMIT 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $game_id_pvp = $data;
      }
    }
    $stmt->close();

    return $game_id_pvp;
  }

  function getExplodedStatus($player1id, $player2id)
  {
    global $conn;
    $status = -1;
    $stmt = $conn->prepare("SELECT matrixTile FROM games where (playerId = $player1id OR playerId = $player2id) AND gameState = 1 AND mine = 1 AND exposure = 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $status = $data;
      }
    }
    $stmt->close();

    return $status;
  }

  //function getGameType #
  function getGameType($player1id, $player2id)
  {
    global $conn;
    $type = -1;
    $stmt = $conn->prepare("SELECT gameType FROM games where (playerId = $player1id OR playerId = $player2id) AND gameState = 1");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $type = $data;
      }
    }
    $stmt->close();

    return $type;
  }

  function getTilePlayerId($gameid, $tileid)
  {
    global $conn;
    $player = -1;
    $stmt = $conn->prepare("SELECT playerId FROM games where gameId = $gameid AND matrixTile = $tileid");

    if($stmt->execute()) {
      $stmt->bind_result($data);
      while($row = $stmt->fetch())
      {
        $player = $data;
      }
    }
    $stmt->close();

    return $player;
  }


  function getAllGsrByPlayer($player) {
    global $conn;
    $sql = "SELECT * FROM gsr_rate_table WHERE id=$player ORDER BY time DESC";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = $row;
    }

    $result->close();
    return $array;
  }

//############################################## MAIN WEB SERVICE CODE ###################################################\\

  connect(); // to DB


  $func    = isset($_REQUEST['func']) ? mysqli_real_escape_string($conn, $_REQUEST['func']) : "";
  $player  = isset($_REQUEST['player']) ? mysqli_real_escape_string($conn, $_REQUEST['player']) : 0;
  $elapsed = isset($_REQUEST['elapsed']) ? mysqli_real_escape_string($conn, $_REQUEST['elapsed']) : 0;
  $tiles   = isset($_REQUEST['tiles']) ? mysqli_real_escape_string($conn, $_REQUEST['tiles']) : 0;
  $mines   = isset($_REQUEST['mines']) ? mysqli_real_escape_string($conn, $_REQUEST['mines']) : 0;
  $gameid  = isset($_REQUEST['gameid']) ? mysqli_real_escape_string($conn, $_REQUEST['gameid']) : 0;
  $tileid  = isset($_REQUEST['tileid']) ? mysqli_real_escape_string($conn, $_REQUEST['tileid']) : 0;
  $player1id = isset($_REQUEST['player1id']) ? mysqli_real_escape_string($conn, $_REQUEST['player1id']) : 0;
  $player2id = isset($_REQUEST['player2id']) ? mysqli_real_escape_string($conn, $_REQUEST['player2id']) : 0;



  error_log("func is $func and player is $player and elapsed is $elapsed and tiles is $tiles and mines is $mines");

  $response = 0;

  switch($func) {
    case 'gsr' :
      $response = getLatestGSRForPlayer($player); break;
    case 'hr' :
      $response = getLatestHRForPlayer($player); break;
    case 'skintemp' :
      $response = getLatestSkinTempForPlayer($player); break;
    case 'allHR' :
      $response = getAllHRForPlayers(); break;
    case 'allSkin' :
      $response = getAllSkinForPlayers(); break;
    case 'allGSR' :
      $response = getAllGSRForPlayers(); break;
    case 'getgame' :
      $response = getLatestGameStateForPlayer($player); break;
    case 'rstgame' :
      resetGameStateForPlayer($player); break;
    case 'updgame' :
      updateGameStateForPlayer($player, $elapsed, $tiles, $mines); break;
    case 'gameStatus' :
      $response = getLatestGameStatus(); break;
    case 'gameId' :
      $response = getLatestGameId(); break;
    case 'getMines' :
      $response = getAllTileMines($gameid); break;
    case 'getExposureAll' :
      $response = getAllTileExposures($gameid); break;
    case 'getExposure' :
      $response = getTileExposure($gameid, $tileid); break;
    case 'playerTurn' :
      $response = getCurrentPlayerTurn($gameid); break;
    case 'getGameStatusQuad' :
      $response = getPvPGameStatus($player1id, $player2id); break;
    case 'getGameIdQuad' :
      $response = getPvPGameId($player1id, $player2id); break;
    case 'exploded' :
      $response = getExplodedStatus($player1id, $player2id); break;
    case 'type' :
      $response = getGameType($player1id, $player2id); break;
    case 'playerTile' :
      $response = getTilePlayerId($gameid, $tileid); break;
    case 'hrTime' :
      $response = getLatestHRTimeForPlayers($player); break;
    case 'skinTime':
      $response = getLatestSkinTimeForPlayers($player); break;
    case 'gsrTime' :
      $response = getLatestGSRTimeForPlayers($player); break;
    case 'getAllGsrByPlayer':
      $response = getAllGsrByPlayer($player); break;
    default :
      break; // and do nothing else, as the response JSON will be default (0)
  }

  header('Content-Type: application/json; charset=utf-8');
  $responseJSON = json_encode($response);

  echo $responseJSON;

  disconnect(); // from DB
?>
