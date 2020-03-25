const express = require('express');
const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController'); //Seleciona e aperta Control+d para mudar o proximo tbm
const ProfileController  = require('./controllers/ProfileController');
const SessionController  = require('./controllers/SessionController');
const routes = express.Router();

routes.post('/sessions', SessionController.create);
routes.get('/profile', ProfileController.index);

routes.post('/ongs', OngController.create);
routes.get('/ongs', OngController.index);

routes.post('/incidents', IncidentController.create);
routes.get('/incidents', IncidentController.index);
routes.delete('/incidents/:id', IncidentController.delete);

module.exports = routes;