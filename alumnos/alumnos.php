<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Alumnos</title>
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
                            <a class="nav-link" href="./">
                                <i class="fas fa-home"></i>
                                Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../alumnos.php"><i class="fas fa-user-graduate"></i>
                                Alumnos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:loadContent('../docentes.php');"><i class="fa fa-university"></i>
                                Docentes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:loadContent('../asignaturas.php');"><i class="fa fa-book"></i>
                                Asignaturas</a>
                        </li>
                        

                        <li class="nav-item">
                            <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i>Cerrar Sesion</a>
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

    </div>

    
    <!-- Fin de modal -->

        <!-- Scripts -->
        <script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <!-- <script src="helpers/DataTables/datatables.min.css" ></script> -->
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <!-- <script src="ajax-alumno.js"></script> -->
    <!-- <script src="../js/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="../js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <script src="../js/b4_sidebar.js"></script>
    <script src="../js/moment.js"></script>
    <script src="../js/ajax-alumno.js"></script>
    <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
    <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
     -->
    </body>
</html>


