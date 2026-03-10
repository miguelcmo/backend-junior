const express = require('express')

const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('Hola mundo desde Express')
})

app.get('/about', (req, res) => {
  res.send('Esta es la página about')
})

app.get('/contact', (req, res) => {
  res.send('Página de contacto')
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})