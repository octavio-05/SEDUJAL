<?php
session_start();
$id_evaluacion = $_GET['id_evaluacion']; // Obtener ID desde la URL
?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Formulario Evaluacion Docente</title>
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
    </header

    <div class="container" id="mainContent">

    <div class="container my-5">
<h1 class="text-center mb-4">Responder Evaluación #<?= $id_evaluacion; ?></h1>

    <form action="guardar_respuesta.php" method="POST">
        <input type="hidden" name="id_evaluacion" value="<?= $id_evaluacion; ?>">
        <div class="mb-4">
            <label for="pregunta_1" class="form-label fw-bold">¿Tu profesor explica de manera clara los contenidos de los temas?</label>
        <select class="form-control form-control-sm" id="pregunta_1" name="pregunta_1" required>
            <option value="" disabled selected>Selecciona una opción</option>
            <option value="1">Totalmente de acuerdo</option>
            <option value="2">De acuerdo</option>
            <option value="3">Indeciso</option>
            <option value="4">En desacuerdo</option>
            <option value="5">Totalmente en desacuerdo </option>
            </select>
            </div>
    <!-- Pregunta 1 -->
    <div class="mb-4">
    <label for="pregunta_2" class="form-label fw-bold">¿Tu profesor resuelve las dudas relacionadas con los contenidos de los temas?</label>
    <select class="form-control" id="pregunta_2" name="pregunta_2" required>
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
    </select>
</div>

    <!-- Pregunta 2 -->
    <div class="mb-4">
        <label for="pregunta_3" class="form-label fw-bold">¿Tu profesor propone ejemplos o ejercisios que vinvulan los temas con la practica?</label>
 
    <select class="form-control"  id="pregunta_3" name="pregunta_3" required>
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 3 -->
    <div class="mb-4">
        <label for="pregunta_4" class="form-label fw-bold">¿Al principio de la asigantura, tu profesor presento el programa de l amateria y la manera de evaluarla?</label>
 
    <select class="form-control" id="pregunta_4" name="pregunta_4" required>
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 4 -->
    <div class="mb-4">
        <label for="pregunta_5" class="form-label fw-bold">¿Tu profesor te da a conocer tu promedio al finalizar la asignatura?</label>
 
    <select class="form-control"  id="pregunta_5" name="pregunta_5" required>
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 5 -->
    <div class="mb-4">
        <label for="pregunta_6" class="form-label fw-bold">¿Tu profesor organiza actividades que permiten ejercitar la expresion oral y escrita?</label>
 
    <select class="form-control"  id="pregunta_6" name="pregunta_6">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 6 -->
    <div class="mb-4">
        <label for="pregunta_7" class="form-label fw-bold">¿Tu profesor promueve actividades participativas que permiten colaborar con los demas compañeros ?</label>
 
    <select class="form-control"  id="pregunta_7" name="pregunta_7">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 7 -->
    <div class="mb-4">
        <label for="pregunta_8" class="form-label fw-bold">¿Tu profesor presenta y expone las clases las clases de manera organizada y estructurada?</label>
 
    <select class="form-control"  id="pregunta_8" name="pregunta_8">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 8 -->
    <div class="mb-4">
        <label>¿Tu profesor muestra compromiso y entusiasmo sus actividades docentes?</label>
    <select class="form-control"  id="pregunta_9" name="pregunta_9">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 9 -->
    <div class="mb-4">
        <label for="pregunta_10" class="form-label fw-bold">¿Tu profesor propicia el desarrollo de un ambiente de respeto y confianza?</label>
 
    <select class="form-control"  id="pregunta_10" name="pregunta_10">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 11 -->
    <div class="mb-4">
        <label for="pregunta_11" class="form-label fw-bold">Tu profesor reconoce los exitos y logros en las actividades de aprendizaje?</label>
 
    <select class="form-control"  id="pregunta_11" name="pregunta_11">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 11 -->
    <div class="mb-4">
        <label for="pregunta_12" class="form-label fw-bold">Tu profesor hace interesante el aprendizaje de la materia impartida?</label>
 
    <select class="form-control"  id="pregunta_12" name="pregunta_12">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 12 -->
    <div class="mb-4">
        <label for="pregunta_13" class="form-label fw-bold">Tu profesor asiste regular y puntualmente?</label>
 
    <select class="form-control"  id="pregunta_13" name="pregunta_13">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 13 -->
    <div class="mb-4">
        <label for="pregunta_14" class="form-label fw-bold">Tu profesor promueve mantener limpias, ordenadas y cuidar las instalaciones ?</label>
 
    <select class="form-control"  id="pregunta_14" name="pregunta_14">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 14 -->
    <div class="mb-4">
        <label for="pregunta_15" class="form-label fw-bold">Tu profesor es accesible y esta dispuesto a brindarte ayuda academica?</label>
 
    <select class="form-control"  id="pregunta_15" name="pregunta_15">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 15 -->
    <div class="mb-4">
        <label for="pregunta_16" class="form-label fw-bold">En general, pienso que es buen docente</label>
 
    <select class="form-control"  id="pregunta_16" name="pregunta_16">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 16 -->
    <div class="mb-4">
        <label for="pregunta_17" class="form-label fw-bold">Lo aprendido en la asignatura me ha servido para mi desarrollo profecional</label>
 
    <select class="form-control"  id="pregunta_17" name="pregunta_17">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 17 -->
    <div class="mb-4">
        <label for="pregunta_18" class="form-label fw-bold">Estoy satisfecho(a) por mi nivel de desempeño y aprendizaje logrado gracias a la labor docente</label>
 
    <select class="form-control"  id="pregunta_18" name="pregunta_18">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 18 -->
    <div class="mb-4">
        <label for="pregunta_19" class="form-label fw-bold">La atencion en el area administrativa es de buena manera,pronta y oportuna resolviendo mis necesidades</label>
 
    <select class="form-control"  id="pregunta_19" name="pregunta_19" >
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 19 -->
    <div class="mb-4">
        <label for="pregunta_20" class="form-label fw-bold">Las instalaciones son comodas y adecuadas</label>
 
    <select class="form-control"  id="pregunta_20" name="pregunta_20">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 20 -->
    <div class="mb-4">
        <label for="pregunta_21" class="form-label fw-bold">La escuela me da la seguridad de lo que estoy estudiando </label>
 
    <select class="form-control"  id="pregunta_21" name="pregunta_21">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <!-- Pregunta 21 -->
    <div class="mb-4">
        <label for="pregunta_22" class="form-label fw-bold">Yo recomendario UNIJAL a otras personas</label>
 
    <select class="form-control"  id="pregunta_22" name="pregunta_22">
        <option value="" disabled selected>Selecciona una opción</option>
        <option value="1">Totalmente de acuerdo</option>
        <option value="2">De acuerdo</option>
        <option value="3">Indeciso</option>
        <option value="4">En desacuerdo</option>
        <option value="5">Totalmente en desacuerdo</option>
      </select>
    </div>
    <div class="mb-4">
    <label for="comentario" class="form-label fw-bold">¿Tienes algún comentario? (Opcional)</label>
    <input class="form-control form-control-lg" type="text" placeholder="Comentarios" id="comentario" name="comentario">
    </div>


    <button type="submit" class="btn btn-primary">Guardar</button>

</form>
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


