<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si todos los datos necesarios han sido enviados
if (isset($_POST['id_carrera']) && isset($_POST['nombre']) ) {
    // Obtener los datos enviados
    $id_carrera = $_POST['id_carrera'];
    $nombre = $_POST['nombre'];


    // Preparar y ejecutar la consulta de inserción
    $sql = "INSERT INTO carreras (id_carrera, nombre) VALUES (:id_carrera, :nombre)";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_carrera', $id_carrera);
    $stmt->bindParam(':nombre', $nombre);


    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Carrera agregada exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al agregar la carrera"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
