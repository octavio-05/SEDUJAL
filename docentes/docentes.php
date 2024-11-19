<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Docentes</title>
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

         <?php
            include ('content.php');
        ?> 
        
    </body>
</html>


