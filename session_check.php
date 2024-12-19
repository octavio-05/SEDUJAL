<?php
session_start();

// Verificar si la sesión está activa
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['rol'])) {
    // Si no hay sesión activa, redirigir al login
    header("Location: index.php");
    exit();
}
?>
