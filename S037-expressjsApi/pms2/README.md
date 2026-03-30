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

## Base de datos

* Definimos una carpeta database que aloja el db.js que el fichero que se encarga de las conexiones y la instanciacion de la base de datos
* Reemplazamos los proyectos y las tareas hardcodeadas por consultas a la base de datos, esto se hizo en los controladores

Routes -> Controllers -> Database

## Agregar la capa de servicio - Service Layer

* Extraer la parte transaccional de la base de datos de los controladores y lo vamos a separar a el service layer

Routes -> Controllers -> Services -> Database
 
Routes
Definir los endpoints

Controllers
Manejar el request y el response

Services
Logica de negocio

Database
Acceso a la base de datos
