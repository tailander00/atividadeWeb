document.addEventListener("DOMContentLoaded",imprimeProdutos());

async function imprimeProdutos(){
    console.log(`aqui`);
    const consulta = await fetch('/atividadeWeb/controllers/produtos_controller.php');
    const dados = await consulta.json();
    console.log(dados);

    let tabela = document.getElementById(`tabela`);
    for(let dado of dados) {

        const id = dado.id; 
        const nome = dado.desccricao;
        const valor = dado.valor_unitario;

        let tr = document.createElement(`tr`);
        let th0 = document.createElement(`th`);
        let th1 = document.createElement(`th`);
        let th2 = document.createElement(`th`);
        let input_nome = document.createElement(`input`);
        let input_valor = document.createElement(`input`);
        input_nome.setAttribute(`disabled`,true);
        input_valor.setAttribute(`disabled`,true);
        input_nome.value = nome;
        input_valor.value = valor;
        input_nome.id = id +`nome`;
        input_valor.id = id +`valor`;
        th0.innerHTML = id;
        th1.appendChild(input_nome);
        th2.appendChild(input_valor);
        tr.appendChild(th0);
        tr.appendChild(th1);
        tr.appendChild(th2);

        let atualiza = document.createElement(`button`);
        let confirma = document.createElement(`button`);
        let deleta = document.createElement(`button`);
        atualiza.setAttribute(`onClick`,`permiteEdicao(${id})`);
        confirma.setAttribute(`onclick`,`alteraProduto(${id})`);
        deleta.setAttribute(`onClick`,`deletaProduto(${id})`);
        confirma.innerHTML = `confirma alteracao`;
        atualiza.innerHTML = `alterar`;
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

async function cadastraProdutos(){
    let descricao = document.getElementById(`descricao`).value;
    let valor_unitario = document.getElementById(`valor_unitario`).value;

    const data = {
        descricao: descricao,
        valor_unitario: valor_unitario
    }
    fetch(`/atividadeWeb/controllers/produtos_controller.php`, {
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
  document.getElementById(id+`nome`).disabled = false;
  document.getElementById(id+`valor`).disabled = false;
}

async function alteraProduto(id){
  descricao = document.getElementById(id+`nome`);
  valor_unitario = document.getElementById(id+`valor`);
  if(confirm(`certeza que deseja alterar esse registro?`)){
    const data = {
        id: id,
        descricao: descricao.value,
        valor_unitario: valor_unitario.value
    }
    fetch(`/atividadeWeb/controllers/produtos_controller.php`, {
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
        descricao.disabled = true;
        valor_unitario.disabled = true;
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
      });
  }else{
    descricao.disabled = true;
    valor_unitario.disabled = true;
  }
}

async function deletaProduto(id){
  if(confirm(`certeza que deseja deletar esse registro?`)){
    const data = {
        id: id
    }
    fetch(`/atividadeWeb/controllers/produtos_controller.php`, {
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