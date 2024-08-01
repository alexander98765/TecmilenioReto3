const express = require('express');
const router = express.Router()
const Restaurant = require('../models/restaurants')
//const verifyToken = require("../routes/auth");

/**
 * @swagger
 * components:
 *    schemas:
 *     CustomRadius:
 *       type: object
 *       required:
 *         - kmRound
 *         - latitude
 *         - longitud
 *       properties:
 *         kmRound:
 *           type: string
 *           description: Search radius defined by user
 *           example: 15
 *         latitude:
 *           type: string
 *           description: The users latitude, from browser
 *           example: 19.619299568195867
 *         longitud:
 *           type: string
 *           description: The users longitud, from browser
 *           example: -98.99681174968705
 */

/**
 * @swagger
 * components:
 *    schemas:
 *     FixedRadius:
 *       type: object
 *       required:
 *         - latitude
 *         - longitud
 *       properties:
 *         latitude:
 *           type: string
 *           description: The users latitude, from browser
 *           example: 19.619299568195867
 *         longitud:
 *           type: string
 *           description: The users longitud, from browser
 *           example: -98.99681174968705
 */

/**
 * @swagger
 * components:
 *    schemas:
 *     NewComment:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         comentario:
 *           type: string
 *           description: The users comment
 *           example: Restaurante excelente con precios accesibles
 *         rating:
 *           type: string
 *           description: The users rating
 *           example: 4
 */

/**
 * @swagger
 * components:
 *    schemas:
 *     Address:
 *       type: object
 *       required:
 *         - colonia
 *         - numero
 *         - estado
 *       properties:
 *         colonia:
 *           type: string
 *           description: The restaurant location
 *           example: Nombre colonia
 *         numero:
 *           type: string
 *           description: The restaurant locations number
 *           example: 34-a
 *         estado:
 *           type: string
 *           description: The restaurant state
 *           example: Ciudad de Mexico
 *         delegacion_municipio:
 *           type: string
 *           description: The restaurant locations number
 *           example: Gustavo A Madero
 *         codigo_postal:
 *           type: string
 *           description: The restaurant locations number
 *           example: 58764
 *         coordenadas:
 *           type: string
 *           description: The restaurant locations number
 *           example: [-34343434.34, 4545454545]
 *         tipo_vialidad:
 *           type: string
 *           description: The restaurant locations stret
 *           example: Avenida
 *         vialidad:
 *           type: string
 *           description: The restaurant locations number
 *           example: Avenida de ejemplo
 */

/**
 * @swagger
 * components:
 *    schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo_cocina
 *         - direccion
 *         - telefono
 *         - hora_apertura
 *         - hora_cierre
 *       properties:
 *         nombre:
 *           type: string
 *           description: The restaurants name
 *           example: Restaurante patito
 *         tipo_cocina:
 *           type: string
 *           description: The restaurants cosuine type
 *           example: Comida mexicana
 *         direccion:
 *           type: array
 *           description: The restaurants address
 *           items: 
 *              $ref: '#/components/schemas/Address'
 *         telefono:
 *           type: string
 *           description: The restaurants phone
 *           example: 5545875456
 *         hora_apertura:
 *           type: string
 *           description: The restaurants open hour
 *           example: 11:00
 *         hora_cierre:
 *           type: string
 *           description: The restaurants close hour
 *           example: 23:00
 */

/**
    * Layer to make all restaurants operations in database
*/

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Endpoints to manage restaurants information. Some endpoints are public and some need jwt token
 * /restaurants/:
 *   get:
 *     summary: Returns all restaurants registered in database. Public endpoint (no jwt is required) 
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurants were not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get all restaurants found in database
    *
    * @remarks
    * returns only active restaurants
    * 
    * @returns A restaurants json object with all restaurants found in database
*/
router.get('/', async (req, res) => {
    try{
        const restaurants = await Restaurant.find({ activo: true });
        if(restaurants.length == 0){
            res.status(404).json({message : "Retaurants were not found in database"})
        }
        res.json(restaurants)


        /*let ids = "123456789012345678901234";
        var query=[{
            "$lookup": {
                "from": "comments",
                "localField": "_id",
                "foreignField": "restaurante",
                "as": "resta"
            }
        },{
            "$unwind": "$resta"
        },{
            "$match": {
                "$and": [{
                    "resta.restaurante": ids
                }]
            }
        }];
        Restaurant.aggregate(query, function (err, races){
            console.log("fin aaa")
        })*/
        
        
        /*let jsonData = {}
        let jsonDataCom = {}
        let newData = [];
        let dbcourse = [];
        let test = await Restaurant.find({ activo: true }) 
            .then(dataRes => { 
                //console.log("Restaurantes active:") 
                //console.log(data); 
        
                // Putting all course id's in dbcourse array 
                newData = dataRes.map((d, k) => { 
                    //dbcourse.push(d._id); 
                    //console.log("k")
                    //console.log(k)
                    Comment.find({ restaurante: d._id }) 
                    .then(data => { 
                        console.log("comments with restaurant id:" + d._id) 
                        //console.log(data); 
                        //jsonData = d.toJSON();
                        jsonData = d;
                        //console.log("jsonData")
                        //console.log(jsonData)
                        jsonDataCom = data
                        jsonData.comentarios = jsonDataCom
                        console.log("attach")
                        console.log(jsonData)
                        
                    }) 
                    .catch(error => { 
                        console.log(error); 
                    })
                    res.json(jsonData)
                }) 
                
            }) 
            .catch(error => { 
                console.log(error); 
            })
console.log("test")
console.log(newData)*/
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Returns a restaurant specified by id. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants id
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurant was not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get a specific restaurant found in database by id
    *
    * @param id - the restaurant id
    *   
    * @remarks
    * getRestaurantById function is used to get restaurant by id
    *
    * @returns A restaurants json object with all restaurants found in database
*/
router.get('/:id', getRestaurantById, (req, res) => {
    res.json(res.restaurant)
})

/**
 * @swagger
 * /restaurants/name/{name}:
 *   get:
 *     summary: Returns a restaurant specified by name. LIKE Clause is used to get coincidences. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants name
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurant was not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get all restaurants found in database by name
    *
    * @param name - the restaurant name
    * 
    * @remarks
    * like clause was used 
    * Returns only active restaurants
    * 
    * @returns A restaurants json object with all restaurants found in database wheere name matches
*/
router.get('/name/:name', async (req, res) => {
    try{
        var search = req.params.name;

        let restaurants = await Restaurant.find( { 'nombre' : { '$regex' : search, '$options' : 'i' }, activo: true } )
        
        if(restaurants.length == 0){
            res.status(404).json({message : "Retaurant with name " + search + " not found in database"})
        }

        res.json(restaurants)
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/cousine/{cousine}:
 *   get:
 *     summary: Returns a restaurant specified by cousine type. LIKE Clause is used to get coincidences. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: cousine
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants cousine type
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurant was not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get all restaurants found in database by name
    *
    * @param cousine - the restaurant cousine type
    * 
    * @remarks
    * like clause was used 
    * Returns only active restaurants
    * 
    * @returns A restaurants json object with all restaurants found in database wheere cousine matches
*/
router.get('/cousine/:cousine', async (req, res) => {
    try{
        var search = req.params.cousine;
        let restaurants = await Restaurant.find( { 'tipo_cocina' : { '$regex' : search, '$options' : 'i' }, activo: true } )

        if(restaurants.length == 0){
            res.status(404).json({message : "Retaurant with cousine type " + search + " not found in database"})
        }

        //const restaurants = await Restaurant.find({ activo: true });
        res.json(restaurants)
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/location/radius:
 *   post:
 *     summary: Get all restaurants found nearby determined by the distance indicated by the user. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/CustomRadius'
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurants were not found in DB
 *       500:
 *         description: A server side error 
 */

/**
    * Get all restaurants found nearby determined by the distance indicated by the user.
    * Central point corresponds to current users location
    *
    * @remarks
    * Location found within a circle
    * Returns only active restaurants
    * Current location is sended from user´s browser to use a more accurate location
    * Fixed value 6378.1 used to converts to Kms
    * 
    * @returns A restaurants json object with all restaurants found nearby users location 
*/
router.post('/location/radius', async (req, res) => {
    try{
        let kmRound = req.body.kmRound
        let latitude = req.body.latitude
        let longitud = req.body.longitud
        let restaurants
        if(kmRound != "" && kmRound != " " && kmRound != undefined && kmRound != null){
            let isnum = /^\d+$/.test(kmRound);
            if(isnum){                

                restaurants = await Restaurant.find( {
                    "direccion.coordenadas": {
                       $geoWithin: {
                          $centerSphere: [
                             [ longitud, latitude ],
                             kmRound / 6378.1
                          ]
                       }
                    },
                    activo: true
                })

                if(restaurants.length == 0){
                    res.status(404).json({message : "Restaurants were not found in database with those params"})
                }

                res.json(restaurants)

            }else{
                res.status(500).json({message : "The kmRound value must be a number"})    
            }
        }else{
            res.status(500).json({message : "The kmRound value is mandatory"})
        }

    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/location/radius5km:
 *   post:
 *     summary: Get all restaurants found nearby 5 km from users location. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/FixedRadius'
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurants were not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get all restaurants found nearby 5KM from users location
    * Central point corresponds to current users location
    *
    * @remarks
    * Location found within a 5 km circle
    * Returns only active restaurants
    * Current location is sended from user´s browser to use a more accurate location
    * Fixed value 6378.1 used to converts to Kms
    * 
    * @returns A restaurants json object with all restaurants found near 5KM users location 
*/
router.post('/location/radius5km', async (req, res) => {
    try{
        let kmRound = 5
        let latitude = req.body.latitude
        let longitud = req.body.longitud
        let restaurants
        if(kmRound != "" && kmRound != " " && kmRound != undefined && kmRound != null){
            let isnum = /^\d+$/.test(kmRound);
            if(isnum){                

                restaurants = await Restaurant.find( {
                    "direccion.coordenadas": {
                       $geoWithin: {
                          $centerSphere: [
                             [ longitud, latitude ],
                             kmRound / 6378.1
                          ]
                       }
                    },
                    activo: true
                })

                if(restaurants.length == 0){
                    res.status(404).json({message : "Restaurants were not found in database nearby 5km and with those params"})
                }

                res.json(restaurants)

            }else{
                res.status(500).json({message : "The kmRound value must be a number"})    
            }
        }else{
            res.status(500).json({message : "The kmRound value is mandatory"})
        }

    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/rating/{id}:
 *   get:
 *     summary: Get restaurant average rating according to users comments / ratings. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants id
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Restaurants were not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get restaurant average rating according to users comments / ratings
    *
    * @param id - the restaurants id
    * 
    * @remarks
    * Considers only active restaurants
    * 
    * @returns Integer with the restaurants average rating
*/
router.get('/rating/:id', async (req, res) => {
    try{
        
        let restaurantId = req.params.id;
        let generalRating = 0;
        let temporalRating = 0;
        let totalRat = 0;
        
        let ratings = await Restaurant.find({ _id : restaurantId, activo: true }) 
            .then(dataRes => { 

                newData = dataRes.map((d, k) => { 
                
                    let comments = d.comentarios
                    comments.forEach(function(value){
                        rat = value.rating
                        isnum = /^\d+$/.test(rat);
                        totalRat = totalRat + 1
                        if(isnum){
                            temporalRating = temporalRating + parseInt(rat, 10);
                        }
                    });        
                    
                    generalRating = temporalRating / totalRat
                    generalRating =  Math.round(generalRating) 
                    mess = "Restaurant " + d.nombre + " has rating of "            
                    res.status(200).json({message : generalRating })

                })                 
            }) 

        .catch(error => { 
            res.status(500).json({message : error })
        })

    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant in database. ONLY users with jwt can execute this endpoint
 *     tags: [Restaurants]
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Create a new restaurant in database
    *
    * @remarks
    * By default, all created restaurants have "Active" status
    * 
    * @param req.body - Restaurant object to be inserted in database
    *
    * @returns A restaurant json object with created restaurant in database
*/
router.post('/', async(req, res) => {
    const restaurant = new Restaurant({
        nombre: req.body.nombre,
        tipo_cocina: req.body.tipo_cocina,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        hora_apertura: req.body.hora_apertura,
        hora_cierre: req.body.hora_cierre
    })

    try{
        const newRestaurant = await restaurant.save();
        res.status(201).json(newRestaurant);
    }catch(ex){
        res.status(400).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     summary: Update a restaurant in database. ONLY users with jwt can execute this endpoint
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants id
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Update information of an existing restaurant in database
    *
    * @param id - Restaurant id to be updated
    * @param req.body - Restaurant object to be updated in database
    * 
    * @remarks
    * This method validates if the indicated restaurant exist, if not, an exception is thrown.
    * getRestaurantById function is used to validate if restaurant exists
    *
    * @returns A restaurant json object with updated restaurant in database
 */
router.patch('/:id', getRestaurantById, async (req, res) => {
    if(req.body.nombre != null){
        res.restaurant.nombre = req.body.nombre
    }
    if(req.body.tipo_cocina != null){
        res.restaurant.tipo_cocina = req.body.tipo_cocina
    }
    if(req.body.direccion != null){
        res.restaurant.direccion = req.body.direccion
    }
    if(req.body.telefono != null){
        res.restaurant.telefono = req.body.telefono
    }
    if(req.body.hora_apertura != null){
        res.restaurant.hora_apertura = req.body.hora_apertura
    }
    if(req.body.hora_cierre != null){
        res.restaurant.hora_cierre = req.body.hora_cierre
    }
    try{
        //let upRestaurant = new Restaurant(res.restaurant);
        const updatedRestaurant = await res.restaurant.save();
        res.json(updatedRestaurant)
    }catch(ex){
        res.status(400).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/comment/{id}:
 *   patch:
 *     summary: Insert a new comment to an specified restaurant. Public endpoint (no jwt is required)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants id
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/NewComment'
 *     responses:
 *       201:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Create a new comment in database
    *
    * @param id - Restaurant id to be updated
    * @param req.body - Restaurant object to be updated in database
    * 
    * @remarks
    * This method creates a new comment in DB
    *
    * @returns A restaurant json object with updated restaurant comments in database
 */
router.patch('/comment/:id', getRestaurantById, async (req, res) => {
    try{

        let comentarios = {
            "fecha_comentario": new Date(),
            "comentario": req.body.comentario,
            "rating": req.body.rating
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate({ _id: res.restaurant._id }, { $push: { comentarios: comentarios } }, { 'new': true});
        res.json(updatedRestaurant)

    }catch(ex){
        res.status(400).json({message : ex.message})
    }
})

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete an existing restaurant. ONLY users with jwt can execute this endpoint
 *     produces:
 *          - application/json
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The restaurants id
 *     responses:
 *       200:
 *         description: A successful response, restaurant deleted.
 *       400:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Delete an existing restaurant in database
    *
    * @param id - Restaurant id to be deleted
    * 
    * @remarks 
    * This method validates if restaurant exists, if not an exception is thrown.
    * getRestaurantById function is used to validate if user exists
    *
    * @returns response confirmation message
*/
router.delete('/:id', getRestaurantById, async (req, res) => {
    try{

        let fechaBaja = new Date();
        const filter = { _id: res.restaurant._id };
        const update = { activo: false, fecha_baja: fechaBaja };
        
        doc = await Restaurant.findOneAndUpdate(filter, update);

        //await res.restaurant.deleteOne();        

        res.json({ message: "Restaurant was deleted" })
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
    * Get a specific user found in database
    *
    * @param id - the user id
    *   
    * @remarks Returns only active users
    *
    * @returns A users json object with all users found in database
*/
async function getRestaurantById(req, res, next){
    let restaurant;
    try{
        restaurant = await Restaurant.findOne( { _id:req.params.id, activo: true } );
        if(restaurant == null){
            return res.status(404).json({ message: "Restaurant with id " + req.params.id + " was not found"})
        }
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
    res.restaurant = restaurant
    next()
}

module.exports = router; 