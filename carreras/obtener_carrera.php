<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el id_carrera de la carrera
if (isset($_GET['id_carrera'])) {
    $id_carrera = $_GET['id_carrera'];

    // Preparar y ejecutar la consulta para obtener los datos de la carrera
    $sql = "SELECT * FROM carreras WHERE id_carrera = :id_carrera";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_carrera', $id_carrera); // Corregido: añadimos el símbolo ":" en el bindParam
    $stmt->execute();

    // Obtener el resultado y enviarlo como JSON
    $carrera = $stmt->fetch(PDO::FETCH_ASSOC); // Cambiado $alumno a $carrera
    if ($carrera) {
        echo json_encode($carrera);
    } else {
        echo json_encode(["status" => "error", "message" => "Carrera no encontrada"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_carrera no especificado"]);
}
?>
