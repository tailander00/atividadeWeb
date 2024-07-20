<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    cadastra_endereco($dadosDecodificados);
}elseif ($_SERVER['REQUEST_METHOD'] === 'GET'){
    lista_enderecos();
}elseif($_SERVER['REQUEST_METHOD'] === 'PUT'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    altera_endereco($dadosDecodificados);
}elseif($_SERVER['REQUEST_METHOD'] === 'DELETE'){
    $dadosRecebidos = file_get_contents('php://input');
    $dadosDecodificados = json_decode($dadosRecebidos, true);
    deleta_endereco($dadosDecodificados);
}

function lista_enderecos(){
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "SELECT enderecos.id as id, estados.nome as estado, estados.sigla as sigla,cidades.nome as cidade, rua, numero, bairro, telefone from estados, cidades, enderecos WHERE enderecos.cidade_id = cidades.id and cidades.estado_id = estados.id ;";
    $result = mysqli_query($con,$query);

    if($result){
        $rows = array();
        $i = 0;
        while($row = mysqli_fetch_assoc($result)){
            $rows[$i] = $row;
            $i += 1;
        }
        $json_dados = json_encode($rows);

        echo($json_dados);
    }else{
        echo json_encode(array(`erro`=>mysqli_error($con))) ;
    }
   
    mysqli_close($con);

}

function cadastra_endereco($endereco){
    $id = rand(0,999);
    $estado = $endereco['estado'];
    $sigla = $endereco['sigla'];
    $cidade = $endereco['cidade'];
    $rua = $endereco['rua'];
    $numero = $endereco['numero'];
    $bairro = $endereco['bairro'];
    $telefone = $endereco['telefone'];
    

    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "SELECT id,nome FROM estados WHERE nome = '$estado'";
    $result = mysqli_query($con,$query);
    $row = mysqli_fetch_assoc($result);
    if ($row){//testa se existe o estado
        $id_estado = $row['id'];
        $query = "SELECT id,nome FROM cidades WHERE nome = '$cidade' AND estado_id = $id_estado";
        $result2 = mysqli_query($con,$query);
        $row2 = mysqli_fetch_assoc($result2);
        if($row2){//testa se existe a cidade
            $id_cidade = $row2['id'];
            $query = "INSERT INTO enderecos (id, rua, numero, bairro, cidade_id, telefone) VALUES ($id, '$rua', '$numero', '$bairro', $id_cidade, '$telefone');";
            $result = mysqli_query($con,$query);
        }else{//cria cidade e endereco
            $id_cidade = rand(0,999);
            $query = "INSERT INTO cidades (id, nome, estado_id) VALUES ($id_cidade, '$cidade', $id_estado);";
            $result = mysqli_query($con,$query);

            $query = "INSERT INTO enderecos (id, rua, numero, bairro, cidade_id, telefone) VALUES ($id, '$rua', '$numero', '$bairro', $id_cidade, '$telefone');";
            $result = mysqli_query($con,$query);
        }

    }else{//cria estado cidade e endereco
        $id_estado = rand(0,999);
        $query = "INSERT INTO estados (id, nome, sigla) VALUES ($id_estado, '$estado', '$sigla');";
        $result = mysqli_query($con,$query);
        $id_cidade = rand(0,999);
        $query = "INSERT INTO cidades (id, nome, estado_id) VALUES ($id_cidade, '$cidade', $id_estado);";
        $result = mysqli_query($con,$query);

        $query = "INSERT INTO enderecos (id, rua, numero, bairro, cidade_id, telefone) VALUES ($id, '$rua', '$numero', '$bairro', $id_cidade, '$telefone');";
        $result = mysqli_query($con,$query);

    }

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);

}

function altera_endereco($endereco){
    $id = $endereco['id'];
    $id = intval($id);
    $estado = $endereco['estado'];
    $sigla = $endereco['sigla'];
    $cidade = $endereco['cidade'];
    $rua = $endereco['rua'];
    $numero = $endereco['numero'];
    $bairro = $endereco['bairro'];
    $telefone = $endereco['telefone']; 

    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "SELECT id,nome FROM estados WHERE nome = '$estado'";
    $result = mysqli_query($con,$query);
    $row = mysqli_fetch_assoc($result);
    if ($row){//testa se existe o estado
        $id_estado = $row['id'];
        $query = "SELECT id,nome FROM cidades WHERE nome = '$cidade' AND estado_id = $id_estado";
        $result2 = mysqli_query($con,$query);
        $row2 = mysqli_fetch_assoc($result2);
        if($row2){//testa se existe a cidade
            $id_cidade = $row2['id'];
            $query = "UPDATE enderecos SET rua = '$rua', numero = '$numero', bairro = '$bairro', telefone = '$telefone' WHERE id = $id;";
            $result = mysqli_query($con,$query);
        }else{//cria cidade e endereco
            $id_cidade = rand(0,999);
            $query = "INSERT INTO cidades (id, nome, estado_id) VALUES ($id_cidade, '$cidade', $id_estado);";
            $result = mysqli_query($con,$query);

            $query = "UPDATE enderecos SET rua = '$rua', numero = '$numero', bairro = '$bairro', telefone = '$telefone' WHERE id = $id;";
            $result = mysqli_query($con,$query);    
        }
    }else{//cria estado cidade e endereco
        $id_estado = rand(0,999);
        $query = "INSERT INTO estados (id, nome, sigla) VALUES ($id_estado, '$estado', '$sigla');";
        $result = mysqli_query($con,$query);
        $id_cidade = rand(0,999);
        $query = "INSERT INTO cidades (id, nome, estado_id) VALUES ($id_cidade, '$cidade', $id_estado);";
        $result = mysqli_query($con,$query);

        $query = "UPDATE enderecos SET rua = '$rua', numero = '$numero', bairro = '$bairro', telefone = '$telefone' WHERE id = $id;";
        $result = mysqli_query($con,$query);

    }
        echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
        mysqli_close($con);
}

function deleta_endereco($endereco){
    $id = $endereco['id'];
    $id = intval($id);
   
    $con = mysqli_connect('localhost','root','');
    mysqli_select_db($con,'e_comerce');

    $query = "DELETE FROM enderecos WHERE id = $id;";
    $result = mysqli_query($con,$query);

    echo json_encode(array('erro'=>mysqli_error($con),'resultado'=>$result));
    mysqli_close($con);
}

?>