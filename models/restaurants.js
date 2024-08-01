const mongoose = require('mongoose')

/**
    * Schema to declare restaurants structure in DB
*/

/**
    * Function to validate if string has alphanumeric characters
    *
    * @param val - string to compare
    *   
    * @remarks
    * Use regex to make validation
    *
    * @returns A boolean indicating if string has has alphanumeric characters
    *
*/
var validateOAlphanumeric = function(val) {
    var re = /^[A-Za-z0-9\s]+$/;
    return re.test(val)
};

/**
    * Function to validate if string has only digits or is empty
    *
    * @param val - string to compare
    *   
    * @remarks
    * Use regex to make validation
    *
    * @returns A boolean indicating if string has only digits or is empty
*/
var validateNumbers = function(val){
    return /^(\s*|\d+)$/.test(val)
}

/**
    * Function to validate if string has hour format
    *
    * @param val - string to compare
    *   
    * @remarks
    * Use regex to make validation
    *
    * @returns A boolean indicating if string has hour format
*/
var validateHourFormat = function(val){
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(val)
}

/**
    * Enum variable to store all posible values for rating field
    * 
    * * @remarks
    * Use Michelin star system
    * 
*/
var ratingEnum = {
    values: ["1", "2", "3", "4", "5"]
  , message: 'Rating field value must be Michelin star system; 1,2,3,4 or 5'
}

const addressSchema = new mongoose.Schema({
    colonia: {
        type:String,
        required: true,
        minlength: 3,
        maxlength: 60,
        validate: [validateOAlphanumeric, 'Please fill colonia field only with letters and numbers']
    },
    numero: {
        type:String,
        maxlength: 8,
        required: false
    },
    estado: {
        type:String,        
        required: true,
        minlength: 5,
        maxlength: 60
    },
    delegacion_municipio: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 60
    },
    codigo_postal: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 5,
        validate: [validateNumbers, 'Please fill codigo postal field only with numbers']
    },
    coordenadas: [
        {
            type:Number,
            required: true,
        },
        {
            type:Number,
            required: true,
        }
    ],
    tipo_vialidad: {
        type:String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    vialidad: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 60
    }
})

const commentsSchema = new mongoose.Schema({
    fecha_comentario:{
        type:Date,
        required: true,
        default: Date.now
    },
    comentario:{
        type:String,
        required: false,
        maxlength: 1000,
    },
    rating:{
        type: String,
        required: true,
        enum: ratingEnum
    },
    /*restaurante:{
        type: String,
        required: true,
        validate: [validaterestaurantIdValue, 'Please fill restaurante field only with letters and numbers and 24 long characters']
    }*/
    //restaurante: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurantes'},
})

const restaurantsSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required: true,
        minlength: 5,
        maxlength: 90
    },
    tipo_cocina:{
        type:String,
        required: true,
        minlength: 4,
        maxlength: 90
    },
    direccion:{
        type: addressSchema,
        required: true
    },
    telefono: {
        type:String,
        required: false,
        maxlength: 16,
        validate: [validateNumbers, 'Please fill telefono field only with numbers']
    },
    hora_apertura: {
        type:String,
        required: true,
        validate: [validateHourFormat, 'Please fill hora apertura field with hour format HH:MM and 24h format']
    },
    hora_cierre: {
        type:String,
        required: true,
        validate: [validateHourFormat, 'Please fill hora cierre field with hour format HH:MM and 24h format']
    },
    fecha_alta: {
        type:Date,
        required: true,
        default: Date.now
    },
    fecha_baja: {
        type:Date,
        required: false
    },
    activo: {
        type:Boolean,
        required: true,
        default:true
    },
    comentarios: [
        {
            type: commentsSchema,
            required: false
        }
    ]
    
})

module.exports = mongoose.model('restaurantes', restaurantsSchema)