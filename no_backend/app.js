const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./back/model');
const app = express();
const path = require('path');
const router = express.Router();
const PORT = 3000;

async function prepareRouters() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('front'))

    router.get('/',function(req,res){
      res.sendFile(path.join(__dirname+'/front/game/game.html'));
    });

    router.get('/bestPlayers',function(req,res){
      res.sendFile(path.join(__dirname+'/front/best/best.html'));
    });

    router.get('/myStats',function(req,res){
      res.sendFile(path.join(__dirname+'/front/stats/stats.html'));
    });

    router.get('/signIn',function(req,res){
      res.sendFile(path.join(__dirname+'/front/auth/auth.html'));
    });

    router.get('/signUp',function(req,res){
      res.sendFile(path.join(__dirname+'/front/signup/signup.html'));
    });

    //add the router
    app.use('/', router);
    
    const routes = {
        users: require('./back/routes/users'),
        // Add more routes here...
        // items: require('./routes/items'),
    };
    
    // We define the standard REST APIs for each route (if they exist).
    for (const [routeName, routeController] of Object.entries(routes)) {
        if (routeController.getAll) {
            app.get(
                `/api/${routeName}`,
                makeHandlerAwareOfAsyncErrors(routeController.getAll)
            );
        }
        if (routeController.getById) {
            app.get(
                `/api/${routeName}/:id`,
                makeHandlerAwareOfAsyncErrors(routeController.getById)
            );
        }
        if (routeController.create) {
            app.post(
                `/api/${routeName}`,
                makeHandlerAwareOfAsyncErrors(routeController.create)
            );
        }
        if (routeController.update) {
            app.put(
                `/api/${routeName}/:id`,
                makeHandlerAwareOfAsyncErrors(routeController.update)
            );
        }
        if (routeController.remove) {
            app.delete(
                `/api/${routeName}/:id`,
                makeHandlerAwareOfAsyncErrors(routeController.remove)
            );
        }
    }
}
