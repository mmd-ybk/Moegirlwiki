/*!
 * VisualEditor DataModel Model class.
 *
 * @copyright 2011-2013 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * Base class for DM models.
 *
 * @abstract
 * @constructor
 * @param {Object} element Reference to plain object in linear model
 */
ve.dm.Model = function VeDmModel( element ) {
	// Properties
	this.element = element || { 'type': this.constructor.static.name };
};

ve.dm.Model.static = {};

/**
 * Symbolic name for this model class. Must be set to a unique string by every subclass.
 * @static
 * @property {string} [static.name=null]
 * @inheritable
 */
ve.dm.Model.static.name = null;

/**
 * Array of HTML tag names that this model should be a match candidate for.
 * Empty array means none, null means any.
 * For more information about element matching, see ve.dm.ModelRegistry.
 * @static
 * @property {string[]} static.matchTagNames
 * @inheritable
 */
ve.dm.Model.static.matchTagNames = null;

/**
 * Array of RDFa types that this model should be a match candidate for.
 * Empty array means none, null means any.
 * For more information about element matching, see ve.dm.ModelRegistry.
 * @static
 * @property {Array} static.matchRdfaType Array of strings or regular expressions
 * @inheritable
 */
ve.dm.Model.static.matchRdfaTypes = null;

/**
 * Optional function to determine whether this model should match a given element.
 * Takes an HTMLElement and returns true or false.
 * This function is only called if this model has a chance of "winning"; see
 * ve.dm.ModelRegistry for more information about element matching.
 * If set to null, this property is ignored. Setting this to null is not the same as unconditionally
 * returning true, because the presence or absence of a matchFunction affects the model's
 * specificity.
 *
 * NOTE: This function is NOT a method, within this function "this" will not refer to an instance
 * of this class (or to anything reasonable, for that matter).
 * @static
 * @property {Function} static.matchFunction
 * @inheritable
 */
ve.dm.Model.static.matchFunction = null;

/**
 * Static function to convert a DOM element or set of sibling DOM elements to a linear model element
 * for this model type.
 *
 * This function is only called if this model "won" the matching for the first DOM element, so
 * domElements[0] will match this model's matching rule. There is usually only one DOM node in
 * domElements[]. Multiple elements will only be passed if this model supports about groups.
 * If there are multiple nodes, the nodes are all adjacent siblings in the same about group
 * (i.e. they are grouped together because they have the same value for the about attribute).
 *
 * The converter has some state variables that can be obtained by this function:
 * - if converter.isExpectingContent() returns true, the converter expects a content element
 * - if converter.isInWrapper() returns true, the returned element will be put in a wrapper
 *   paragraph generated by the converter (this is only relevant if isExpectingContent() is true)
 * - converter.canCloseWrapper() returns true if the current wrapper paragraph can be closed,
 *   and false if it can't be closed or if there is no active wrapper
 *
 * This function is allowed to return a content element when context indicates that a non-content
 * element is expected or vice versa. If that happens, the converter deals with it in the following way:
 *
 * - if a non-content element is expected but a content element is returned:
 *     - open a wrapper paragraph
 *     - put the returned element in the wrapper
 * - if a content element is expected but a non-content element is returned:
 *     - if we are in a wrapper paragraph:
 *         - if we can close the wrapper:
 *             - close the wrapper
 *             - insert the returned element right after the end of the wrapper
 *         - if we can't close the wrapper:
 *             - alienate the element
 *     - if we aren't in a wrapper paragraph:
 *         - alienate the element
 *
 * For these purposes, annotations are considered content. Meta-items can occur anywhere, so if
 * a meta-element is returned no special action is taken. Note that "alienate" always means an alien
 * *node* (ve.dm.AlienNode) will be generated, never an alien meta-item (ve.dm.AlienMetaItem),
 * regardless of whether the subclass attempting the conversion is a node or a meta-item.
 *
 * The returned linear model element must have a type property set to a registered model name
 * (usually the model's own .static.name, but that's not required). It may optionally have an attributes
 * property set to an object with key-value pairs. Any other properties are not allowed.
 *
 * This function may return a single linear model element, or an array of balanced linear model
 * data. If this function needs to recursively convert a DOM node (e.g. a child of one of the
 * DOM elements passed in), it can call converter.getDataFromDomRecursion( domElement ). Note that
 * if an array is returned, the converter will not descend into the DOM node's children; the model
 * will be assumed to have handled those children.
 *
 * @static
 * @inheritable
 * @method
 * @param {HTMLElement[]} domElements DOM elements to convert. Usually only one element
 * @param {ve.dm.Converter} converter Converter object
 * @returns {Object|Array|null} Linear model element, or array with linear model data, or null to alienate
 */
ve.dm.Model.static.toDataElement = function ( /*domElements, converter*/ ) {
	throw new Error( 've.dm.Model subclass must implement toDataElement' );
};

/**
 * Static function to convert a linear model data element for this model type back to one or more
 * DOM elements.
 *
 * If this model is a node with .handlesOwnChildren set to true, dataElement will be an array of
 * the linear model data of this node and all of its children, rather than a single element.
 * In this case, this function way want to recursively convert linear model data to DOM, which can
 * be done with converter#getDomSubtreeFromData.
 *
 * NOTE: If this function returns multiple DOM elements, the DOM elements produced by the children
 * of this model (if it's a node and has children) will be attached to the first DOM element in the array.
 * For annotations, only the first element is used, and any additional elements are ignored.
 *
 * @static
 * @inheritable
 * @method
 * @param {Object|Array} dataElement Linear model element or array of linear model data
 * @param {HTMLDocument} doc HTML document for creating elements
 * @param {ve.dm.Converter} converter Converter object to optionally call .getDomSubtreeFromData() on
 * @returns {HTMLElement[]} DOM elements
 */
ve.dm.Model.static.toDomElements = function ( /*dataElement, doc, converter*/ ) {
	throw new Error( 've.dm.Model subclass must implement toDomElements' );
};

/**
 * Whether this model supports about grouping. When a DOM element matches a model type that has
 * about grouping enabled, the converter will look for adjacent siblings with the same value for
 * the about attribute, and ask toDataElement() to produce a single data element for all of those
 * DOM nodes combined.
 *
 * The converter doesn't descend into about groups, i.e. it doesn't convert the children of the
 * DOM elements that make up the about group. This means the resulting linear model element will
 * be childless.
 *
 * @static
 * @property {boolean} static.enableAboutGrouping
 * @inheritable
 */
ve.dm.Model.static.enableAboutGrouping = false;

/**
 * Whether HTML attributes should be preserved for this model type. If true, the HTML attributes
 * of the DOM elements will be stored as linear model attributes. The attribute names will be
 * html/i/attrName, where i is the index of the DOM element in the domElements array, and attrName
 * is the name of the attribute.
 *
 * This should generally be enabled, except for model types that store their entire HTML in an
 * attribute.
 *
 * @static
 * @property {boolean} static.storeHtmlAttributes
 * @inheritable
 */
ve.dm.Model.static.storeHtmlAttributes = true;

/* Methods */

/**
 * Get a reference to the linear model element
 *
 * @method
 * @returns {Object} Linear model element passed to the constructor, by reference
 */
ve.dm.Model.prototype.getElement = function () {
	return this.element;
};

/**
 * Get the symbolic name of this model's type
 *
 * @method
 * @returns {string} Type name
 */
ve.dm.Model.prototype.getType = function () {
	return this.constructor.static.name;
};

/**
 * Get the value of an attribute.
 *
 * Return value is by reference if array or object.
 *
 * @method
 * @param {string} key Name of attribute to get
 * @returns {Mixed} Value of attribute, or undefined if no such attribute exists
 */
ve.dm.Model.prototype.getAttribute = function ( key ) {
	return this.element && this.element.attributes ? this.element.attributes[key] : undefined;
};

/**
 * Get a copy of all attributes.
 *
 * Values are by reference if array or object, similar to using the getAttribute method.
 *
 * @method
 * @param {string} prefix Only return attributes with this prefix, and remove the prefix from them
 * @returns {Object} Attributes
 */
ve.dm.Model.prototype.getAttributes = function ( prefix ) {
	var key, filtered,
		attributes = this.element && this.element.attributes ? this.element.attributes : {};
	if ( prefix ) {
		filtered = {};
		for ( key in attributes ) {
			if ( key.indexOf( prefix ) === 0 ) {
				filtered[key.substr( prefix.length )] = attributes[key];
			}
		}
		return filtered;
	}
	return ve.extendObject( {}, attributes );
};

/**
 * Check if the model has certain attributes.
 *
 * If an array of keys is provided only the presence of the attributes will be checked. If an object
 * with keys and values is provided both the presence of the attributes and their values will be
 * checked. Comparison of values is done by casting to strings unless the strict argument is used.
 *
 * @method
 * @param {string[]|Object} attributes Array of keys or object of keys and values
 * @param {boolean} strict Use strict comparison when checking if values match
 * @returns {boolean} Model has attributes
 */
ve.dm.Model.prototype.hasAttributes = function ( attributes, strict ) {
	var key, i, len,
		ourAttributes = this.getAttributes() || {};
	if ( ve.isPlainObject( attributes ) ) {
		// Node must have all the required attributes
		for ( key in attributes ) {
			if (
				!( key in ourAttributes ) ||
				( strict ?
					attributes[key] !== ourAttributes[key] :
					String( attributes[key] ) !== String( ourAttributes[key] )
				)
			) {
				return false;
			}
		}
	} else if ( ve.isArray( attributes ) ) {
		for ( i = 0, len = attributes.length; i < len; i++ ) {
			if ( !( attributes[i] in ourAttributes ) ) {
				return false;
			}
		}
	}
	return true;
};

/**
 * Get a clone of the model's linear model element.
 *
 * The attributes object will be deep-copied.
 *
 * @returns {Object} Cloned element object
 */
ve.dm.Model.prototype.getClonedElement = function () {
	return ve.copyObject( this.element );
};
