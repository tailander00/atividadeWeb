document.addEventListener("DOMContentLoaded",imprimeEnderecos());

async function imprimeEnderecos(){
    const consulta = await fetch('/atividadeWeb/controllers/enderecos_controller.php');
    const dados = await consulta.json();
    console.log(dados);

    let tabela = document.getElementById(`tabela`);
    for(let dado of dados) {
      
        let enderecos = [
          dado.id,
          dado.estado,
          dado.cidade,
          dado.rua,
          dado.numero,
          dado.bairro,
          dado.telefone
        ];

        let tr = document.createElement(`tr`);
        let th = [];
        let input = [];

        th[0] = document.createElement(`th`);
        th[0].value = dado.sigla;
        th[0].id = dado.id+` 0`;
        th[0].innerHTML = enderecos[0];
        tr.appendChild(th[0]);
        for (let i = 1; i<7;++i){
            input[i] = document.createElement(`input`);
            input[i].id = dado.id+` `+i;
            input[i].value = enderecos[i];
            input[i].setAttribute(`disabled`,true);

            th[i] = document.createElement(`th`);
            th[i].appendChild(input[i]);
            tr.appendChild(th[i]);
        }

        let atualiza = document.createElement(`button`);
        let confirma = document.createElement(`button`);
        let deleta = document.createElement(`button`);
        atualiza.setAttribute(`onClick`,`permiteEdicao(${enderecos[0]})`);
        confirma.setAttribute(`onClick`,`alteraEndereco(${enderecos[0]})`);
        deleta.setAttribute(`onClick`,`deletaEndereco(${enderecos[0]})`);
        atualiza.innerHTML = `alterar`;
        confirma.innerHTML = `confirma alteracao`;
        deleta.innerHTML = `deletar`;
        let tdAtualiza = document.createElement('th');
        let tdDeleta = document.createElement('th');
        tdAtualiza.appendChild(atualiza);
        tdAtualiza.appendChild(confirma);
        tdDeleta.appendChild(deleta);
        tr.appendChild(tdAtualiza);
        tr.appendChild(tdDeleta);
        
        tabela.appendChild(tr);
 
    }
    
}

async function cadastraEnderecos(){
    let selectEstados = document.getElementById("estados");
    let estadoIndex = selectEstados.selectedIndex;
    let estado = selectEstados.options[estadoIndex].getAttribute("data-nome");
    let sigla = selectEstados.options[estadoIndex].getAttribute("data-sigla");
    let cidade = document.getElementById(`cidades`).value;
    let rua = document.getElementById(`rua`).value;
    let numero = document.getElementById(`numero`).value;
    let bairro = document.getElementById(`bairro`).value;
    let telefone = document.getElementById(`telefone`).value;

    const data = {
        estado: estado,
        sigla: sigla,
        cidade: cidade,
        rua: rua,
        numero: numero,
        bairro: bairro,
        telefone: telefone
    };

    fetch(`/atividadeWeb/controllers/enderecos_controller.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Se o servidor requer autenticação, você pode adicionar cabeçalhos de autorização aqui
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Resposta do servidor:', data);
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
      });
}
function permiteEdicao(id){
  for(let i = 1;i < 7;++i){
    document.getElementById(id+` `+i).disabled = false;
  }
}

async function alteraEndereco(id){
  let endereco = [];
  for(let i = 0;i < 7;++i){
    endereco[i] = document.getElementById(id+` `+i);
  }
  const data = {
    id: id,
    estado: endereco[1].value,
    sigla: endereco[0].value,
    cidade: endereco[2].value,
    rua: endereco[3].value,
    numero: endereco[4].value,
    bairro: endereco[5].value,
    telefone: endereco[6].value
  };

  if(confirm(`certeza que deseja alterar esse registro?`)){

    fetch(`/atividadeWeb/controllers/enderecos_controller.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Se o servidor requer autenticação, você pode adicionar cabeçalhos de autorização aqui
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Resposta do servidor:', data);
        for(let i = 1;i < 7;++i){
          endereco[i].disabled = true;
        }
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
      });
  }else{
    for(let i = 1;i < 7;++i){
      endereco[i].disabled = true;
    }
  } 
}

async function deletaEndereco(id){
  if(confirm(`certeza que deseja deletar esse registro?`)){
    const data = {
      id: id
    }
    fetch(`/atividadeWeb/controllers/enderecos_controller.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Se o servidor requer autenticação, você pode adicionar cabeçalhos de autorização aqui
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Resposta do servidor:', data);
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
    });
  }
}