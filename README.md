# Pied Piper draws API

Backend de la aplicación de gestión de sorteos desarrollada por el equipo Pied Piper para el Code Quest 2024 de DevTalles

# Requisitos

- NodeJS v20
- Docker
- MongoDB docker image:

```bash
$ docker pull mongo:6.0.6
```

- Esta app está desarrollada mediante pnpm, el cual se puede instalar con el siguiente comando:

```bash
$ npm install -g pnpm
```

# Instalación

1. Clonar el repositorio
2. Instalar las dependencias

```bash
$ pnpm install
```

3. Copiar el archivo .env.template y renombrar a .env para establecer las variables de entorno. Modificar su contenido como sea necesario.

4. Levantar base de datos con docker

```bash
$ docker compose up -d
```

5. Ejecutar el proyecto en modo de desarrollo

```bash
$ pnpm dev
```

# Iniciar en producción

1. Instalar las dependencias
2. Generar build de producción

```bash
$ pnpm build
```

3. Iniciar servidor a partir del build de producción

```bash
$ pnpm start

# O generar el build e iniciar en un solo comando
$ pnpm build:start
```

# Utils

## - DiscordPortal para desarrolladores

[Discord developer Portal](https://discord.com/developers/docs/intro)

## - Generar semilla para JWT

```bash
# Usando OpenSLL
$ openssl rand -base64 32

# Usando NodeJS
$ node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"
```

## - Formatear el código con Prettier

```bash
# Formatea el código
$ pnpm format

# Solo analiza los archivos e indica si hay código que necesita ser formateado
$ pnpm format:check
```

# Stack

- NodeJS
- Express
- Socket.io
- MongoDB
- Docker
