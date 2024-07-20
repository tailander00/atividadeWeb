
async function carregarEstados() {

    // https://servicodados.ibge.gov.br/api/v1/localidades/estados
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')

    const estados = await response.json();

    preencherSelectEstados(estados);
}

function preencherSelectEstados(estados) {
  
    const select = document.getElementById("estados");

    estados.sort( (a, b) => a.nome.localeCompare(b.nome) );

    for(let estado of estados) {
        const { id, nome, sigla } = estado;

        const option = document.createElement("option");

        option.value = id;
        option.setAttribute("data-nome",nome);
        option.setAttribute("data-sigla",sigla);
        option.innerHTML = `${nome}-${sigla}`;

        select.appendChild(option);
 
    }

}

function defineEstado(){
    const selectEstados = document.getElementById("estados");
    const estadoIndex = selectEstados.selectedIndex;
    const estado = selectEstados.options[estadoIndex];
    document.getElementById("estado_aux").value = estado.getAttribute("data-nome");
    document.getElementById("sigla").value = estado.getAttribute("data-sigla");       
}

async function carregarCidades() {

    const selectEstados = document.getElementById("estados");

    const estado_index = selectEstados.selectedIndex;

    const estado_id = selectEstados.options[estado_index].value;

    if (estado_index === 0 || estado_id === "") {
        return;
    }

    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado_id}/municipios`);

    const cidades = await response.json();

    preencherSelectCidades(cidades);

}

function preencherSelectCidades(cidades) {

    const selectCidades = document.getElementById("cidades");

    for(const cidade of cidades) {

        const { id, nome } = cidade;

        const option = document.createElement("option");

        option.value = nome;
        option.innerHTML = nome;

        selectCidades.appendChild(option);

    }
}