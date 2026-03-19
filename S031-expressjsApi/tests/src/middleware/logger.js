const logger = (req, res, next) => {

//   console.log(
//     `${req.method} ${req.url} - ${new Date().toISOString()}`
//   );

  const fecha = new Date().toISOString()

//   const fecha = new Date().toLocaleString('es-CO', {
//     timeZone: 'America/Bogota',
//     hour12: false
//   });

  console.log(
    `${req.method} ${req.url} - ${fecha}`
  );

  next();

};

module.exports = logger;