<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se han enviado todos los datos necesarios
if (isset($_POST['nombre']) && isset($_POST['id_carrera'])) {
    // Obtener los datos enviados
    $id_carrera = $_POST['id_carrera']; // Se mantiene para identificar el registro a actualizar
    $nombre = $_POST['nombre'];

    // Preparar y ejecutar la consulta de actualización
    $sql = "UPDATE carreras SET nombre = :nombre WHERE id_carrera = :id_carrera";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':id_carrera', $id_carrera);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Carrera actualizada exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de actualización: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al actualizar la carrera"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
