var EventEmitter = require( 'events' ).EventEmitter;

module.exports = Object.create( EventEmitter.prototype, {

    'array[config]->IN': {

        value: function ( configs ) {

            configs.forEach( this.emit.bind( this, 'OUT->elementConfig' ) );

        }
    }
} );