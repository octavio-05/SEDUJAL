<?php
include "../conexion.php";

// Consulta y conversión a JSON
$sql = "SELECT * FROM docentes";
$stmt = $conexion->prepare($sql);
$stmt->execute();
$resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Convertir a JSON y mostrar
$json = json_encode($resultados);
    echo $json;
?>




