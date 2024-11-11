<?php
include "../conexion.php"; // Conectar a la base de datos

if (isset($_POST['id_docente'])) {
    $id_docente = $_POST['id_docente'];

    try {
        // Preparar y ejecutar la consulta de eliminación
        $sql = "DELETE FROM docentes WHERE id_docente = :id_docente";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id_docente', $id_docente, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Docente eliminado exitosamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al eliminar el docente"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_docente no especificado"]);
}
?>
