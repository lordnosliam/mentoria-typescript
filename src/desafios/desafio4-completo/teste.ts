var apiKey: string = 'fbd988569ee0c5336bf3de94d18a48fa';
let requestToken: string;
let username: string;
let password: string;
let sessionId: number = 0; 
let listId: string = '7101979';
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
let box1 = document.getElementById("dadosLogin");
let box2 = document.getElementById("search-container");

async function loginPress(){
    console.log(sessionId)
    try {  
      await criarRequestToken();
      await logar();
      await criarSessao();
      document.getElementById("dadosBusca")!.classList.remove("hide")
      document.getElementById("dadosBusca")!.classList.add("show")
      document.getElementById("dadosLogin")!.outerHTML = ""
      alert("Login efetuado com sucesso!")
    } catch(e) {
      alert("Dados incorretos. Tente novamente")
    }
}


async function searchPress() {

  let lista = document.getElementById("lista");
  if (lista) {
      lista.outerHTML = "";
  }

  let listBox = document.getElementById("listBox")!
  let query = (<HTMLInputElement>document.getElementById('search')!).value;
  let listaDeFilmes: any = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista";
  listBox.appendChild(ul);

  for (const item of listaDeFilmes.results) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(item.original_title))
      ul.appendChild(li)
  }
  console.log(listaDeFilmes);
   
}

function preencherSenha() {
  password = (<HTMLInputElement>document.getElementById('senha')!).value;
}

function preencherLogin() {
  username =  (<HTMLInputElement>document.getElementById('login')!).value;
}

class HttpClient {
  static async get({url, method, body = null}) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

async function adicionarFilme(filmeId: number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  })
  requestToken = result.request_token
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  })
  sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: number, listaId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}api_key=${apiKey}`,
    method: "GET"
  })
  console.log(result);
}