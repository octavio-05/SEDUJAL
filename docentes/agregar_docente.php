<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si todos los datos necesarios han sido enviados
if (isset($_POST['id_docente']) && isset($_POST['nombre'])) {
    // Obtener los datos enviados
    $id_docente = $_POST['id_docente'];
    $nombre = $_POST['nombre'];

    // Preparar y ejecutar la consulta de inserción
    $sql = "INSERT INTO docentes (id_docente, nombre) VALUES (:id_docente, :nombre)";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_docente', $id_docente);
    $stmt->bindParam(':nombre', $nombre);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Docente agregado exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al agregar el docente"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
