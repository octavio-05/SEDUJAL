<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si todos los datos necesarios han sido enviados
if (isset($_POST['nombre']) && isset($_POST['id_docente']) && isset($_POST['cuatrimestre']) && isset($_POST['id_carrera'])) {
    // Obtener los datos enviados
    $nombre = $_POST['nombre'];
    $id_docente = $_POST['id_docente'];
    $cuatrimestre = $_POST['cuatrimestre'];
    $id_carrera = $_POST['id_carrera'];

    try {
        // Preparar y ejecutar la consulta de inserción
        $sql = "INSERT INTO asignaturas (nombre, id_docente, cuatrimestre, id_carrera) VALUES (:nombre, :id_docente, :cuatrimestre, :id_carrera)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':id_docente', $id_docente);
        $stmt->bindParam(':cuatrimestre', $cuatrimestre);
        $stmt->bindParam(':id_carrera', $id_carrera);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Asignatura agregada exitosamente"]);
        } else {
            // Registrar error y devolver respuesta
            error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
            echo json_encode(["status" => "error", "message" => "Error al agregar la asignatura"]);
        }
    } catch (Exception $e) {
        // Capturar errores de excepción y registrarlos
        error_log("Excepción capturada: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Error al agregar la asignatura"]);
    }
} else {
    // Manejo de error para datos incompletos
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
