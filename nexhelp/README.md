## NexHelp (Ionic + Angular)

Aplicativo móvel híbrido construído com Ionic Framework e Angular para consumir uma API em C#.

- **Instalação:** `npm install`
- **Executar em desenvolvimento:** `ionic serve`
- **Executar em dispositivo:** `ionic capacitor run android` ou `ionic capacitor run ios`
- **Configurar API:** defina `apiUrl` em `src/environments/environment*.ts`
- **Autenticação:** utilize a tela de login (`/login`) que consome o endpoint `POST /auth/login` e mantém o token JWT localmente
- **Teste rápido da API:** após logar, use o botão *Testar conexão com a API* na tela inicial para consumir `GET /status/health`
- **Serviços:** `ApiService` centraliza requisições HTTP e `AuthService` gerencia tokens e estado autenticado
