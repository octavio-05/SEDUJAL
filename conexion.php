<?php

// // require_once("Logger.php");
// // include ("env.php");
// class ConnectionMysql{

//     private $host;
//     private $user;
//     private $pass;
//     private $db;

    
//     public function __construct($d){
//         $this->host = $d['host'];
//         $this->user = $d['user'];
//         $this->pass = $d['pass'];
//         $this->db = $d['db'];
 
//     }

//     public function getConnection()
//     {
        // $conexion = "";
        $host = "localhost";
        //$host = "127.0.0.1";  // comentar al poner en producción
        $user = "root";
        $pass = "";
        $db = "sedujal1";

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