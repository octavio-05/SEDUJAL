<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el num_control del alumno
if (isset($_GET['num_control'])) {
    $num_control = $_GET['num_control'];

    // Preparar y ejecutar la consulta para obtener los datos del alumno
    $sql = "SELECT * FROM alumnos WHERE num_control = :num_control";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam('num_control', $num_control);
    $stmt->execute();

    // Obtener el resultado y enviarlo como JSON
    $alumno = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($alumno) {
        echo json_encode($alumno);
    } else {
        echo json_encode(["status" => "error", "message" => "Alumno no encontrado"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "num_control no especificado"]);
}
?>
