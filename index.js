import express from 'express';
const app = express();
import chalk from 'chalk'; 
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import nodemon from 'nodemon';

app.listen(3000, () => {
  console.log(chalk.green('El servidor está inicializado en el puerto 3000'));
});

app.use('/', (req, res, next) => {
  const url = 'https://randomuser.me/api/?results=10'; // Obtiene usuarios
//ocupamos Axios
  axios.get(url)
    .then(response => {
      const pacientes = response.data.results; // Datos de usuarios

      const datosPaciente = pacientes.map(paciente => ({
        nombre: paciente.name.first,
        apellido: paciente.name.last,
        id: uuidv4().slice(0, 6),
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
        genero: paciente.gender
      }));

      //ocupamos la funcion groupby de Lodash
      const agrupadosPorGenero = _.groupBy(datosPaciente, 'genero');
      //definimos las variables para agreupar por genero y mostrar por consola
      const hombres = agrupadosPorGenero.male || [];
      const mujeres = agrupadosPorGenero.female || [];
      //Generamos los logs por consola con chalk
      console.log("Mujeres:");
      mujeres.forEach((mujer, index) => {
        console.log(chalk.blue.bgWhite.bold(`${index + 1}. Nombre: ${mujer.nombre} - Apellido: ${mujer.apellido} - ID: ${mujer.id} - Timestamp: ${mujer.timestamp}`));
      });

      console.log("Hombres:");
      hombres.forEach((hombre, index) => {
        console.log(chalk.blue.bgWhite.bold(`${index + 1}. Nombre: ${hombre.nombre} - Apellido: ${hombre.apellido} - ID: ${hombre.id} - Timestamp: ${hombre.timestamp}`));
      });

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
