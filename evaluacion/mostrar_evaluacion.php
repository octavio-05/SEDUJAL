<?php
session_start();
include "../conexion.php"; // Conectar a la base de datos

// Obtener datos del alumno y evaluación
$id_usuario = $_SESSION['id_usuario']; // Asume que ya tienes la sesión iniciada con el número de control del alumno
$id_evaluacion = $_GET['id_evaluacion']; // Recibe el ID de la evaluación desde la URL

// Consulta para verificar si ya respondió
$sql = "SELECT * FROM respuestas_evaluacion WHERE id_evaluacion = :id_evaluacion AND id_usuario = :id_usuario";
$stmt = $conexion->prepare($sql);
$stmt->bindParam(':id_evaluacion', $id_evaluacion, PDO::PARAM_INT);
$stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_STR);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    // El alumno ya respondió la evaluación
    echo "<h3>Ya has respondido esta evaluación. No puedes responderla nuevamente.</h3>";
    echo "<a href='inicio.php'>Volver al inicio</a>"; // Redirige o muestra un enlace
    exit; // Detiene la ejecución del script
}

// Si no respondió, muestra el formulario
header("Location: responder_evaluacion.php?id_evaluacion=$id_evaluacion");
