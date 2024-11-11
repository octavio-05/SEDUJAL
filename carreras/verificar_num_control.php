<?php
include "../conexion.php"; // Conectar a la base de datos

if (isset($_POST['num_control'])) {
    $num_control = $_POST['num_control'];

    // Verificar si el número de control ya existe
    $sql = "SELECT COUNT(*) FROM alumnos WHERE num_control = :num_control";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':num_control', $num_control);
    $stmt->execute();
    $existe = $stmt->fetchColumn();

    if ($existe > 0) {
        echo json_encode(["existe" => true]);
    } else {
        echo json_encode(["existe" => false]);
    }
} else {
    echo json_encode(["error" => "Número de control no proporcionado"]);
}
?>
