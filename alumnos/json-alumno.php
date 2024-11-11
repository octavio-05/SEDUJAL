<?php
include "../conexion.php";

// Consulta y conversión a JSON
$sql = "SELECT a.num_control, a.nombre, a.fecha_inscripcion, c.nombre AS nombre_carrera 
        FROM alumnos a 
        JOIN carreras c ON a.id_carrera = c.id_carrera";
$stmt = $conexion->prepare($sql);
$stmt->execute();
$resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Convertir a JSON y mostrar
$json = json_encode($resultados);
    echo $json;
?>




