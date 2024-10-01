<?php

require_once("Logger.php");

class ConnectionMysql{

    private $host;
    private $user;
    private $pass;
    private $db;
    public $clave_enc;
    
    public function __construct($d){
        $this->host = $d['host'];
        $this->user = $d['user'];
        $this->pass = $d['pass'];
        $this->db = $d['db'];
        $this->clave_enc = $d['clave'];
    }

    public function getConnection()
    {
        $conn = "";
        try {
            $conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db, $this->user, $this->pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            Logger::error('E001', $ex->getMessage());            
            $conn = $ex->getMessage();
        }
        return $conn;

    }    
}