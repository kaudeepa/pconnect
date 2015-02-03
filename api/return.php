<?php

if ($_POST['session_id'] == 'xxxx' )
    echo ('{"welcome.htm": "John","search.htm" : "Smith","findacruise.htm": 25}');
else
    readfile('samplePage2.html');
	
?>

