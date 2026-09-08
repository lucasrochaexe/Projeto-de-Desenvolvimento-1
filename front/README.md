# Dexter - Front-end

Aplicativo mobile desenvolvido com Expo, React Native e TypeScript.

## Requisitos

- Node.js instalado (versão LTS recomendada)
- npm, instalado junto com o Node.js
- Expo Go no celular, caso o aplicativo seja executado em um dispositivo físico
- Android Studio e um emulador Android, caso seja executado localmente no Android
- Xcode e um simulador iOS, caso seja executado no iOS (somente macOS)

## Instalação

No terminal, entre na pasta do front-end:

```bash
cd front
```

Instale as dependências do projeto:

```bash
npm install
```

## Execução

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Depois, use o QR Code exibido no terminal ou no painel do Expo para abrir o aplicativo no Expo Go.

Também estão disponíveis os comandos:

```bash
npm run android  # abre no emulador ou dispositivo Android
npm run ios      # abre no simulador ou dispositivo iOS
npm run web      # abre a versão web
```

## Tecnologias principais

- Expo `~57.0.20`
- React `19.2.3`
- React Native `0.86.3`
- TypeScript `~6.0.3`

As versões completas e os scripts do projeto estão definidos em `package.json`. O arquivo `package-lock.json` deve ser mantido no repositório para garantir instalações reproduzíveis.


 npx expo start