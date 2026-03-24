# Project Management System - API

## Estructura inicial
Inicializacion de un projecto JS con npm e instalacion basica de express y creacion del servidor en server.js 

-project-management-system-api
--package.json
--server.js

## Estructura final
Vamos a tener una esturtcura basada en un patron de arquitectura RCMS:

-project-management-system-api
--src
--routes
--controllers
--models
--services
--middleware (funciones utilitarias que se desarrollan en express para ampliar su funcionalidad)
--database

## Middleware
Funciones o fragmentos de codigo que se ejecutan en medio del proceso de comunicacion

Request -> Middleware * n -> Routes -> Controller -> Response