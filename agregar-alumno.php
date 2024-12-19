<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap en HTML</title>
    
        <!-- Sheet styles -->
    <link href="helpers/bootstrap-5.0.2-dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="helpers/DataTables/datatables.min.css" rel="stylesheet">
    <link href="helpers/fontawesome-6.4.2-web/css/fontawesome.min.css" rel="stylesheet">
    <link href="helpers/fontawesome-6.4.2-web/css/brands.min.css" rel="stylesheet">
    <link href="helpers/fontawesome-6.4.2-web/css/solid.min.css" rel="stylesheet">
    <link href="assets/css/main.css" rel="stylesheet">
    
    <!-- End Sheet styles -->
</head>
<header><nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <!-- <a class="navbar-brand" href="#">Navbar</a> -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="index.php">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Resultados</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Administrar
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Docentes</a></li>
            <li><a class="dropdown-item" href="#">Alumnos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Asignaturas</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul></header>
<body>

    <section class="content">
        <div class="container">
            <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                    <div class="card bg-primary text-center text-white">
                        <h3>Añadir Alumno</h3>
                    </div>
                    <form action="controladores/registro.php" method="post">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <hr>
                                    <div class="form-group">
                                        <label for="num-control">Número de control:</label>
                                        <input type="text" class="form-control" name="num-control" id="num-control" placeholder="Ingrese el número de control" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="nombre-alumno">Nombre del alumno:</label>
                                        <input type="text" class="form-control" name="nombre-alumno" id="nombre-alumno" placeholder="Ingrese el nombre del alumno">
                                    </div>

                                    <div class="form-group">
                                        <label for="carrera">Carrera:</label>
                                        <select class="form-select" id="carrera" aria-label="Default select example">
                                     <option selected>Selecciona una Carrera</option>
                                        <option value="1">ING.</option>
                                        <option value="2">LIC.</option>
                                        <option value="3">ING.</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="carrera">Cuatrimestre::</label>
                                        <select class="form-select" id="cuatrimestre" aria-label="Default select example">
                                     <option selected>Selecciona el número del cuatrimestre</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        </select>
                                    </div>

                                   
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="card-footer text-center">
                            <button type="submit" class="btn btn-primary btn-lg">Registrar</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-2"></div>
            </div>
        </div>
    </section>



    <!-- Scripts -->
    <script src="helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="helpers/popper-2.11.8/popper.min.js"></script>
        <script src="helpers/moment-18.1/moment.min.js"></script>
        <script src="helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="helpers/DataTables/datatables.min.css" ></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>

        <script>
          let table = new DataTable('#myTable');
        </script>
    <!-- Ends  Scripts -->
</body>

</html>