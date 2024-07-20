<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    cadastra_produto($dadosDecodificados);
}elseif ($_SERVER['REQUEST_METHOD'] === 'GET'){
    lista_produtos();
}elseif($_SERVER['REQUEST_METHOD'] === 'PUT'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    altera_produto($dadosDecodificados);
}elseif($_SERVER['REQUEST_METHOD'] === 'DELETE'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    deleta_produto($dadosDecodificados);
}

function lista_produtos(){
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "SELECT * from produtos";
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

function cadastra_produto($produto){

    $id = rand(0,999);
    $descricao = $produto['descricao'];
    $valor_unitario = $produto['valor_unitario'];
    $valor_string = floatval($valor_unitario);
    
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "INSERT INTO produtos (id, desccricao, valor_unitario) VALUES ($id, '$descricao', $valor_string);";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
} 

function altera_produto($produto){
    $id = $produto['id'];
    $id = intval($id);
    $descricao = $produto['descricao'];
    $valor_unitario = $produto['valor_unitario'];
    $valor_string = floatval($valor_unitario);

    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "UPDATE produtos SET desccricao = '$descricao', valor_unitario = $valor_string WHERE id = $id;";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
}

function deleta_produto($dado){
    $id = $dado['id'];
    $id = intval($id);
   
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "DELETE FROM produtos WHERE id = $id;";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
}


?>