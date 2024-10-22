<?php
include ("conexion.php");

$sql = "select * from carreras";

$result = mysqli_query($conexion, $sql);

$data = array();

    while($row = mysqli_fetch_assoc($result)){
        $data [] = $row;
    }
    echo json_encode($data);


?>