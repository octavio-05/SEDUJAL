<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se han enviado todos los datos necesarios
if (isset($_POST['id_asignatura']) && isset($_POST['nombre']) && isset($_POST['id_docente']) && isset($_POST['cuatrimestre']) && isset($_POST['id_carrera'])) {
    // Obtener los datos enviados
    $id_asignatura = $_POST['id_asignatura'];
    $nombre = $_POST['nombre'];
    $id_docente = $_POST['id_docente'];
    $cuatrimestre = $_POST['cuatrimestre'];
    $id_carrera = $_POST['id_carrera'];

    // Preparar y ejecutar la consulta de actualización
    $sql = "UPDATE asignaturas SET nombre = :nombre, id_docente = :id_docente, cuatrimestre = :cuatrimestre, id_carrera = :id_carrera WHERE id_asignatura = :id_asignatura";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':id_docente', $id_docente);
    $stmt->bindParam(':cuatrimestre', $cuatrimestre);
    $stmt->bindParam(':id_carrera', $id_carrera);
    $stmt->bindParam(':id_asignatura', $id_asignatura);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Asignatura actualizada exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar la asignatura"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
