<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se han enviado todos los datos necesarios
if (isset($_POST['num_control']) && isset($_POST['nombre']) && isset($_POST['id_carrera']) && isset($_POST['fecha_inscripcion'])) {
    // Obtener los datos enviados
    $num_control = $_POST['num_control'];
    $nombre = $_POST['nombre'];
    $id_carrera = $_POST['id_carrera'];
    $fecha_inscripcion = $_POST['fecha_inscripcion'];

    // Preparar y ejecutar la consulta de actualización
    $sql = "UPDATE alumnos SET nombre = :nombre, id_carrera = :id_carrera, fecha_inscripcion = :fecha_inscripcion WHERE num_control = :num_control";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':id_carrera', $id_carrera);
    $stmt->bindParam(':fecha_inscripcion', $fecha_inscripcion);
    $stmt->bindParam(':num_control', $num_control);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Alumno actualizado exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar el alumno"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
