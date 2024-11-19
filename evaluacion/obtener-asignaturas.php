<?php
include "../conexion.php"; 

// Establecer encabezado para respuesta JSON
header('Content-Type: application/json');

try {
    $sql = "SELECT id_asignatura, nombre FROM asignaturas"; 
    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $asignaturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($asignaturas);

} catch (PDOException $e) {
    // Manejo del error
    echo json_encode(["error" => "Error al obtener asignaturas: " . $e->getMessage()]);
}
?>
