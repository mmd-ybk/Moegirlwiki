/*!
 * VisualEditor UserInterface UndoButtonTool class.
 *
 * @copyright 2011-2013 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * UserInterface undo button tool.
 *
 * @class
 * @extends ve.ui.ButtonTool
 * @constructor
 * @param {ve.ui.Toolbar} toolbar
 * @param {Object} [config] Config options
 */
ve.ui.UndoButtonTool = function VeUiUndoButtonTool( toolbar, config ) {
	// Parent constructor
	ve.ui.ButtonTool.call( this, toolbar, config );

	// Events
	this.toolbar.getSurface().getModel().connect( this, { 'history': 'onUpdateState' } );

	// Initialization
	this.setDisabled( true );
};

/* Inheritance */

ve.inheritClass( ve.ui.UndoButtonTool, ve.ui.ButtonTool );

/* Static Properties */

ve.ui.UndoButtonTool.static.name = 'undo';

ve.ui.UndoButtonTool.static.icon = 'undo';

ve.ui.UndoButtonTool.static.titleMessage = 'visualeditor-historybutton-undo-tooltip';

/* Methods */

/**
 * Handle the button being clicked.
 *
 * @method
 */
ve.ui.UndoButtonTool.prototype.onClick = function () {
	this.toolbar.getSurface().execute( 'history', 'undo' );
};

/**
 * Handle the toolbar state being updated.
 *
 * @method
 * @param {ve.dm.Node[]} nodes List of nodes covered by the current selection
 * @param {ve.dm.AnnotationSet} full Annotations that cover all of the current selection
 * @param {ve.dm.AnnotationSet} partial Annotations that cover some or all of the current selection
 */
ve.ui.UndoButtonTool.prototype.onUpdateState = function () {
	this.setDisabled( !this.toolbar.getSurface().getModel().hasPastState() );
};

/* Registration */

ve.ui.toolFactory.register( 'undo', ve.ui.UndoButtonTool );

ve.commandRegistry.register(
	'undo', 'history', 'undo'
);

ve.triggerRegistry.register(
	'undo', { 'mac': new ve.Trigger( 'cmd+z' ), 'pc': new ve.Trigger( 'ctrl+z' ) }
);

