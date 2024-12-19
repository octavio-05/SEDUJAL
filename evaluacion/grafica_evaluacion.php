<?php
include('../conexion.php'); // Archivo de conexión con PDO

// Verificar si se recibe el ID de evaluación
$id_evaluacion = $_GET['id_evaluacion'] ?? null;

if (!$id_evaluacion) {
    echo "Error: No se proporcionó el ID de la evaluación.";
    exit;
}

// Consultar los promedios de las respuestas para la evaluación seleccionada
try {
    $sql = "
        SELECT 
            AVG(pregunta_1) AS pregunta_1,
            AVG(pregunta_2) AS pregunta_2,
            AVG(pregunta_3) AS pregunta_3,
            AVG(pregunta_4) AS pregunta_4,
            AVG(pregunta_5) AS pregunta_5,
            AVG(pregunta_6) AS pregunta_6,
            AVG(pregunta_7) AS pregunta_7,
            AVG(pregunta_8) AS pregunta_8,
            AVG(pregunta_9) AS pregunta_9,
            AVG(pregunta_10) AS pregunta_10,
            AVG(pregunta_11) AS pregunta_11,
            AVG(pregunta_12) AS pregunta_12,
            AVG(pregunta_13) AS pregunta_13,
            AVG(pregunta_14) AS pregunta_14,
            AVG(pregunta_15) AS pregunta_15,
            AVG(pregunta_16) AS pregunta_16,
            AVG(pregunta_17) AS pregunta_17,
            AVG(pregunta_18) AS pregunta_18,
            AVG(pregunta_19) AS pregunta_19,
            AVG(pregunta_20) AS pregunta_20,
            AVG(pregunta_21) AS pregunta_21,
            AVG(pregunta_22) AS pregunta_22,
            d.nombre AS docente,
            a.nombre AS asignatura
        FROM respuesta_evaluacion r
        INNER JOIN evaluacion e ON r.id_evaluacion = e.id_evaluacion
        INNER JOIN asignaturas a ON e.id_asignatura = a.id_asignatura
        INNER JOIN docentes d ON a.id_docente = d.id_docente
        WHERE r.id_evaluacion = :id_evaluacion
    ";
    $stmt = $conexion->prepare($sql);
    $stmt->bindValue(':id_evaluacion', $id_evaluacion, PDO::PARAM_INT);
    $stmt->execute();

    $datos = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$datos) {
        echo "Error: No se encontraron datos para esta evaluación.";
        exit;
    }

    // Comprobar si todas las respuestas son nulas (no hay datos en la evaluación)
    $promedios = array_values(array_slice($datos, 0, 22));
    $hayDatos = array_sum(array_map('floatval', $promedios)) > 0;

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
        <title>Evaluaciones</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="../css/bootstrap.min.css">
        <link rel="stylesheet" href="../css/style.css">
        <link rel="stylesheet" href="../css/b4_sidebar.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
        <link rel="stylesheet" href="../helpers/DataTables/datatables.min.css">
        <link rel="icon" type="image/png" href="../images/faviicon.png">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<header>
    <nav class="navbar-fixed-top" role="navigation">
        <div class="container-fluid container-fixed" role="navigation">
            <div class="navbar-header">
                <p class="banner-txt">#CentroUniversitarioJalisco</p>
            </div>
        </div>
    </nav>

    <nav class="navbar-fixed-top sidebarNavigation" data-sidebarClass="sidebarNav">
        <button class="navbar-toggler leftNavbarToggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <i class="fas fa-bars ico-menu-main"></i>
        </button>
        <a href="../helpers/cerrar_session.php">
            <i class="fas fa-sign-out-alt btn-close-session"></i>
        </a>

        <div class="collapse navbar-collapse sidebarNav" id="navbarsExampleDefault">
            <div class="text-center header-sidebarNav">
                <img src="../images/student-default.png" class="header-sidebarNav-img">
                <h5>SEDUJAL</h5>
            </div>
            <div class="options-navbar">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="../adminplace/">
                            <i class="fas fa-home"></i> Inicio
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../alumnos/alumnos.php"><i class="fas fa-user-graduate"></i> Alumnos</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="../docentes/docentes.php"><i class="fa fa-university"></i> Docentes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../asignaturas/asignaturas.php"><i class="fa fa-book"></i> Asignaturas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../carreras/carreras.php"><i class="fa fa-briefcase"></i> Carreras</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../usuarios/usuarios.php"><i class="fa fa-address-card"></i> Usuarios</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../evaluacion/formulario-asignacion.php"><i class="fa fa-archive"></i> Evaluación Docente</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i> Cerrar Sesion</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
<body>
    
    <div class="container mt-5">
        <h1 class="text-center mb-4">Gráfica de Evaluación</h1>
        <h3 class="text-center"><?= htmlspecialchars($datos['asignatura']) ?> - <?= htmlspecialchars($datos['docente']) ?></h3>
        
        <?php if ($hayDatos): ?>
            <!-- Canvas para la gráfica -->
            <canvas id="graficaPromedios" width="400" height="200"></canvas>
        <?php else: ?>
            <!-- Mensaje cuando no hay datos -->
            <p class="text-center text-danger mt-4">No hay datos disponibles de esta evaluación.</p>
        <?php endif; ?>

        <!-- Botón para regresar -->
        <div class="text-center mt-4">
            <a href="evaluacion_resultados.php" class="btn btn-primary">Regresar</a>
        </div>
    </div>

    <?php if ($hayDatos): ?>
    <script>
        // Obtener los datos desde PHP
        const promedios = <?= json_encode($promedios) ?>;
        const labels = Array.from({ length: 22 }, (_, i) => `Pregunta ${i + 1}`);

        // Crear la gráfica
        const ctx = document.getElementById('graficaPromedios').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Promedio de Respuestas',
                    data: promedios,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5 // Escala basada en las respuestas
                    }
                }
            }
        });
    </script>
    <?php endif; ?>
</body>
<script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="../js/b4_sidebar.js"></script>
</html>
