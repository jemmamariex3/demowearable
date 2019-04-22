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

function newGetLatestGSR($player) {




}

//########################################
//### GET LATEST GSR FUNCTION ############
//########################################

function getLatestGSRForPlayer($player)
{
    global $conn;
    $gsr = -1;

    // Look into app.
    // Make ascending
    $stmt = $conn->prepare("SELECT data, time FROM gsr_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
        $stmt->bind_result($data, $time);
        // change to while->if
      if($row = $stmt->fetch())
      {
        // $response = $data . "," . $time; '{data: $data,
        $array = array('data' => $data, 'time' => $time);
        $response =  $array; // return string
      }
//        // $response = $data . "," . $time; '{data: $data,
//        $array = array('data' => $data, 'time' => $time);
//        $response = json_encode($array, JSON_FORCE_OBJECT);

    }
    $stmt->close();
    return $response;
}

//###############################################
//### GET LATEST HEART RATE FUNCTION ############
//###############################################

function getLatestHRForPlayer($player)
{
    global $conn;
    $hr = -1;
    $stmt = $conn->prepare("SELECT data, time FROM heart_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
        $stmt->bind_result($data, $time);
        // change to while->if
        if($row = $stmt->fetch())
        {
            // $response = $data . "," . $time;
            $array = array('data' => $data, 'time' => $time);
//            $response = json_encode($array, JSON_FORCE_OBJECT);
            $response = $array;

        }
    }
    $stmt->close();
    return $response;
}

//##############################################
//### GET LATEST SKIN TEMP FUNCTIONS ###########
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
        // change to while->if
        if($row = $stmt->fetch())
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
    $response = $array;
    return $response;
}

//##################################################
//### GET LATEST ACCELEROMETER FUNCTIONS ###########
//##################################################

function getLatestACForPlayer($player)
{
    global $conn;
    $ac = -1;
    $stmt = $conn->prepare("SELECT dataX, dataY, dataZ, time FROM accelerometer_table WHERE ID = ? ORDER BY time DESC LIMIT 1");
    $stmt->bind_param('i', $player);
    if($stmt->execute()) {
        $stmt->bind_result($dataX, $dataY, $dataZ, $time);
        // change to while->if
        if($row = $stmt->fetch())
        {
            $response = $dataX . "," . $dataY . "," . $dataZ . "," . $time;
            $array = array('dataX' => $dataX, 'dataY' => $dataY, 'dataZ' => $dataZ, 'time' => $time);

        }
    }
    $stmt->close();

//    $response = json_encode($array, JSON_FORCE_OBJECT);
    $response =  $array;
    return $response;
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
            $response = $array;
        }
    }
    $stmt->close();
    return $response;
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
    default :
        break; // and do nothing else, as the response JSON will be default (0)
}

header('Content-Type: application/json; charset=utf-8');
$responseJSON = json_encode($response); // takes string encodes to json

echo $responseJSON;

disconnect(); // from DB
?>