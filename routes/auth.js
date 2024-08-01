const express = require('express');
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretKey = "secret";

/**
 * @swagger
 * components:
 *    schemas:
 *     Authentication:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The users email
 *           example: test@gmail.com
 *         password:
 *           type: string
 *           description: The users password
 *           example: Test.123
 */

/**
    * Layer to make all auth operations
*/

/**
    * Check users credentials with email and password
    *
    * @remarks
    * Use bcrypt to compare password from BD
    * Generates JWT token valid for 12 hours
    * 
    * @returns Returns jwt token if authentication was correct
*/
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints to check users credentials with email and password, returns jwt token
 * /auth/login/:
 *   post:
 *     summary: Endpoints to check users credentials with email and password, returns jwt token
 *     tags: [Authentication]
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Authentication'
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Authentication problem, email/password are incorrect or user does not exist
 *       500:
 *         description: A server side error 
 */
router.post('/login',  async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        if (!isEmpty(email)) {
          res.status(400).json({ message: "Email is required" });
        }
        if (!isEmpty(password)) {
          res.status(400).json({ message: "Password is required" });
        }
        let isMatch = await checkCredentials(email, password)
  
        if(isMatch){
          const token = jwt.sign({ email }, secretKey, { expiresIn: "12h" });
          res.status(200).json({ token });
        }else{
          res.status(401).json({ message: "Authentication failed, email or password incorrect or email does not exist" });
        }      
  
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
})

/**
    * Validate if headers includes a valid jwt token
    *
    * @params 
    * req - incoming params
    * res - response
    * next flag to continue with execution
    * 
    * @remarks Verifies header to validate token
    *
    * @returns A users json object with user found in database
*/
function verifyToken(req, res, next) {
  const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token not provided" });
    }
    try {
      const payload = jwt.verify(token, secretKey);
      req.email = payload.email;
      next();
    } catch (error) {
      res.status(403).json({ message: "Token not valid" });
    }
}

/**
    * Validate empty values
    *
    * @params 
    * val - string to compare
    * 
    * @remarks Verifies if value is empty, undefined or null
    *
    * @returns A boolean indicating if value is empty or not
*/
function isEmpty(val){
    let flag = true;
    if (val == "" || val == " " || val == undefined || val == null){
        flag = false;
    }
    return flag;
}

/**
    * Validate users credentials in database
    *
    * @params 
    * email - users email to compare
    * password - plain password to compare
    * 
    * @remarks Compare password with bcrypt
    *
    * @returns A boolean indicating if credentials are correct or not
*/
async function checkCredentials(email, password){
    try{
        let auth = false;        
        const user = await User.findOne({ correo_electronico : email, activo: true });
        
        if(user != null){
            auth = await bcrypt.compare(password , user.contrasena)
        }
        
        return auth;
    }catch(ex){
        res.status(500).json({ message: "Error authenticating user " + ex });
    }
}

module.exports = router; 
//module.exports = verifyToken; 