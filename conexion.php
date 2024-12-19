<?php

        $host = "localhost";
        //$host = "127.0.0.1";  // comentar al poner en producción
        $user = "root";
        $pass = '';
        $db = "unijaled_sedujal";

 try {
            $conexion = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo "Conexion realizada con exito";
        } catch (PDOException $ex) {
            // Logger::error('E001', $ex->getMessage());            
            $conexion = $ex->getMessage();
            echo "Conexion Fallada" . $ex->getMessage();
            exit;
        }


//     }    
// }



?>