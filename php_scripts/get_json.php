<?php

$test_json = array(
    'a' => 100,
    'name' => 'John2',
    'surname' => 'Smith',
    'gender' => 'mr.',
    'trips' => array(1,2,3,4,5,6)
);

header('content-type: application/json');
// -> memcache_add

echo json_encode($test_json);

?>
