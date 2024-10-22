
<!DOCTYPE html>
<html>
    <head>
        <title>SEDUJAL</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
        <link rel="icon" type="image/png" href="images/faviicon.png">
    </head>
    <body>

    <div class="container-fluid login-info-fluid">
        <div class="container" style="font-size: 1em">
            <div class="row">
                <div class="col-md-4 offset-md-4">
                    <div class="login-intern-box" style="opacity: 1;">
                        <p style="text-align: center">
                            <img class="login-logo" src="images/logo-vertical.jpg"/></p>

                        <form role="form"  name="frm" id="frm">
                            <div class="form-group">
                                <label for="correo">Usuario</label>
                                <input type="email" class="form-control" id="uemail" name="uemail" >
                            </div>
                            <div class="form-group">
                                <label for="passwd">Contraseña</label>
                                <input type="password" class="form-control" id="passwd" name="passwd" >
                            </div>
                            <div class="form-group" style="text-align: center">
                                <button id="btn_login" class="btn btn-primary btn-sm" style="text-decoration: none; background-color: #7FC41C; border-color: #7FC41C" type="button">Iniciar sesión</button>
                            </div>
                        </form>
                        <div id="msgArea"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
        
    </body>
</html>


