<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si todos los datos necesarios han sido enviados
if (isset($_POST['num_control']) && isset($_POST['nombre']) && isset($_POST['id_carrera']) && isset($_POST['fecha_inscripcion'])) {
    // Obtener los datos enviados
    $num_control = $_POST['num_control'];
    $nombre = $_POST['nombre'];
    $id_carrera = $_POST['id_carrera'];
    $fecha_inscripcion = $_POST['fecha_inscripcion'];

    // Preparar y ejecutar la consulta de inserción
    $sql = "INSERT INTO alumnos (num_control, nombre, id_carrera, fecha_inscripcion) VALUES (:num_control, :nombre, :id_carrera, :fecha_inscripcion)";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':num_control', $num_control);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':id_carrera', $id_carrera); 
    $stmt->bindParam(':fecha_inscripcion', $fecha_inscripcion);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Alumno agregado exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al agregar el alumno"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
