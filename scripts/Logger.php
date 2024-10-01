<?php

class Logger {

    public static function error($code, $msg){
        $ddf = fopen('error.log', 'a'); 
        fwrite($ddf, "[".date("r")."] ERROR $code: $msg\r\n"); 
        fclose($ddf); 
    }

}
