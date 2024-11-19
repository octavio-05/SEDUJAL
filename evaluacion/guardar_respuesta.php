<?php
session_start();

// Verificar que la sesión esté iniciada y que el id_usuario esté definido
if (!isset($_SESSION['id_usuario'])) {
    die("Error: Usuario no autenticado.");
}

include('../conexion.php'); // Ajusta la ruta si es necesario

$id_usuario = $_SESSION['id_usuario']; // Número de control del alumno desde la sesión
$id_evaluacion = $_POST['id_evaluacion'] ?? null;

if (!$id_evaluacion) {
    die("Error: id_evaluacion no proporcionado.");
}

// Procesar las respuestas
$respuestas = [];
for ($i = 1; $i <= 22; $i++) {
    $respuestas["pregunta_$i"] = $_POST["pregunta_$i"] ?? null;
}
$comentario = $_POST['comentario'] ?? "";

// Construir la consulta de inserción
$columnas = array_keys($respuestas);
$placeholders = array_fill(0, count($columnas), '?');

$query = "INSERT INTO respuesta_evaluacion 
          (id_usuario, id_evaluacion, " . implode(", ", $columnas) . ", comentario) 
          VALUES 
          (?, ?, " . implode(", ", $placeholders) . ", ?)";

$stmt = $conexion->prepare($query);

// Vincular parámetros
$stmt->bindValue(1, $id_usuario, PDO::PARAM_STR);
$stmt->bindValue(2, $id_evaluacion, PDO::PARAM_INT);

$index = 3;
foreach ($respuestas as $respuesta) {
    $stmt->bindValue($index++, $respuesta, PDO::PARAM_INT);
}
$stmt->bindValue($index, $comentario, PDO::PARAM_STR);

// Ejecutar la consulta
try {
    if ($stmt->execute()) {
        echo "Respuestas guardadas correctamente.";
    } else {
        echo "Error al guardar respuestas.";
    }
} catch (PDOException $e) {
    echo "Error en la consulta: " . $e->getMessage();
}
?>
