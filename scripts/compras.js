document.addEventListener("DOMContentLoaded", function(){imprimeCompras();listaEnderecos()});

async function imprimeCompras(){
    console.log(`aqui`);
    const consulta = await fetch('/atividadeWeb/controllers/compras_controller.php');
    const dados = await consulta.json();
    console.log(dados);

    let tabela = document.getElementById(`tabela`);
    for(let dado of dados) {

        const id = dado.id;
        const endereco = dado.endereco_id;
        const data = dado.data;

        let tr = document.createElement(`tr`);
        let th0 = document.createElement(`th`);
        let th1 = document.createElement(`th`);
        let th2 = document.createElement(`th`);
        let input_endereco = document.createElement(`select`);
        let selected = document.createElement(`option`);
        let input_data = document.createElement(`input`);
        input_data.setAttribute(`type`,`date`);
        input_endereco.setAttribute(`disabled`,true);
        input_data.setAttribute(`disabled`,true);

        input_endereco.className = `endereco`;
        input_endereco.id = id+`endereco`;
        input_data.id = id+`data`;

        th0.innerHTML = id;
        selected.innerHTML = endereco;
        selected.value = endereco;
        input_endereco.value = endereco;
        input_data.value = data;

        input_endereco.appendChild(selected);
        th1.appendChild(input_endereco);
        th2.appendChild(input_data);

        tr.appendChild(th0);
        tr.appendChild(th1);
        tr.appendChild(th2);

        let atualiza = document.createElement(`button`);
        let confirma = document.createElement(`button`);
        let deleta = document.createElement(`button`);
        atualiza.setAttribute(`onClick`,`permiteEdicao(${id})`);
        confirma.setAttribute(`onClick`,`alteraCompra(${id})`);
        deleta.setAttribute(`onClick`,`deletaCompra(${id})`);
        atualiza.innerHTML = `alterar`;
        confirma.innerHTML = `contirma alteracao`;
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

async function listaEnderecos(){
    const consulta = await fetch('/atividadeWeb/controllers/enderecos_controller.php');
    const dados = await consulta.json();
    console.log(dados);

    let select = document.querySelectorAll(`.endereco`);
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
      let enderecoTexto = enderecos.join(", ");

        select.forEach(function(elemento){
          let option = document.createElement(`option`); 
          option.innerHTML = enderecoTexto;
          option.value = dado.id;
          elemento.appendChild(option);
        });
 
    }
}

async function cadastraCompra(){
    let endereco = document.getElementById(`endereco`).value;
    let data = document.getElementById(`data`).value;

    const dados = {
        endereco: endereco,
        data: data
    }
    console.log(dados);
    fetch(`/atividadeWeb/controllers/compras_controller.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Se o servidor requer autenticação, você pode adicionar cabeçalhos de autorização aqui
        },
        body: JSON.stringify(dados)
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
  document.getElementById(id+`endereco`).disabled = false;
  document.getElementById(id+`data`).disabled = false;
}

function alteraCompra(id){
  endereco = document.getElementById(id+`endereco`);
  data = document.getElementById(id+`data`);
  if(confirm(`certeza que deseja alterar esse registro?`)){
    const dado = {
        id: id,
        endereco: endereco.value,
        data: data.value
    }
    fetch(`/atividadeWeb/controllers/compras_controller.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Se o servidor requer autenticação, você pode adicionar cabeçalhos de autorização aqui
        },
        body: JSON.stringify(dado)
      })
      .then(response => response.json())
      .then(dado => {
        console.log('Resposta do servidor:', data);
        endereco.disabled = true;
        data.disabled = true;
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
      });
  }else{
    endereco.disabled = true;
    data.disabled = true;
  }
}
function deletaCompra(id){
  if(confirm(`certeza que deseja deletar esse registro?`)){
    const data = {
        id: id
    }
    fetch(`/atividadeWeb/controllers/compras_controller.php`, {
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