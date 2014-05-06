'use strict';

function delegate( registry, component, method ) {
    return function () {
        return registry[component][method].apply( registry[component], arguments );
    };
}

function Orchestrator() {
    return Orchestrator.factory();
}

Orchestrator.factory = function () {
    var registry = Object.create( null );
    return Object.create( Orchestrator.prototype, {
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
                    delegate( registry, target, targetPort )( data );
                }
                return this;
            }
        },
        register: {
            value: function ( process ) {
                registry[process.name] = process.component;
                return this;
            }
        }
    } );
};

module.exports = Orchestrator;