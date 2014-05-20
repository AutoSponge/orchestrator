var EventEmitter = require( 'events' ).EventEmitter;
var SVG = require( './SVG' );

module.exports = Object.create( EventEmitter.prototype, {

    'elementConfig->IN': {

        value: SVG

    }

} );