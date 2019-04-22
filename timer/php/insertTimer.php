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
    $dbname = "game_timer";

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

//########################
//### INSERT FUNCTIONS ###
//########################

  function insert4PlayerTurnTimer($time)
  {
    global $conn;

    $sql = "INSERT INTO turn_timer (time) VALUES ($time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "timer: " . $timer . " inserted.";
      else
        $insertResponse = "timer: " . $timer . " not inserted.";

    $conn->close();
    return $insertResponse;
  }

  function insertCoop1vs2Timer($time)
  {
    global $conn;

    $sql = "INSERT INTO p1_p2_coop_timer (time) VALUES ($time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "timer: " . $timer . " inserted.";
      else
        $insertResponse = "timer: " . $timer . " not inserted.";

    $conn->close();
    return $insertResponse;
  }

  function insertCoop3vs4Timer($time)
  {
    global $conn;

    $sql = "INSERT INTO p3_p4_coop_timer (time) VALUES ($time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "timer: " . $timer . " inserted.";
      else
        $insertResponse = "timer: " . $timer . " not inserted.";

    $conn->close();
    return $insertResponse;
  }

  function insertTurn1vs2Timer($time)
  {
    global $conn;

    $sql = "INSERT INTO p1_p2_turn_timer (time) VALUES ($time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "timer: " . $timer . " inserted.";
      else
        $insertResponse = "timer: " . $timer . " not inserted.";

    $conn->close();
    return $insertResponse;
  }

  function insertTurn3vs4Timer($time)
  {
    global $conn;

    $sql = "INSERT INTO p3_p4_turn_timer (time) VALUES ($time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "timer: " . $timer . " inserted.";
      else
        $insertResponse = "timer: " . $timer . " not inserted.";

    $conn->close();
    return $insertResponse;
  }

  function truncateTables($time)
  {
    global $conn;
    $intTime = (int)$time;
    $insertResponse = -1;
    if($intTime == 485)
    {
    $sql = "TRUNCATE turn_timer";

      if($conn->query($sql) === TRUE)
        $insertResponse = "tables truncated";
      else
        $insertResponse = "failed to truncate tables";

    $sql = "TRUNCATE p1_p2_coop_timer";

      if($conn->query($sql) === TRUE)
        $insertResponse = "tables truncated";
      else
        $insertResponse = "failed to truncate tables";

    $sql = "TRUNCATE p3_p4_coop_timer";

      if($conn->query($sql) === TRUE)
        $insertResponse = "tables truncated";
      else
        $insertResponse = "failed to truncate tables";

    $sql = "TRUNCATE p1_p2_turn_timer";

      if($conn->query($sql) === TRUE)
        $insertResponse = "tables truncated";
      else
        $insertResponse = "failed to truncate tables";

    $sql = "TRUNCATE p3_p4_turn_timer";

      if($conn->query($sql) === TRUE)
        $insertResponse = "tables truncated";
      else
        $insertResponse = "failed to truncate tables";

    $conn->close();
    }
    return $insertResponse;
 }

//######### MAIN code of web service#########

  connect(); // to DB

  $func = isset($_REQUEST['func']) ? mysqli_real_escape_string($conn, $_REQUEST['func']) : 0;
  $time = isset($_REQUEST['time']) ? mysqli_real_escape_string($conn, $_REQUEST['time']) : 0;

  error_log("time is $time");

  $response = 0;

  switch($func) {
    case '4player' :
      insert4PlayerTurnTimer($time); break;
    case 'coop1v2' :
      insertCoop1vs2Timer($time); break;
    case 'coop3v4' :
      insertCoop3vs4Timer($time); break;
    case 'turn1v2' :
      insertTurn1vs2Timer($time); break;
    case 'turn3v4' :
      insertTurn3vs4Timer($time); break;
    case 'clear' :
      truncateTables($time); break;
    default :
      break; // and do nothing else, as the response JSON will be default (0)
  }

  header('Content-Type: application/json; charset=utf-8');
  $responseJSON = json_encode($response);

  //echo $responseJSON;

  disconnect(); // from DB
?>
