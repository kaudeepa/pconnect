<?php
// update for default_value.
// check for checkbox, dropdown, click and radio buttons.

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/initialize', 'initSession');
$app->get('/fields', 'getFields');
$app->post('/setfields', 'setFields');
$app->post('/fetchcontent', 'fetchRemoteContent');
$app->get('/fieldswithvalues', 'getFieldsWithValues');
$app->put('/fields', 'updateFieldsWithValues');
$app->delete('/fields',	'deleteFields');

$app->run();

function initSession(){
	$request = Slim::getInstance()->request();	
	$user_agent = $request->headers('User-Agent');
	$page_url = $request->headers('Referer');
	
	$cookies    = $request->cookies();
	if (array_key_exists('PROS_COOKIE', $cookies)) {
			$session_id = $cookies['PROS_COOKIE'];
	}
	else{
			Slim::getInstance()->setCookie('PROS_COOKIE', $cookies['PHPSESSID'], '1 day');
			$session_id = $cookies['PHPSESSID'];
			echo "cookie was not set";
			$fields_lessvalue = getLocalFields($page_url);
			$data = json_decode($fields_lessvalue);
			foreach ($data as $field) {
				$sql = "INSERT INTO fields_useractivity (unique_id, id, name, type, html, value, default_value, page_url, session_id) VALUES (:unique_id, :id, :name, :type, :html, :value, :default_value, :page_url, :session_id)";
				try {
						$db = getConnection();
						$stmt = $db->prepare($sql);
						$stmt->bindParam("unique_id", $field->unique_id);
						$stmt->bindParam("id", $field->id);
						$stmt->bindParam("name", $field->name);
						$stmt->bindParam("type", $field->type);
						$stmt->bindParam("html", $field->html);
						$stmt->bindParam("value", $field->value);
						$stmt->bindParam("default_value", $field->default_value);
						$stmt->bindParam("page_url", $page_url);
						$stmt->bindParam("session_id", $session_id);
						$stmt->execute();
						$db = null;
						echo json_encode($field);
						echo "initialized";
					} catch(PDOException $e) {
						echo '{"error":{"text":'. $e->getMessage() .'}}';
				}
			}
	}
	
	echo $session_id;

}

function getFields(){
	$request = Slim::getInstance()->request();	
	$user_agent = $request->headers('User-Agent');
	$page_url = $request->headers('Referer');
	
	$sql = "select * FROM fields_metadata where page_url =:page_url" ;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("page_url", $page_url);
		$stmt->execute();
		$fields = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"fields": ' . json_encode($fields) . '}';
		return json_encode($fields);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function deleteFields(){
	$request = Slim::getInstance()->request();	
	$user_agent = $request->headers('User-Agent');
	$page_url = $request->headers('Referer');
	
	$sql = "delete FROM fields_metadata where page_url =:page_url";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("page_url", $page_url);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function fetchRemoteContent(){
	
	$request = Slim::getInstance()->request();	
	$body = $request->getBody();
	$data = json_decode($body);	
	$page_url = $data->page_url;
	echo $page_url;	
	if($page_url){
			$str = file_get_contents($page_url); // while testing with local files.
		//	$str = get_web_page($page_url); // for outside pages.
			echo $str;
		}
	else{
		echo 'Error: No url provided!';
	}
}

function getLocalFields($page_url){	
	$sql = "select * FROM fields_metadata where page_url =:page_url" ;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("page_url", $page_url);
		$stmt->execute();
		$fields = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"fields": ' . json_encode($fields) . '}';
		return json_encode($fields);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getFieldsWithValues(){
	$request = Slim::getInstance()->request();
	$page_url = $request->headers('Referer');
	$cookies    = $request->cookies();
	if (array_key_exists('PROS_COOKIE', $cookies)) {
			$session_id = $cookies['PROS_COOKIE'];
	}
	$sql = "select * FROM fields_useractivity where page_url =:page_url and session_id =:session_id" ;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("page_url", $page_url);
		$stmt->bindParam("session_id", $session_id);
		$stmt->execute();
		$fields = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"fields": ' . json_encode($fields) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function deleteLocalFields($page_url){
	$sql = "delete FROM fields_metadata where page_url =:page_url";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("page_url", $page_url);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function setFields(){
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$data = json_decode($body);
	$page_url = $data->page_url;
	$fields = $data->fields;
	if($page_url){
		deleteLocalFields($page_url);
	}
	$idx = 0;
	foreach ($fields as $field) {
		$sql = "INSERT INTO fields_metadata (unique_id, id, name, type, html, value, default_value, page_url) VALUES (:unique_id, :id, :name, :type, :html, :value, :default_value, :page_url)";
		try {
			$unique_id = $page_url . "_field_" . $idx;
			echo $unique_id;
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("unique_id", $unique_id);
			$stmt->bindParam("id", $field->id);
			$stmt->bindParam("name", $field->name);
			$stmt->bindParam("type", $field->type);
			$stmt->bindParam("html", $field->html);
			$stmt->bindParam("value", $field->value);
			$stmt->bindParam("default_value", $field->default_value);
			$stmt->bindParam("page_url", $page_url);
			$idx++;
			$stmt->execute();
			$db = null;
			echo json_encode($field);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}
}

function updateFieldsWithValues() {
		
	// find PROS_COOKIE values and update the table only for values and uid.
	$request = Slim::getInstance()->request();
	$page_url = $request->headers('Referer');
	$cookies    = $request->cookies();
	if (array_key_exists('PROS_COOKIE', $cookies)) {
			$session_id = $cookies['PROS_COOKIE'];
	}
	$body = $request->getBody();
	$data = json_decode($body);
	foreach ($data as $field) {
		$sql = "UPDATE fields_useractivity SET value=:value WHERE session_id=:session_id and page_url=:page_url and unique_id=:unique_id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("session_id", $session_id);
		$stmt->bindParam("value", $field->value);
		$stmt->bindParam("unique_id", $field->unique_id);
		$stmt->bindParam("page_url", $page_url);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	}
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="g0lyr1s";
	$dbname="cc";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}


function get_web_page( $url )
{
    $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    );

    $ch      = curl_init( $url );
    curl_setopt_array( $ch, $options );
    $content = curl_exec( $ch );
    $err     = curl_errno( $ch );
    $errmsg  = curl_error( $ch );
    $header  = curl_getinfo( $ch );
    curl_close( $ch );

    $header['errno']   = $err;
    $header['errmsg']  = $errmsg;
    $header['content'] = $content;
    return $header['content'];
}
?>