var EventEmitter = require( 'events' ).EventEmitter;
var inherits = require( 'inherits' );

var formulas = {
    seconds: function ( units ) {
        return units * 6;
    },
    minutes: function ( units ) {
        return ( units + ( units / 60 ) ) * 6;
    },
    hours: function ( units ) {
        return ( units % 12 * 30 ) + units / 2;
    }
};

function ConvertToDegrees( segment ) {

    if ( !(this instanceof ConvertToDegrees) ) {
        return new ConvertToDegrees( segment );
    }

    this.method = formulas[segment];

}

inherits( ConvertToDegrees, EventEmitter );

ConvertToDegrees.prototype['units->IN'] = function ( units ) {

    this.emit( 'OUT->degrees', this.method( units ) );

};

module.exports = ConvertToDegrees;