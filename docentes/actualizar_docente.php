<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se han enviado todos los datos necesarios
if (isset($_POST['id_docente']) && isset($_POST['nombre'])) {
    // Obtener los datos enviados
    $id_docente = $_POST['id_docente'];
    $nombre = $_POST['nombre'];

    try {
        // Preparar y ejecutar la consulta de actualización
        $sql = "UPDATE docentes SET nombre = :nombre WHERE id_docente = :id_docente";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':id_docente', $id_docente, PDO::PARAM_INT); // Asegurar el tipo de parámetro

        // Ejecutar la consulta y verificar si fue exitosa
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Docente actualizado exitosamente"]);
        } else {
            error_log("Error al actualizar el docente: " . implode(":", $stmt->errorInfo()));
            echo json_encode(["status" => "error", "message" => "Error al actualizar el docente"]);
        }
    } catch (PDOException $e) {
        // Manejo de errores
        error_log("Error en la base de datos: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Error al actualizar el docente"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
