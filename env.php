<?php
$host = "localhost";
//$host = "127.0.0.1";  // comentar al poner en producción
$user = "root";
$pass = "";
$db = "sedujal";


$conData = array('host' => $host,
                    'user' => $user,
                    'pass' => $pass,
                    'db' => $db,
                    );

?>





// $conexion =new conexion();

//         $c = $conexion; 
//         try{
//             $sql = $c->query("SELECT * FROM carreras"); 
//             $R['filas'] = $sql->rowCount(); 
//             if($R['filas']>0){
//                 $R['datos'] = $sql->fetchAll(PDO::FETCH_ASSOC);
//             } else {
//                 $R['datos'] = 'Sin datos';
//             }
//         }catch(PDOException $e){
//             Logger::error('E002', $e->getMessage()); 
//             $R['estado'] = "ERROR"; 
//             $R['msg']= $e->getMessage();
//         }
//         return $R; 
//         $data [] = $R;
//         echo json_encode($data);



// $sql = "select * from carreras";

// $result = mysqli_query($conexion, $sql);

// $data = array();

//     while($row = mysqli_fetch_assoc($result)){
//         $data [] = $row;
//     }
//     echo json_encode($data);
