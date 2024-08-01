const express = require('express');
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt');
const verifyToken = require("./auth");

/**
 * @swagger
 * components:
 *    schemas:
 *     NewUser:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido_paterno
 *         - fecha_nacimiento
 *         - contrasena
 *         - perfil
 *         - correo_electronico
 *       properties:
 *         nombre:
 *           type: string
 *           description: The users name
 *           example: Alejandro
 *         apellido_paterno:
 *           type: string
 *           description: The users last name
 *           example: Perez
 *         apellido_materno:
 *           type: string
 *           description: The users last name
 *           example: Morales
 *         fecha_nacimiento:
 *           type: string
 *           description: The users DOB
 *           example: 1995-07-25
 *         contrasena:
 *          type: string
 *          description: The users password
 *          example: Alex.321
 *         perfil:
 *           type: string
 *           description: The users role
 *           example: Usuario
 *         correo_electronico:
 *           type: string
 *           description: The users mail
 *           example: alejandro@gmail.com
 */

/**
 * @swagger
 * components:
 *    schemas:
 *     UpdateUser:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido_paterno
 *         - apellido_materno
 *         - fecha_nacimiento
 *         - perfil
 *       properties:
 *         nombre:
 *           type: string
 *           description: The users name
 *           example: Alejandro
 *         apellido_paterno:
 *           type: string
 *           description: The users last name
 *           example: Perez
 *         apellido_materno:
 *           type: string
 *           description: The users last name
 *           example: Morales
 *         fecha_nacimiento:
 *           type: string
 *           description: The users DOB
 *           example: 1995-07-25
 *         perfil:
 *           type: string
 *           description: The users role
 *           example: Usuario
 */

/**
    * Layer to make all users operations in database
*/

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints to manage users information. ONLY users with jwt can execute this endpoint
 * /users/:
 *   get:
 *     summary: Returns all users registered in database. ONLY users with jwt can execute this endpoint
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: Users were not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get all users found in database
    *
    * @remarks
    * returns only active users
    * Uses verifyToken middleware to validate if user has valid JWT token
    * 
    * @returns A users json object with all users found in database
*/
router.get('/',  async (req, res) => {
    try{
        
        const users = await User.find({ activo: true });
        console.log("Tam users")
        console.log(users.length)
        if(users.length == 0){
            res.status(404).json({message : "Users were not found in database"})
        }
        res.json(users)

    }catch(ex){
        res.status(500).json({message : ex.message})
    }
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a user specified by id. ONLY users with jwt can execute this endpoint
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The users id
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: User was not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get a specific user found in database by id
    *
    * @param id - the users id
    *   
    * @remarks
    * getUserById function is used to get user by id
    *
    * @returns A users json object with all users found in database
*/
router.get('/:id', getUserById, (req, res) => {
    console.log("ID GET USERS ")
    console.log(req.params.id)
    res.json(res.user)
})

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Returns a user specified by email. ONLY users with jwt can execute this endpoint
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *           required: true
 *           description: The users email
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, a valid jwt token is required
 *       404:
 *         description: User was not found in DB
 *       500:
 *         description: A server side error 
 */
/**
    * Get a specific user found in database by email
    *
    * @param email - the user id
    *   
    * @remarks
    * getUserByEmail function is used to get user by email
    *
    * @returns A users json object with all users found in database
*/
router.get('/email/:email', getUserByEmail, (req, res) => {
    res.json(res.user)
})

/**
 * @swagger
 * /users/:
 *   post:
 *     produces:
 *          - application/json
 *     consumes:
 *          - application/json
 *     summary: Insert a new user into daabase. ONLY users with jwt can execute this endpoint
 *     tags: [Users]
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: A successful response, user created.
 *       400:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Create a new user in database
    *
    * @remarks
    * This method creates a hashed password in DB
    * By default, all created users have "Active" status
    * This method validates if user exists before inserting record.
    * getUserById function is used to validate if user exists
    * 
    * @param req.body - User object to be inserted in database
    *
    * @returns A users json object with created user in database
*/
router.post('/', async(req, res) => {

    try{
        const salt = await bcrypt.genSalt();
        let password = req.body.contrasena;                
        console.log("req.body.nombre")
        console.log(req.body.nombre)
        //const hashedPassword = await bcrypt.hash(password, salt); 
        //console.log("hashed  " + hashedPassword)
        const user = new User({
            nombre: req.body.nombre,
            apellido_paterno: req.body.apellido_paterno,
            apellido_materno: req.body.apellido_materno,
            fecha_nacimiento: req.body.fecha_nacimiento,
            //contrasena: hashedPassword,
            contrasena: req.body.contrasena,
            perfil: req.body.perfil,
            activo: req.body.activo,
            fecha_alta: req.body.fecha_alta,
            correo_electronico: req.body.correo_electronico
        })

        console.log("USER")
        console.log(user)

        let existingEmail = await existUserByEmail(req.body.correo_electronico);
        console.log("existingEmail " + existingEmail)
        if(existingEmail){
            res.status(500).json({message : "User with email " + req.body.correo_electronico + " already exists" })
            return true;
        }
    
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch(ex){
        res.status(400).json({message : ex.message})
    }
})

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update an existing user. ONLY users with jwt can execute this endpoint
 *     produces:
 *          - application/json
 *     consumes:
 *          - application/json
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The users id
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: A successful response, user updated.
 *       400:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Update information of an existing user in database
    *
    * @param id - User id to be updated
    * @param req.body - User object to be updated in database
    * 
    * @remarks
    * This method validates if the indicated user exist, if not, an exception is thrown.
    * getUserById function is used to validate if user exists
    *
    * @returns A users json object with updated user in database
 */
router.patch('/:id', getUserById, async (req, res) => {
    
    /*let existingEmail = await existUserByEmail(req.body.correo_electronico);
    console.log("existingEmail " + existingEmail)
    if(!existingEmail){
        res.status(500).json({message : "User with email " + req.body.correo_electronico + " does not exist to update" })
        return true;
    }*/


    try{
        console.log("req.params.id")
        console.log(req.params.id)
        console.log("req.body")
        console.log(req.body)

        let updatedUser = await User.findByIdAndUpdate(req.params.id, {
            nombre: req.body.nombre,
            apellido_paterno: req.body.apellido_paterno,
            apellido_materno: req.body.apellido_materno,
            fecha_nacimiento: req.body.fecha_nacimiento,
            perfil: req.body.perfil
        }, { 'new': true})
        res.json(updatedUser)
    }catch(ex){
        res.status(400).json({message : ex.message})
    }


    /*console.log("passcw upda")
    console.log(req.body.contrasena)
    console.log(req.body.nombre)
    
    if(req.body.nombre != null){
        res.user.nombre = req.body.nombre
    }
    if(req.body.apellido_paterno != null){
        res.user.apellido_paterno = req.body.apellido_paterno
    }
    if(req.body.apellido_materno != null){
        res.user.apellido_materno = req.body.apellido_materno
    }
    if(req.body.fecha_nacimiento != null){
        res.user.fecha_nacimiento = req.body.fecha_nacimiento
    }
    if(req.body.perfil != null){
        res.user.perfil = req.body.perfil
    }
    if(req.body.activo != null){
        res.user.activo = req.body.activo
    }
    if(req.body.contrasena != null && req.body.contrasena != undefined){
        res.body.contrasena = req.body.contrasena
    }
    console.log(res.user)

    const { contrasena, ...withoutFirst } = res.user;
    console.log(withoutFirst)
    try{
        const updatedUser = await res.user.save();
        res.json(updatedUser)
    }catch(ex){
        res.status(400).json({message : ex.message})
    }*/
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete an existing user. ONLY users with jwt can execute this endpoint
 *     produces:
 *          - application/json
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The users id
 *     responses:
 *       200:
 *         description: A successful response, user deleted.
 *       400:
 *         description: Unauthorized, a valid jwt token is required
 *       500:
 *         description: A server side error 
 */
/**
    * Delete an existing user in database
    *
    * @param id - User id to be deleted
    * 
    * @remarks 
    * This method validates if user exists, if not an exception is thrown.
    * getUserById function is used to validate if user exists
    * A soft delete is made, records are kept in DB, only corresponding flags are updated
    *
    * @returns response confirmation message
*/
router.delete('/:id', getUserById, async (req, res) => {
    try{
        console.log("delete")
        console.log(res.user._id)
        console.log(res.user._id)
        let fechaBaja = new Date();
        const filter = { _id: res.user._id };
        const update = { activo: false, fecha_baja: fechaBaja };

        //await res.restaurant.deleteOne();
        doc = await User.findOneAndUpdate(filter, update);

        //await res.user.deleteOne();
        res.json({ message: "User was deleted" })
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
async function getUserById(req, res, next){
    let user;
    try{
        //user = await User.findById(req.params.id);
        user = await User.findOne( { _id:req.params.id, activo: true } );
        console.log("userbyid " + req.params.id)
        console.log(user)
        if(user == null){
            return res.status(404).json({ message: "User with id " + req.params.id +  " was not found" })
        }
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
    res.user = user
    next()
}

/**
    * Get a flag whether user exist or not in DB
    *
    * @param email - the user email
    *
    * @remarks Returns only active users   
    *
    * @returns A users json object with the user found in database
*/
async function existUserByEmail(email){
    let user;
    let flag = false;

    try{
        console.log("findbyema " + email)
        user = await User.findOne({ correo_electronico : email, activo: true });
        console.log(user)
        if(user != null){
            flag = true;
        }
        console.log("findbyema " + flag)
        return flag;
    }catch(ex){
        console.log("Error in existUserByEmail " + ex.message)
        res.status(500).json({ message: "Error in existUserByEmail " + ex });
    }
}

/**
    * Get a specific user found in database by email
    *
    * @param email - the user email
    * 
    * @remarks Returns only active users  
    *
    * @returns A users json object with user found in database
*/
async function getUserByEmail(req, res, next){
    let user;
    try{
        //user = await User.findById(req.params.id);
        console.log("corre " + req.params.email)
        user = await User.findOne( { correo_electronico : req.params.email, activo: true } );
        //console.log(user.length)
        if(user == null){
            return res.status(404).json({ message: "User with email " + req.params.email +  " was not found" })
        }
    }catch(ex){
        res.status(500).json({message : ex.message})
    }
    res.user = user
    next()
}

module.exports = router; 