<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si todos los datos necesarios han sido enviados
if (isset($_POST['id_asignatura']) && isset($_POST['nombre']) && isset($_POST['id_docente']) && isset($_POST['cuatrimestre']) && isset($_POST['id_carrera'])) {
    // Obtener los datos enviados
    $id_asignatura = $_POST['id_asignatura'];
    $nombre = $_POST['nombre'];
    $id_docente = $_POST['id_docente'];
    $cuatrimestre = $_POST['cuatrimestre'];
    $id_carrera = $_POST['id_carrera'];

    // Preparar y ejecutar la consulta de inserción
    $sql = "INSERT INTO asignaturas (id_asignatura, nombre, id_docente, cuatrimestre, id_carrera) VALUES (:id_asignatura, :nombre, :id_docente, :cuatrimestre, :id_carrera)";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_asignatura', $id_asignatura);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':id_docente', $id_docente);
    $stmt->bindParam(':cuatrimestre', $cuatrimestre);
    $stmt->bindParam(':id_carrera', $id_carrera);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Asignatura agregada exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al agregar la asignatura"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
