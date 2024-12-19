<?php
include "../session_check.php";

// Verificar que sea un alumno
if ($_SESSION['rol'] != 'alumno') {
    header("Location: ../login.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
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
    </head>

    <body>

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
                            <a class="nav-link" href="../userplace/index.php">
                                <i class="fas fa-home"></i>
                                Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../evaluacion/evaluaciones_activas.php"><i class="fa fa-book"></i>
                                Evaluaciones</a>
                        </li>
                        

                        <li class="nav-item">
                            <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i>Cerrar Sesion</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <?php
include('../conexion.php'); // Archivo de conexión con PDO


$id_usuario = $_SESSION['id_usuario'] ?? null; // Obtener el ID del usuario desde la sesión

if (!$id_usuario) {
    header("Location: ../auth_login.php"); // Redirige si no hay sesión iniciada
    exit;
}

// Obtener información del alumno
$queryAlumno = "SELECT id_carrera, fecha_inscripcion FROM alumnos WHERE num_control = :id_usuario";
$stmtAlumno = $conexion->prepare($queryAlumno);
$stmtAlumno->bindValue(':id_usuario', $id_usuario, PDO::PARAM_STR);
$stmtAlumno->execute();
$alumno = $stmtAlumno->fetch(PDO::FETCH_ASSOC);

if (!$alumno) {
    echo "Error: No se encontró información del alumno.";
    exit;
}

// Calcular el cuatrimestre actual del alumno
function calcularCuatrimestre($fecha_inscripcion) {
    $fecha_actual = new DateTime();
    $inicio = new DateTime($fecha_inscripcion);
    $diferencia = $fecha_actual->diff($inicio);

    $meses_transcurridos = ($diferencia->y * 12) + $diferencia->m;
    $cuatrimestre = ceil($meses_transcurridos / 4);

    return min($cuatrimestre, 9); // Máximo 9 cuatrimestres
}

$id_carrera = $alumno['id_carrera'];
$fecha_inscripcion = $alumno['fecha_inscripcion'];
$cuatrimestre_actual = calcularCuatrimestre($fecha_inscripcion);

// Consulta para obtener evaluaciones activas de la carrera y cuatrimestre del alumno
$hoy = date('Y-m-d');
$query = "SELECT e.id_evaluacion, a.nombre AS asignatura, e.fecha_inicio, e.fecha_fin 
          FROM evaluacion e
          INNER JOIN asignaturas a ON e.id_asignatura = a.id_asignatura
          WHERE a.id_carrera = :id_carrera
          AND a.cuatrimestre = :cuatrimestre
          AND e.fecha_inicio <= :hoy
          AND e.fecha_fin >= :hoy";
$stmt = $conexion->prepare($query);
$stmt->bindValue(':id_carrera', $id_carrera, PDO::PARAM_INT);
$stmt->bindValue(':cuatrimestre', $cuatrimestre_actual, PDO::PARAM_INT);
$stmt->bindValue(':hoy', $hoy, PDO::PARAM_STR);
$stmt->execute();
$evaluaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container" id="mainContent">
    <div class="container mt-5">
        <h1 class="text-center mb-4">Evaluaciones Activas</h1>
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID Evaluación</th>
                    <th>Asignatura</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de Fin</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($evaluaciones): ?>
                    <?php foreach ($evaluaciones as $evaluacion): ?>
                        <?php
                        // Verificar si el alumno ya respondió esta evaluación
                        $id_evaluacion = $evaluacion['id_evaluacion'];
                        $queryRespuesta = "SELECT * FROM respuesta_evaluacion WHERE id_evaluacion = :id_evaluacion AND id_usuario = :id_usuario";
                        $stmtRespuesta = $conexion->prepare($queryRespuesta);
                        $stmtRespuesta->bindValue(':id_evaluacion', $id_evaluacion, PDO::PARAM_INT);
                        $stmtRespuesta->bindValue(':id_usuario', $id_usuario, PDO::PARAM_STR);
                        $stmtRespuesta->execute();

                        $yaRespondida = $stmtRespuesta->rowCount() > 0; // True si ya respondió
                        ?>
                        <tr>
                            <td><?= htmlspecialchars($evaluacion['id_evaluacion']); ?></td>
                            <td><?= htmlspecialchars($evaluacion['asignatura']); ?></td>
                            <td><?= htmlspecialchars($evaluacion['fecha_inicio']); ?></td>
                            <td><?= htmlspecialchars($evaluacion['fecha_fin']); ?></td>
                            <td>
                                <?php if ($yaRespondida): ?>
                                    <button class="btn btn-secondary" disabled>Ya respondida</button>
                                <?php else: ?>
                                    <a href="formulario_respuesta.php?id_evaluacion=<?= htmlspecialchars($evaluacion['id_evaluacion']); ?>" 
                                       class="btn btn-primary">Responder</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="5" class="text-center">No hay evaluaciones activas disponibles para su carrera y cuatrimestre.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>



        <!-- Scripts -->
        <script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="../js/b4_sidebar.js"></script>
</body>
</html>


