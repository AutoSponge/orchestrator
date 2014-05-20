var EventEmitter = require( 'events' ).EventEmitter;
var intervalData;

module.exports = Object.create( EventEmitter.prototype, {

    emitDate: {

        value: function () {

            this.emit( 'OUT->date', new Date() );

        }
    },
    'boolean->IN': {

        value: function ( bool ) {

            if ( bool ) {

                setInterval( this.emitDate, 1000 );

            } else {

                clearInterval( intervalData );

            }
        }
    }
} );