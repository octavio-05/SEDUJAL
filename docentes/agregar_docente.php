<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si el nombre ha sido enviado
if (isset($_POST['nombre'])) {
    // Obtener los datos enviados
    $nombre = $_POST['nombre'];

    try {
        // Preparar y ejecutar la consulta de inserción
        $sql = "INSERT INTO docentes (nombre) VALUES (:nombre)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);

        // Ejecutar la consulta y verificar si fue exitosa
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Docente agregado exitosamente"]);
        } else {
            error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
            echo json_encode(["status" => "error", "message" => "Error al agregar el docente"]);
        }
    } catch (PDOException $e) {
        // Manejo de errores
        error_log("Error en la base de datos: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Error al agregar el docente"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
