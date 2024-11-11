<?php
include "../conexion.php";

// Consulta de los datos en SQL
$sql = "SELECT a.id_asignatura, a.nombre, d.nombre AS nombre_docente, a.cuatrimestre, c.nombre AS nombre_carrera 
        FROM asignaturas a
        JOIN docentes d ON a.id_docente = d.id_docente
        JOIN carreras c ON a.id_carrera = c.id_carrera";
$stmt = $conexion->prepare($sql);
$stmt->execute();
$resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Convertir a JSON y mostrar
echo json_encode($resultados);
?>
