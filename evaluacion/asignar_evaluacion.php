<?php


include "../conexion.php"; // Conectar a la base de datos
    // Verificar que los datos necesarios están presentes

    if (isset($_POST['id_asignatura']) && isset($_POST['fecha_inicio']) && isset($_POST['fecha_fin'])) {
        // Obtener los datos enviados
        $id_asignatura = $_POST['id_asignatura'];
        $fecha_inicio = $_POST['fecha_inicio'];
        $fecha_fin = $_POST['fecha_fin'];

    $id_asignatura = $_POST['id_asignatura'];
    $fecha_inicio = $_POST['fecha_inicio'];
    $fecha_fin = $_POST['fecha_fin'];



    $sql = "INSERT INTO evaluacion (id_asignatura, fecha_inicio, fecha_fin) VALUES (:id_asignatura, :fecha_inicio, :fecha_fin)";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_asignatura', $id_asignatura);
    $stmt->bindParam(':fecha_inicio', $fecha_inicio);
    $stmt->bindParam(':fecha_fin', $fecha_fin); 


    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Evaluacion Docente asignada exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al asignar evaluacion"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
