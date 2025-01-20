<?php

$REGION = 'br';  // If German region, set this to an empty string: ''
$BASE_HOSTNAME = 'storage.bunnycdn.com';
$HOSTNAME = (!empty($REGION)) ? "{$REGION}.{$BASE_HOSTNAME}" : $BASE_HOSTNAME;
$STORAGE_ZONE_NAME = 'front-banner';
$FILENAME_TO_UPLOAD = 'clima.json';
$ACCESS_KEY = 'a7d2ed49-b267-4578-b18ad7ad4443-2449-45af';
$FILE_PATH = 'https://weather-worker-json.coipo-labs.workers.dev/';  // Full path to your local file

//download file_path
$json_file = file_get_contents($FILE_PATH); 

//save local
file_put_contents('clima.json', $json_file);    

$local_file = 'clima.json';

$url = "https://{$HOSTNAME}/{$STORAGE_ZONE_NAME}/{$FILENAME_TO_UPLOAD}";

$ch = curl_init();

$options = array(
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_PUT => true,
  CURLOPT_INFILE => fopen($local_file, 'r'),
  CURLOPT_INFILESIZE => filesize($local_file),
  CURLOPT_HTTPHEADER => array(
    "AccessKey: {$ACCESS_KEY}",
    'Content-Type: application/octet-stream'
  )
);

curl_setopt_array($ch, $options);

$response = curl_exec($ch);

if (!$response) {
  die("Error: " . curl_error($ch));
} else {
  print_r($response);
}

curl_close($ch);

?>
