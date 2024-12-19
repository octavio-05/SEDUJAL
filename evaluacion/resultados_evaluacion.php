<?php
// include "../session_check.php";

// // Verificar que sea un administrador
// if ($_SESSION['rol'] != 'admin') {
//     header("Location: ../index.php");
//     exit();
// }
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CONTROL ESCOLAR UNIJAL</title>
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
<div class="container" id="mainContent">

    <div class="container mt-5">
        <h1 class="text-center">Resultados de Evaluaciones por Docente</h1>
        <div id="graficas-container">
            <!-- Aquí se generarán dinámicamente las gráficas -->
        </div>
    </div>
</div>

<!-- Fin de modal -->


</body>
<script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="../js/b4_sidebar.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    // Función para obtener los datos del servidor
    async function fetchResultados() {
        const response = await fetch('get_evaluacion_docentes.php');
        return response.json();
    }

    // Función para crear un gráfico
    function crearGrafico(label, promedios, containerId) {
        const ctx = document.getElementById(containerId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 22 }, (_, i) => `Pregunta ${i + 1}`),
                datasets: [{
                    label: `Promedio de respuestas (${label})`,
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
                        max: 5
                    }
                }
            }
        });
    }

    // Función para renderizar las gráficas
    async function renderGraficas() {
        const data = await fetchResultados();
        const container = document.getElementById('graficas-container');

        data.forEach((evaluacionData, index) => {
            const { asignatura_nombre, docente_nombre, ...promedios } = evaluacionData;
            const promedioArray = Object.values(promedios).map(val => parseFloat(val) || 0);
            const label = `${asignatura_nombre} - ${docente_nombre}`;

            // Crear un canvas para cada gráfico
            const canvasId = `grafico-${index}`;
            const canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.className = 'mb-5';
            container.appendChild(canvas);

            // Crear el gráfico
            crearGrafico(label, promedioArray, canvasId);
        });
    }

    // Llamar a la función para renderizar las gráficas
    renderGraficas();
</script>



</html>






    