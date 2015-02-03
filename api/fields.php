<?php
function get_fields()
{
    $fields = '{ "fields": [ { "is_enabled": true, "elementType": "clickables", "id": "link1", "name": "not available", "default_val": "not available" }, 
{ "is_enabled": true, "elementType": "clickables", "id": "link2", "name": "not available", "default_val": "not available" },
 { "is_enabled": true, "elementType": "textfields", "id": "idText1", "name": "name1", "default_val": "not available" }, 
{ "is_enabled": true, "elementType": "textfields", "id": "not available", "name": "name2", "default_val": "not available" },
 { "is_enabled": true, "elementType": "textareas", "id": "not available", "name": "Address1", "default_val": "not available" }, 
{ "is_enabled": true, "elementType": "textareas", "id": "not available", "name": "Address2", "default_val": "not available" }], "Url": "samplePage1.html", "is_enabled": true }';
  return $fields;
}

$fields = get_fields($url);
echo $fields;
?>
