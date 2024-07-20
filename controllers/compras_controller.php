<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    cadastra_compra($dadosDecodificados);
}elseif ($_SERVER['REQUEST_METHOD'] === 'GET'){
    lista_compras();
}elseif($_SERVER['REQUEST_METHOD'] === 'PUT'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    altera_compra($dadosDecodificados);
}elseif($_SERVER['REQUEST_METHOD'] === 'DELETE'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    deleta_compra($dadosDecodificados);
}

function lista_compras(){
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "SELECT * from compras";
    $result = mysqli_query($con,$query);

    if($result){
        $rows = array();
        $i = 0;
        while($row = mysqli_fetch_assoc($result)){
            $rows[$i] = $row;
            $i += 1;
        }
        $json_dados = json_encode($rows);


        echo $json_dados;
    }else{
        echo "Ocorreu um erro na consulta: " . mysqli_error($con);
    }
   
    mysqli_close($con);

}

function cadastra_compra($compra){
    echo json_encode($compra);
    $id = rand(0,999);
    $endereco = $compra['endereco'];
    $endereco_id = intval($endereco);
    $data = $compra['data'];
    

    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "INSERT INTO compras (id, endereco_id, data) VALUES ($id, $endereco_id, '$data');";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
    
}

function altera_compra($compra){
    $id = $compra['id'];
    $id = intval($id);
    $endereco_id = $compra['endereco'];
    $endereco_id = intval($endereco_id);
    $data = $compra['data'];

    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "UPDATE compras SET endereco_id = $endereco_id, data = '$data' WHERE id = $id;";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
}

function deleta_compra($compra){
    $id = $compra['id'];
    $id = intval($id);
   
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "DELETE FROM compras WHERE id = $id;";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
}

?>