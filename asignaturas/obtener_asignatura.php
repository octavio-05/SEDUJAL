<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el id_asignatura de la asignatura
if (isset($_GET['id_asignatura'])) {
    $id_asignatura = $_GET['id_asignatura'];

    try {
        // Preparar y ejecutar la consulta de obtención de datos
        $sql = "SELECT * FROM asignaturas WHERE id_asignatura = :id_asignatura";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id_asignatura', $id_asignatura, PDO::PARAM_INT);
        $stmt->execute();

        // Verificar si la asignatura fue encontrada
        if ($stmt->rowCount() > 0) {
            $asignatura = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $asignatura]);
        } else {
            echo json_encode(["status" => "error", "message" => "Asignatura no encontrada"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_asignatura no especificado"]);
}
?>
