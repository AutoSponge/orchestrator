var test = require( 'tape' );
var Orchestrator = require( '../' );
var EventEmitter = require( 'events' ).EventEmitter;

test( 'orchestrator instantiates', function ( t ) {
    t.plan( 3 );

    var orchestrator = new Orchestrator();
    t.ok( orchestrator instanceof Orchestrator );
    orchestrator = Orchestrator();
    t.ok( orchestrator instanceof Orchestrator );
    orchestrator = Orchestrator.factory();
    t.ok( orchestrator instanceof Orchestrator );
} );

test( 'orchestrator has the correct interface', function ( t ) {
    t.plan( 5 );

    var orchestrator = new Orchestrator();
    t.equal( typeof orchestrator.add, 'function' );
    t.equal( typeof orchestrator.addAll, 'function' );
    t.equal( typeof orchestrator.connect, 'function' );
    t.equal( typeof orchestrator.connectAll, 'function' );
    t.equal( typeof orchestrator.dispatch, 'function' );
} );

test( 'orchestrator has a fluent interface', function ( t ) {
    t.plan( 2 );

    var orchestrator = new Orchestrator();
    t.equal( orchestrator.add({
        name:'a',
        component:Object.create( EventEmitter.prototype, {})}), orchestrator );
    t.equal( orchestrator.connect({
        source: {
            process: 'a',
            port: 'OUT->string'
        },
        target: {
            process: 'b',
            port: 'string->IN'
        }
    }), orchestrator );
} );

test( 'orchestrator has a unique registry', function ( t ) {
    t.plan( 6 );

    var orchestrator1 = new Orchestrator();
    var orchestrator2 = new Orchestrator();
    var a = Object.create( EventEmitter.prototype, {
        recorded: {
            value: null,
            writable: true,
            enumerable: true,
            configurable: true
        },
        'string->IN': {
            value: function ( data ) {
                this.recorded = data;
            }
        }
    } );
    var b = Object.create( EventEmitter.prototype, {
        recorded: {
            value: null,
            writable: true,
            enumerable: true,
            configurable: true
        },
        'string->IN': {
            value: function ( data ) {
                this.recorded = data;
            }
        }
    } );
    orchestrator1.add({name: 'test', component: a});
    orchestrator2.add({name: 'test', component: b});
    t.equal( a.recorded, null );
    t.equal( b.recorded, null );

    orchestrator1.connect({data: 'hi', target:{process: 'test', port: 'string->IN'}});
    t.equal( a.recorded, 'hi' );
    t.equal( b.recorded, null );

    orchestrator2.connect({data: 'bye', target:{process: 'test', port: 'string->IN'}});
    t.equal( a.recorded, 'hi' );
    t.equal( b.recorded, 'bye' );

} );

test( 'orchestrator data', function ( t ) {
    t.plan( 2 );

    var a = Object.create( EventEmitter.prototype, {
        'string->IN': {
            value: function ( data ) {
                this.emit( 'OUT->string', data );
            }
        }
    } );

    var b = Object.create( EventEmitter.prototype, {
        'string->IN': {
            value: function ( data ) {
                this.emit( 'OUT->string', data.toUpperCase() );
            }
        }
    } );

    var recorder = Object.create( EventEmitter.prototype, {
        recorded: {
            value: null,
            writable: true,
            enumerable: true,
            configurable: true
        },
        'string->IN': {
            value: function ( data ) {
                this.recorded = data;
            }
        }
    } );

    t.equal( recorder.recorded, null, 'test should initialize correctly' );

    var processes = [
        {name: 'a', component: a},
        {name: 'b', component: b},
        {name: 'recorder', component: recorder}
    ];

    var connections = [
        {
            source: {
                process: 'b',
                port: 'OUT->string'
            },
            target: {
                process: 'recorder',
                port: 'string->IN'
            }
        },
        {
            source: {
                process: 'a',
                port: 'OUT->string'
            },
            target: {
                process: 'b',
                port: 'string->IN'
            }
        },
        {
            data: 'test',
            target: {
                process: 'a',
                port: 'string->IN'
            }
        }
    ];

    var orchestrator = new Orchestrator( {
        processes: processes,
        connections: connections
    } );

    t.equal( 'TEST', recorder.recorded, 'orchestrator should connect components correctly' );
} );

test( 'orchestrator event', function ( t ) {
    t.plan( 3 );

    var a = Object.create( EventEmitter.prototype, {
        'string->IN': {
            value: function ( data ) {
                this.emit( 'OUT->string', data );
            }
        }
    } );

    var b = Object.create( EventEmitter.prototype, {
        'string->IN': {
            value: function ( data ) {
                this.emit( 'OUT->string', data.toUpperCase() );
            }
        }
    } );

    var recorder = Object.create( EventEmitter.prototype, {
        recorded: {
            value: null,
            writable: true,
            enumerable: true,
            configurable: true
        },
        'string->IN': {
            value: function ( data ) {
                this.recorded = data;
            }
        }
    } );

    t.equal( recorder.recorded, null, 'test should initialize correctly' );

    var processes = [
        {name: 'a', component: a},
        {name: 'b', component: b},
        {name: 'recorder', component: recorder}
    ];

    var connections = [
        {
            source: {
                process: 'b',
                port: 'OUT->string'
            },
            target: {
                process: 'recorder',
                port: 'string->IN'
            }
        },
        {
            source: {
                process: 'a',
                port: 'OUT->string'
            },
            target: {
                process: 'b',
                port: 'string->IN'
            }
        },
        {
            event: 'start',
            target: {
                process: 'a',
                port: 'string->IN'
            }
        }
    ];

    var orchestrator = new Orchestrator();

    orchestrator.addAll( processes );

    orchestrator.connectAll( connections );

    t.equal( recorder.recorded, null, 'test should initialize correctly' );

    orchestrator.dispatch( 'start', 'test' );

    t.equal( 'TEST', recorder.recorded, 'orchestrator should connect components correctly' );
} );