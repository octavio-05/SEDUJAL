<?php
include "../conexion.php"; 

$sql = "SELECT id_docente, nombre FROM docentes"; 
$stmt = $conexion->prepare($sql);
$stmt->execute();
$carreras = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($carreras);
?>
