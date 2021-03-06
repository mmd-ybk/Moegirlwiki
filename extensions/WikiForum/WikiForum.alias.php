<?php
/**
 * Aliases for WikiForum extension.
 *
 * @file
 * @ingroup Extensions
 */

$specialPageAliases = array();

/** English */
$specialPageAliases['en'] = array(
	'WikiForum' => array( 'WikiForum', 'Forum' ),
);

/** Finnish (Suomi) */
$specialPageAliases['fi'] = array(
	'WikiForum' => array( 'WikiFoorumi', 'Foorumi' ),
);

/**
 * For backwards compatibility with MediaWiki 1.15 and earlier.
 */
$aliases =& $specialPageAliases;