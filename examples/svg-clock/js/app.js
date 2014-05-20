var Orchestrator = require( '../../../' );

var app = new Orchestrator( {
    processes: [
        {name: 'animate',           component: require( './animationProcess' )},
        {name: 'draw',              component: require( './drawElement' )},
        {name: 'init',              component: require( './initProcess' )},
        {name: 'extractSeconds',    component: require( './extractionProcess' ), args: ['seconds']},
        {name: 'convertSeconds',    component: require( './conversionProcess' ), args: ['seconds']},
        {name: 'drawSeconds',       component: require( './drawSegment' )},
        {name: 'extractMinutes',    component: require( './extractionProcess' ), args: ['minutes']},
        {name: 'convertMinutes',    component: require( './conversionProcess' ), args: ['minutes']},
        {name: 'drawMinutes',       component: require( './drawSegment' )},
        {name: 'extractHours',      component: require( './extractionProcess' ), args: ['hours']},
        {name: 'convertHours',      component: require( './conversionProcess' ), args: ['hours']},
        {name: 'drawHours',         component: require( './drawSegment' )}
    ],
    connections: require( './connections.json' )
} );

app.dispatch( 'animate', true );