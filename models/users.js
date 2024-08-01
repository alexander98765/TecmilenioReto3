const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

/**
    * Schema to declare users structure in DB
*/

/**
    * Enum variable to store all posible values for perfil field
*/
var rolesEnum = {
    values: ["Administrador", "Usuario"]
  , message: 'Rol must be Administrador or Usuario.'
}

/**
    * Function to validate if email has right structure
    *
    * @remarks
    * Validates mail name
    * Validates at symbol in the middle
    * Validates domain name
    * Validates dot symbol and extension
    * 
    * @returns A boolean indicating if email structure is valid or not
*/
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

/**
    * Function to validate if string has only letters
    *
    * @param val - string to compare
    *   
    * @remarks
    * Use regex to make avalidation
    *
    * @returns A boolean indicating if string has only letters or not
*/
var validateOnlyLetters = function(val) {
    var re = /^[a-zA-Z ]*$/;
    //var re = /[^a-zA-Z\s]+/
    return re.test(val)
};

/**
    * Function to validate if date has right format in yyyy-mm-dd
    *
    * @param dateString - date to compare
    *   
    * @remarks
    * Use regex to make validation
    *
    * @returns A boolean indicating if date has right structure or not
*/
var isValidDate =function(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
}

/**
    * Function to validate if password has right security level
    *
    * @param pw - password to compare
    *   
    * @remarks
    * Use regex to make validation
    * At least 1 uppercase
    * At least 1 lowercase
    * At least 1 number
    * At least 1 special character
    * Minimum 8 length
    * Maximum 10 length
    *
    * @returns A boolean indicating if password has right security level or not
*/
var isStrongPassword = function(pw){
    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length >= 8 &&
           pw.length <= 10;
}

/**
    * Variable to declare users schema, fields types and custom validations for each field
*/

/**
    * Activate validations even for updates
*/
mongoose.set('runValidators', true);

const usersSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required: true,
        minlength: 3,
        maxlength: 60,
        validate: [validateOnlyLetters, 'Please fill name field with only letters']
    },
    apellido_paterno:{
        type:String,
        required: true,
        minlength: 3,
        maxlength: 60,
        validate: [validateOnlyLetters, 'Please fill name field with only letters']
    },
    apellido_materno:{
        type: String,
        required: false,
        minlength: 3,
        maxlength: 60,
        validate: [validateOnlyLetters, 'Please fill name field with only letters']
    },
    fecha_nacimiento: {
        type:String,
        required: true,
        validate: [isValidDate, 'Please fill required date format yyyy--mm-dd in fecha de nacimiento field']
    },
    contrasena: {
        type:String,
        required: true,
        validate: [isStrongPassword, 'Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, greater or equal to 8 and less or equal to 10 characters.']
    },
    perfil: {
        type:String,
        required: true,
        enum: rolesEnum
    },
    activo: {
        type:Boolean,
        required: true,
        default: true
    },
    fecha_alta: {
        type:Date,
        required: true,
        default: Date.now
    },
    fecha_baja: {
        type:Date,
        required: false,
    },
    correo_electronico: {
        type:String,
        required: true,
        validate: [validateEmail, 'Please fill a valid  email address format']
    }
})

/**
    * Function to validate data before save method is called, here used to hash password
    *   
    * @remarks
    * Use bcrypt to hash password
    *
    * @returns Continue with save method execution
*/
usersSchema.pre('save', async function(next) {
    const user = this;
    const salt = await bcrypt.genSalt();

    if (!user.isModified('contrasena')) return next();
    user.contrasena = await bcrypt.hash(user.contrasena, salt); 

    next();
});

module.exports = mongoose.model('usuarios', usersSchema)