# FluentPath English

Primeiro prototipo de um app/site de ingles com:

- Pagina principal
- Login demonstrativo
- Area de cursos
- IA Coach simulada
- Treino de pronuncia com gravacao local de audio
- Gravacao local de audio/video para aulas presenciais, com consentimento

## Como abrir

Abra o arquivo `index.html` no navegador.

Alguns navegadores so permitem microfone/camera em `localhost` ou HTTPS. Se a gravacao nao abrir direto pelo arquivo, rode um servidor estatico local quando tiver Node, Python ou outra ferramenta instalada.

## Como rodar com Node

Este projeto usa Node via nvm. Se o terminal ainda nao reconhece `node`, rode:

```bash
source ~/.nvm/nvm.sh
nvm use
```

Depois:

```bash
npm start
```

O site abre em `http://127.0.0.1:5173`.

## Documentacao

A pasta `docs/` guarda o historico e as decisoes do projeto:

- `docs/000-process-log.md`
- `docs/001-product-vision.md`
- `docs/002-technical-roadmap.md`

## Proximos passos tecnicos

1. Criar backend com usuarios reais, perfis de aluno e professores.
2. Salvar progresso das licoes em banco de dados.
3. Enviar audios e videos autorizados para processamento.
4. Transcrever aulas e tentativas de pronuncia.
5. Gerar feedback personalizado da IA com historico do aluno.
6. Criar painel do professor com resumo de evolucao, dificuldades e recomendacoes.
7. Adicionar politicas de privacidade, consentimento, retencao e exclusao de gravacoes.
