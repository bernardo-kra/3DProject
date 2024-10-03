# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Passo a Passo para Gerenciar Branches
1. Criar uma Nova Branch
Quando você começar a trabalhar em uma nova funcionalidade ou correção de bug, siga os passos abaixo:

Mude para a branch dev:
Execute git checkout dev.

Crie uma nova branch:
Execute git checkout -b feature/nome-da-funcionalidade.

Exemplo:
Se estiver trabalhando na funcionalidade de login, o comando será:
git checkout -b feature/login.

2. Desenvolver e Comitar as Alterações
Após fazer as alterações necessárias:

Adicione as mudanças:
Execute git add ..

Faça um commit:
Execute git commit -m "Descrição clara do que foi feito".

3. Testar Localmente
Realize testes locais para garantir que a funcionalidade está funcionando como esperado.

4. Mesclar a Branch no dev
Após concluir e testar a funcionalidade:

Volte para a branch dev:
Execute git checkout dev.

Mescle a nova branch:
Execute git merge feature/nome-da-funcionalidade.

5. Testar na Branch dev
Realize testes adicionais na branch dev para verificar se a nova funcionalidade não quebrou nada existente.

6. Mesclar dev no master
Quando a nova funcionalidade estiver testada e aprovada:

Mude para a branch master:
Execute git checkout master.

Mescle a branch dev:
Execute git merge dev.

7. Fazer o Deploy
Realize o deploy da branch master para o ambiente de produção.

8. Excluir a Branch de Funcionalidade
Após a mesclagem:

Exclua a branch de funcionalidade:
Execute git branch -d feature/nome-da-funcionalidade.
