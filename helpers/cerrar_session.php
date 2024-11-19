<?php
/**
 * Created by PhpStorm.
 * User: luiscobian
 * Date: 9/2/18
 * Time: 1:51 PM
 */
session_start();
session_destroy();
header("Location:../index.php");
?>