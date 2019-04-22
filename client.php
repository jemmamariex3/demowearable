<?php
/**
 * Created by PhpStorm.
 * User: JemmaMarie
 * Date: 2/26/19
 * Time: 4:08 PM
 */

if(!empty($_POST['user_id'])){
    $data = array();

    //database details
    $servername = "localhost";
    $username = "wearteam";
    $password = "w3@r@b!e5";
    $dbname = "wearables";

    //create connection and select DB
    $db = new mysqli($servername, $username, $password, $dbname);
    if($db->connect_error){
        die("Unable to connect database: " . $db->connect_error);
    }

    //get user data from the database
    $query = $db->query("SELECT data, time FROM gsr_rate_table WHERE ID = ? ORDER BY time DESC LIMIT 1");

    if($query->num_rows > 0){
        $userData = $query->fetch_assoc();
        $data['status'] = 'ok';
        $data['result'] = $userData;
    }else{
        $data['status'] = 'err';
        $data['result'] = '';
    }

    //returns data as JSON format
    echo json_encode($data);
}
?>