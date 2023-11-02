<?php
error_reporting(E_ALL);

// Credentials
$dbhost = "localhost";
$dbname = "mood";
$dbuser = "root";
$dbpass = "password";

// Connection
global $companyStockSearchDB;

$companyStockSearchDB = new mysqli();
$companyStockSearchDB->connect($dbhost, $dbuser, $dbpass, $dbname);
$companyStockSearchDB->set_charset("utf8");

// Check Connection
//if ($companyStockSearchDB->connect_errno) {
//    printf("Connect failed: %s\n", $companyStockSearchDB->connect_error);
//    exit();
//}else {
//	print 'in';
//}




/*
$query = "SELECT
        symbol_company
        FROM
        symbols
        ";
*/

$symbol = $_GET['s']; 

$query = "UPDATE symbols
		  SET relevance = 0
		  WHERE symbol_company= '".$symbol."'";
		  
		  
		  
		  

        
$result = mysqli_query( $companyStockSearchDB, $query) or die (((is_object($companyStockSearchDB)) ? mysqli_error($companyStockSearchDB) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)));        
        
/*
while ($row = mysqli_fetch_assoc($result)) { 
       extract($row);
        echo "'".$symbol_company."', "; 
        }
*/
        
  
