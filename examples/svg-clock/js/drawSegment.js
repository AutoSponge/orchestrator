var EventEmitter = require( 'events' ).EventEmitter;
var inherits = require( 'inherits' );
var SVG = require( './SVG' );

function DrawSegment() {

    if ( !(this instanceof DrawSegment) ) {
        return new DrawSegment();
    }

    this.elm = null;
    this.rotated = false;

}

inherits( DrawSegment, EventEmitter );

DrawSegment.prototype['elementConfig->IN'] = function ( config ) {

    this.elm = SVG( config );

};

DrawSegment.prototype['degrees->IN'] = function ( degrees ) {

    var elm = this.elm;

    if ( degrees === 0 && this.rotated ) {

        return this.reset();

    }

    if ( !this.rotated ) {

        this.rotated = true;

        return elm.rotate( degrees, false );

    }

    return elm.rotate( degrees );
};

DrawSegment.prototype.reset = function () {

    var elm = this.elm;

    elm.rotate( 359.9 );

    return setTimeout( function () {

        elm.rotate( 0, false );

    }, 816 );

};

module.exports = DrawSegment;