enum profissoes {
    Atriz,
    Padeiro
}

interface pessoa {
    nome: string,
    idade: number,
    profissao: profissoes
}

let pessoa1: pessoa = {
    nome: "maria",
    idade: 29,
    profissao: profissoes.Atriz
}

let pessoa2: pessoa = {
    nome: "roberto",
    idade: 19,
    profissao: profissoes.Padeiro
}

let pessoa3: pessoa = {
    nome: "laura",
    idade: 32,
    profissao: profissoes.Atriz
};

let pessoa4: pessoa = {
    nome: "carlos",
    idade: 19,
    profissao: profissoes.Padeiro
}