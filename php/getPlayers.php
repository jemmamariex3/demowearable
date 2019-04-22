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

//########################################
//### GET LATEST AND ALL GSR FUNCTIONS ###
//########################################

  // GOOD
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
        // $response = $data . "," . $time;
        $array = array('data' => $data, 'time' => $time);
        $response = json_encode($array, JSON_FORCE_OBJECT);
      }

    }
    $stmt->close();
    return $response;
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

  function getAllGSRByTime($start, $end)
  {
    global $conn;
    $sql = "SELECT * FROM `gsr_rate_table` WHERE `time` BETWEEN '$start' AND '$end'
      ORDER BY `id` ASC, `time` ASC";
    $result = $conn->query($sql);
    echo $result;
    return $result->fetch_all();
  }

//###############################################
//### GET LATEST AND ALL HEART RATE FUNCTIONS ###
//###############################################
  // Create new wearables!!!
  // parse data from json.

  // GOOD
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
        // $response = $data . "," . $time;
        $array = array('data' => $data, 'time' => $time);
        $response = json_encode($array, JSON_FORCE_OBJECT);
        
      }
    }
    $stmt->close();
    return $response;
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

  function getAllHRByTime($start, $end)
  {
    global $conn;
    $sql = "SELECT * FROM `heart_rate_table` WHERE `time` BETWEEN '$start' AND '$end'
      ORDER BY `id` ASC, `time` ASC";
    $result = $conn->query($sql);
    return $result->fetch_all();
  }

//##############################################
//### GET LATEST AND ALL SKIN TEMP FUNCTIONS ###
//##############################################

  // GOOD
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
    // return $temp . "," . $time;
    $data = $temp;
    $array = array('data' => $data, 'time' => $time);
    $response = json_encode($array, JSON_FORCE_OBJECT);
    return $response;
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

  function getAllSkinByTime($start, $end)
  {
    global $conn;
    $sql = "SELECT * FROM `skin_temp_table` WHERE `time` BETWEEN '$start' AND '$end'
      ORDER BY `id` ASC, `time` ASC";
    $result = $conn->query($sql);
    return $result->fetch_all();
  }

  //##################################################
  //### GET LATEST AND ALL ACCELEROMETER FUNCTIONS ###
  //##################################################

  // GOOD
  function getLatestACForPlayer($player)
  {
    global $conn;
    $ac = -1;
    $stmt = $conn->prepare("SELECT dataX, dataY, dataZ, time FROM accelerometer_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($dataX, $dataY, $dataZ, $time);
      while($row = $stmt->fetch())
      {
        $response = $dataX . "," . $dataY . "," . $dataZ . "," . $time;
        $array = array('dataX' => $dataX, 'dataY' => $dataY, 'dataZ' => $dataZ, 'time' => $time);
    
      }
    }
    $stmt->close();

    $response = json_encode($array, JSON_FORCE_OBJECT);
    return $response;
  }

  function getAllACByTime($start, $end) {
    global $conn;
    $sql = "SELECT * FROM `accelerometer_table` WHERE `time` BETWEEN '$start' AND '$end'
      ORDER BY `id` ASC, `time` ASC";
    $result = $conn->query($sql);
    return $result->fetch_all();
  }

  //#####################################################
  //### GET LATEST AND ALL BREATH AMPLITUDE FUNCTIONS ###
  //#####################################################

  function getLatestBAForPlayer($player)
  {
    global $conn;
    $ba = -1;
    $stmt = $conn->prepare("SELECT data, time FROM breath_amp_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($data, $time);
      while($row = $stmt->fetch())
      {
        // $response = $data . "," . $time;
        $array = array('data' => $data, 'time' => $time);
        $response = json_encode($array, JSON_FORCE_OBJECT);
      }
    }
    $stmt->close();
    return $response;
  }

  function getAllBAForPlayers()
  {
    global $conn;
    $sql = "SELECT id, data, time FROM breath_amp_table ORDER BY time DESC";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = "ID: " . $row["id"] . " - Data: " . $row["data"] . " - Time " . $row["time"]. "<br>";
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

  function getAllBAByTime($start, $end)
  {
    global $conn;
    $sql = "SELECT * FROM `breath_amp_table` WHERE `time` BETWEEN '$start' AND '$end'
      ORDER BY `id` ASC, `time` ASC";
    $result = $conn->query($sql);
    return $result->fetch_all();
  }

  //##################################################
  //### GET  ALL AMBIENT LIGHT FUNCTIONS ###
  //##################################################

    function getLatestALForPlayer($player)
  {
    global $conn;
    $al = -1;
    $stmt = $conn->prepare("SELECT data, time FROM ambient_light_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
      $stmt->bind_result($data, $time);
      while($row = $stmt->fetch())
      {
        $al = $data;
      }
    }
    $stmt->close();

    return $al;
  }

  //##################################################
  //### OTHER FUNCTIONS ###
  //##################################################

  function getPlayerAddresses()
  {
    global $conn;
    $sql = "SELECT time, ip FROM players ORDER BY time ASC";
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0)
    {
      //output data of each row
      for($i = 1; $row = $result->fetch_assoc(); $i++)
        $array[] = $row["time"] . " : " . $row["ip"];
    }
    else
      echo "0 results " . $conn->error;

    $result->close();
    return $array;
  }

  function getMyIpAddress()
  {
    global $conn;
    $myIp = $_SERVER['REMOTE_ADDR'];
    return $myIp;
  }

//######### MAIN code of web service#########

  connect(); // to DB


  $func = isset($_REQUEST['func']) ? mysqli_real_escape_string($conn, $_REQUEST['func']) : "";
  $player = isset($_REQUEST['player']) ? mysqli_real_escape_string($conn, $_REQUEST['player']) : 0;
  $start = isset($_REQUEST['start']) ? mysqli_real_escape_string($conn, $_REQUEST['start']) : 0;
  $end = isset($_REQUEST['end']) ? mysqli_real_escape_string($conn, $_REQUEST['end']) : 0;

  error_log("func is $func and player is $players");

  $response = 0;

  switch($func) {
    case 'gsr' :
      $response = getLatestGSRForPlayer($player); break;
    case 'hr' :
      $response = getLatestHRForPlayer($player); break;
    case 'skintemp' :
      $response = getLatestSkinTempForPlayer($player); break;
    case 'al' :
      $response = getLatestALForplayer($player); break;
    case 'ac' :
      $response = getLatestACForplayer($player); break;
    case 'ba' :
      $response = getLatestBAForplayer($player); break;
    case 'allHR' :
      $response = getAllHRForPlayers(); break;
    case 'allSkin' :
      $response = getAllSkinForPlayers(); break;
    case 'allGSR' :
      $response = getAllGSRForPlayers(); break;
    case 'allBA' :
      $response = getAllBAForPlayers(); break;
    case 'allHRTime':
      $response = getAllHRByTime($start, $end); break;
    case 'allGSRTime':
      $response = getAllGSRByTime($start, $end); break;
    case 'allSkinTime':
      $response = getAllSkinByTime($start, $end); break;
    case 'allACTime':
      $response = getAllACByTime($start, $end); break;
    case 'allBATime':
      $response = getAllBAByTime($start, $end); break;
    case 'getPlayers' :
      $response = getPlayerAddresses(); break;
    case 'getMyIp' :
      $response = getMyIpAddress(); break;
    default :
      break; // and do nothing else, as the response JSON will be default (0)
  }

  header('Content-Type: application/json; charset=utf-8');
  $responseJSON = json_encode($response);

  echo $responseJSON;

  disconnect(); // from DB
?>
