'use strict';
var EventEmitter = require( 'events' ).EventEmitter;

function delegate( registry, component, method ) {
    return function () {
        return registry[component][method].apply( registry[component], arguments );
    };
}

function Orchestrator( config ) {
    return Orchestrator.factory( config );
}

Orchestrator.factory = function ( config ) {
    var registry = Object.create( EventEmitter.prototype );
    return Object.create( Orchestrator.prototype, {
        config: {
            value: config || {}
        },
        connect: {
            value: function ( options ) {
                var target = options.target && options.target.process;
                var targetPort = target && options.target.port;
                var source = options.source && options.source.process;
                var sourcePort = source && options.source && options.source.port;
                var data = options.data;
                if ( source ) {
                    registry[source].on( sourcePort, delegate( registry, target, targetPort ) );
                } else {
                    if ( options.event ) {
                        registry.on( options.event, function () {
                            delegate( registry, target, targetPort ).apply( null, arguments );
                        } );
                    } else {
                        delegate( registry, target, targetPort )( data );
                    }
                }
                return this;
            }
        },
        connectAll: {
            value: function ( arr ) {
                (arr || this.config.connections || []).forEach( this.connect );
                return this;
            }
        },
        add: {
            value: function ( process ) {
                var component = process.component;
                if ( typeof component === 'function' ) {
                    component = component.apply( process, process.args || [] );
                }
                registry[process.name] = component;
                return this;
            }
        },
        addAll: {
            value: function ( arr ) {
                (arr || this.config.processes || []).forEach( this.add );
                return this;
            }
        },
        dispatch: {
            value: function () {
                registry.emit.apply( registry, arguments );
                return this;
            }
        }
    } ).addAll()
        .connectAll();
};

module.exports = Orchestrator;