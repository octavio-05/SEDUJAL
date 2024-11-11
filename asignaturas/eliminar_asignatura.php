<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el id_asignatura de la asignatura
if (isset($_POST['id_asignatura'])) {
    $id_asignatura = $_POST['id_asignatura'];

    try {
        // Preparar y ejecutar la consulta de eliminación
        $sql = "DELETE FROM asignaturas WHERE id_asignatura = :id_asignatura";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id_asignatura', $id_asignatura, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Asignatura eliminada exitosamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al eliminar la asignatura"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_asignatura no especificado"]);
}
?>
