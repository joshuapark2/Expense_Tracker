<?php
require_once('config.php');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$base_url = 'https://www.expensify.com/api';

// Get the API endpoint and parameters from the POST data
$postData = json_decode(file_get_contents('php://input'), true);
$command = $postData['command'];
$params = $postData['params'];

// Partner Credentials
$partnerName = 'applicant';
$partnerPassword = 'd7c3119c6cdab02d68d9';

// If the Authenticate command is called, use the partnerName and partnerPassword
if($command === 'Authenticate') {
    $params['partnerName'] = $partnerName;
    $params['partnerPassword'] = $partnerPassword;
}

// Convert the parameters array to a URL-encoded string
$params_str = http_build_query($params);

// Setup cURL
$ch = curl_init($base_url . "?command=" . $command);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params_str);

// Send the request
$response = curl_exec($ch);

// Check for errors
if($response === FALSE){
    die(json_encode(['error' => curl_error($ch)]));
}

// Print the date from the response
echo $response;
?>
