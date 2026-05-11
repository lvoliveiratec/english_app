# Process Log

Este documento registra o que estamos construindo e por que cada passo foi feito.

## 2026-05-11

- Criamos o primeiro prototipo estatico do FluentPath English.
- O site inclui pagina principal, login demonstrativo, cursos e area de IA Coach.
- A IA Coach ainda e uma simulacao local, mas ja mostra a experiencia desejada: saudacao personalizada, resumo de progresso e sugestoes de pronuncia.
- Adicionamos gravacao local de voz para treino de pronuncia.
- Adicionamos gravacao local de audio/video para aulas presenciais, com aviso de consentimento.
- Instalamos Node via nvm para rodar ferramentas locais sem depender de instalacao global do sistema.
- Preparamos scripts npm e um servidor local simples com Node.
- Iniciamos a estrutura de documentacao em `docs/`.

## Decisoes importantes

- O prototipo atual nao envia audio ou video para nenhum servidor.
- Gravacoes precisam ter consentimento claro de aluno e professor.
- Antes de usar IA real com audio/video, o app precisa de backend, autentificacao, politicas de privacidade e regras de retencao/exclusao.
