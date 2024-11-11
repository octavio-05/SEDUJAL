<?php
include "../conexion.php"; // Conectar a la base de datos


if (isset($_POST['id_carrera'])) {
    $id_carrera = $_POST['id_carrera'];

    try {
        // Preparar y ejecutar la consulta de eliminación
        $sql = "DELETE FROM carreras WHERE id_carrera = :id_carrera";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id_carrera', $id_carrera, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Carrera eliminada exitosamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al eliminar la carrera"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_carrera no especificado"]);
}
?>
