<?php
error_reporting(E_ALL);

// Credentials
// $dbhost = "localhost";
// $dbname = "mood";
// $dbuser = "root";
// $dbpass = "password";

// Connection

require('config.php');


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

$search= $_GET['q'];

$query = "SELECT
        name_company, symbol_company
        FROM
            symbols
        WHERE name_company LIKE '%$search%'
        AND relevance > 0
        LIMIT 20
        ";
        
$html = "<div id='result'>";

$result = mysqli_query( $companyStockSearchDB, $query) or die (((is_object($companyStockSearchDB)) ? mysqli_error($companyStockSearchDB) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)));

$html .= "<ul>";

    while ($row = mysqli_fetch_assoc($result)) {
        extract($row);
        $html .= "<li><a href='#' name='".$symbol_company."'>".$name_company." - <span class='company-symbol'>".$symbol_company."</span></a></li>";
    }
    
$html .= "</ul></div>";

print $html;

?>