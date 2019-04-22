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


//########################
//### INSERT FUNCTIONS ###
//########################

  function insertLatestHeartRate($player,$data,$time)
  {
    global $conn;

    $sql = "INSERT INTO heart_rate_table (id, data, time) VALUES ($player, $data, $time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "player: " . $player . " heart rate: " . $data . " inserted.";
      else
        $insertResponse = "player: " . $player . " heart rate failed to insert.";

    $conn->close();
    return $insertResponse;
  }

  function insertLatestSkinTemp($player,$data,$time)
  {
    global $conn;

    $sql = "INSERT INTO skin_temp_table (id, data, time) VALUES ($player, $data, $time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "player: " . $player . " skin temp: " . $data . " inserted.";
      else
        $insertResponse = "player: " . $player . " skin temp failed to insert.";
 
    $conn->close();
    return $insertResponse;
  }

  function insertLatestGSR($player,$data,$time)
  {
    global $conn;

    $sql = "INSERT INTO gsr_rate_table (id, data, time) VALUES ($player, $data, $time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "player: " . $player . " gsr rate: " . $data . " inserted.";
      else
        $insertResponse = "player: " . $player . " gsr rate failed to insert.";

    $conn->close();
    return $insertResponse;
  }

  function insertLatestAL($player,$data,$time)
  {
    global $conn;

    $sql = "INSERT INTO ambient_light_table (id, data, time) VALUES ($player, $data, $time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "player: " . $player . " ambient light: " . $data . " inserted.";
      else
        $insertResponse = "player: " . $player . " ambient light failed to insert.";

    $conn->close();
    return $insertResponse;
  }

  function insertLatestAC($player, $dataX, $dataY, $dataZ, $time)
  {
    global $conn;

    $sql = "INSERT INTO accelerometer_table (id, dataX, dataY, dataZ, time) VALUES ($player, $dataX, $dataY, $dataZ, $time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "player: " . $player . " accelerometer data " . $data . " inserted.";
      else
        $insertResponse = "player: " . $player . " accelerometer data failed to insert.";

    $conn->close();
    return $insertResponse;
  }

  function insertLatestBA($player,$data,$time)
  {
    global $conn;

    $sql = "INSERT INTO breath_amp_table (id, data, time) VALUES ($player, $data, $time)";

      if($conn->query($sql) === TRUE)
        $insertResponse = "player: " . $player . " breath amplitude: " . $data . " inserted.";
      else
        $insertResponse = "player: " . $player . " breath amplitude failed to insert.";

    $conn->close();
    return $insertResponse;
  }

  function insertRemoteAddress($time, $ipaddress)
  {
    global $conn;

    $sql = "INSERT INTO players (time, ip) VALUES ($time, '$ipaddress')";

      if($conn->query($sql) === TRUE)
        $insertResponse = $ipaddress;
      else
        $insertResponse = "failed to insert time and ip";

    $conn->close();
    return $insertResponse;
  }

  function removeRemoteAddress($ipaddress)
  {
    global $conn;

    $sql = "DELETE FROM players WHERE ip = '$ipaddress'";

      if($conn->query($sql) === TRUE)
        $insertResponse = $ipaddress . " deleted";
      else
        $insertResponse = "failed to delete ip address" + $ipaddress;

    $conn->close();
    return $insertResponse;
  }

  function deletePlayersTable()
  {
    global $conn;

    $sql = "truncate players";

      if($conn->query($sql) === TRUE)
        $insertResponse = "players table cleared";
      else
        $insertResponse = "failed to clear ";

    $conn->close();
    return $insertResponse;

  }

//######### MAIN code of web service#########

  connect(); // to DB


  $func = isset($_REQUEST['func']) ? mysqli_real_escape_string($conn, $_REQUEST['func']) : "";
  $player = isset($_REQUEST['player']) ? mysqli_real_escape_string($conn, $_REQUEST['player']) : 0;
  $data = isset($_REQUEST['data']) ? mysqli_real_escape_string($conn, $_REQUEST['data']) : 0;
  $dataX = isset($_REQUEST['dataX']) ? mysqli_real_escape_string($conn, $_REQUEST['dataX']) : 0;
  $dataY = isset($_REQUEST['dataY']) ? mysqli_real_escape_string($conn, $_REQUEST['dataY']) : 0;
  $dataZ = isset($_REQUEST['dataZ']) ? mysqli_real_escape_string($conn, $_REQUEST['dataZ']) : 0;
  $time = isset($_REQUEST['time']) ? mysqli_real_escape_string($conn, $_REQUEST['time']) : 0;
  $ipaddress = isset($_REQUEST['ipaddress']) ? mysqli_real_escape_string($conn, $_REQUEST['ipaddress']) : 0;

  error_log("func is $func and player is $players and $time is time");

  $response = 0;

  switch($func) {
    case 'gsr' :
      $response = insertLatestGSR($player,$data,$time); break;
    case 'hr' :
      $response = insertLatestHeartRate($player,$data,$time); break;
    case 'skintemp' :
      $response = insertLatestSkinTemp($player,$data,$time); break;
    case 'al' :
      $response = insertLatestAL($player,$data,$time); break;
    case 'ac' :
      $response = insertLatestAC($player, $dataX, $dataY, $dataZ, $time); break;
    case 'ba' :
      $response = insertLatestBA($player,$data,$time); break;
    case 'insertIp' :
      $response = insertRemoteAddress($time, $ipaddress); break;
    case 'removeIp' :
      $response = removeRemoteAddress($ipaddress); break;
    case 'deletePlayers' :
      $response = deletePlayersTable(); break;
    default :
      break; // and do nothing else, as the response JSON will be default (0)
  }

  header('Content-Type: application/json; charset=utf-8');
  $responseJSON = json_encode($response);

  echo $responseJSON;

  disconnect(); // from DB

?>
