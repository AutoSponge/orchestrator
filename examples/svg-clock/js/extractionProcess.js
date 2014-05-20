var EventEmitter = require( 'events' ).EventEmitter;
var inherits = require( 'inherits' );

function ExtractSegment( segment ) {

    if ( !(this instanceof ExtractSegment) ) {
        return new ExtractSegment( segment );
    }

    this.method = 'get' + segment.charAt( 0 ).toUpperCase() + segment.substring( 1 );

}

inherits( ExtractSegment, EventEmitter );

ExtractSegment.prototype['date->IN'] = function ( date ) {

    this.emit( 'OUT->units', date[this.method]() );

};

module.exports = ExtractSegment;