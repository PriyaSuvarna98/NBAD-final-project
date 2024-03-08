const express = require('express');
const controller = require('../controllers/connectionsController');
//const model = require('../models/connectionsData');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const{validateId} = require('../middlewares/validator');

const router = express.Router();

//GET / - sends a list of connections
router.get('/', controller.getConnections);

//GET /newConnection - sends a form to add new connection
router.get('/newConnection', isLoggedIn, controller.getNewConnection);

//POST / - stores the new connection when submit is clicked
router.post('/', isLoggedIn, controller.postNewConnection);

//GET /:id - sends the connection details as per id
router.get('/:id', validateId, controller.getConnectionDetail);

//GET /:id/edit - sends the update form
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.getEdit);

//PUT / - stores the updated connection as per the id
router.put('/:id', validateId, isLoggedIn, isAuthor, controller.updateConnection);

//DELETE /:id - deletes the connection as per the id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.deleteConnection);

module.exports = router;