(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

// Make it safe to do console.log() always.
(function (con) {
  var method;
  var dummy = function() {};
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' + 
     'time,timeEnd,trace,warn').split(',');
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});
;

/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
var
  // A central reference to the root jQuery(document)
  rootjQuery,

  // The deferred used on DOM ready
  readyList,

  // Use the correct document accordingly with window argument (sandbox)
  document = window.document,
  location = window.location,
  navigator = window.navigator,

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // Save a reference to some core methods
  core_push = Array.prototype.push,
  core_slice = Array.prototype.slice,
  core_indexOf = Array.prototype.indexOf,
  core_toString = Object.prototype.toString,
  core_hasOwn = Object.prototype.hasOwnProperty,
  core_trim = String.prototype.trim,

  // Define a local copy of jQuery
  jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Used for matching numbers
  core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

  // Used for detecting and trimming whitespace
  core_rnotwhite = /\S/,
  core_rspace = /\s+/,

  // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
  rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

  // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

  // JSON RegExp
  rvalidchars = /^[\],:{}\s]*$/,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

  // Matches dashed string for camelizing
  rmsPrefix = /^-ms-/,
  rdashAlpha = /-([\da-z])/gi,

  // Used by jQuery.camelCase as callback to replace()
  fcamelCase = function( all, letter ) {
    return ( letter + "" ).toUpperCase();
  },

  // The ready event handler and self cleanup method
  DOMContentLoaded = function() {
    if ( document.addEventListener ) {
      document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
      jQuery.ready();
    } else if ( document.readyState === "complete" ) {
      // we're here because readyState === "complete" in oldIE
      // which is good enough for us to call the dom ready!
      document.detachEvent( "onreadystatechange", DOMContentLoaded );
      jQuery.ready();
    }
  },

  // [[Class]] -> type pairs
  class2type = {};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem, ret, doc;

    // Handle $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return this;
    }

    // Handle $(DOMElement)
    if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = rquickExpr.exec( selector );
      }

      // Match html or make sure no context is specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;
          doc = ( context && context.nodeType ? context.ownerDocument || context : document );

          // scripts is true for back-compat
          selector = jQuery.parseHTML( match[1], doc, true );
          if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
            this.attr.call( selector, context, true );
          }

          return jQuery.merge( this, selector );

        // HANDLE: $(#id)
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE and Opera return items
            // by name instead of ID
            if ( elem.id !== match[2] ) {
              return rootjQuery.find( selector );
            }

            // Otherwise, we inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if ( selector.selector !== undefined ) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The current version of jQuery being used
  jquery: "1.8.2",

  // The default length of a jQuery object is 0
  length: 0,

  // The number of elements contained in the matched element set
  size: function() {
    return this.length;
  },

  toArray: function() {
    return core_slice.call( this );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems, name, selector ) {

    // Build a new jQuery matched element set
    var ret = jQuery.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;

    ret.context = this.context;

    if ( name === "find" ) {
      ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
    } else if ( name ) {
      ret.selector = this.selector + "." + name + "(" + selector + ")";
    }

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
  },

  eq: function( i ) {
    i = +i;
    return i === -1 ?
      this.slice( i ) :
      this.slice( i, i + 1 );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  slice: function() {
    return this.pushStack( core_slice.apply( this, arguments ),
      "slice", core_slice.call(arguments).join(",") );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: core_push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {

    // Abort if there are pending holds or we're already ready
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }

    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( !document.body ) {
      return setTimeout( jQuery.ready, 1 );
    }

    // Remember that the DOM is ready
    jQuery.isReady = true;

    // If a normal DOM Ready event fired, decrement, and wait if need be
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }

    // If there are functions bound, to execute
    readyList.resolveWith( document, [ jQuery ] );

    // Trigger any bound ready events
    if ( jQuery.fn.trigger ) {
      jQuery( document ).trigger("ready").off("ready");
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray || function( obj ) {
    return jQuery.type(obj) === "array";
  },

  isWindow: function( obj ) {
    return obj != null && obj == obj.window;
  },

  isNumeric: function( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
  },

  type: function( obj ) {
    return obj == null ?
      String( obj ) :
      class2type[ core_toString.call(obj) ] || "object";
  },

  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !core_hasOwn.call(obj, "constructor") &&
        !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || core_hasOwn.call( obj, key );
  },

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw new Error( msg );
  },

  // data: string of html
  // context (optional): If specified, the fragment will be created in this context, defaults to document
  // scripts (optional): If true, will include scripts passed in the html string
  parseHTML: function( data, context, scripts ) {
    var parsed;
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    if ( typeof context === "boolean" ) {
      scripts = context;
      context = 0;
    }
    context = context || document;

    // Single tag
    if ( (parsed = rsingleTag.exec( data )) ) {
      return [ context.createElement( parsed[1] ) ];
    }

    parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
    return jQuery.merge( [],
      (parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
  },

  parseJSON: function( data ) {
    if ( !data || typeof data !== "string") {
      return null;
    }

    // Make sure leading/trailing whitespace is removed (IE can't handle it)
    data = jQuery.trim( data );

    // Attempt to parse using the native JSON parser first
    if ( window.JSON && window.JSON.parse ) {
      return window.JSON.parse( data );
    }

    // Make sure the incoming data is actual JSON
    // Logic borrowed from http://json.org/json2.js
    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
      .replace( rvalidtokens, "]" )
      .replace( rvalidbraces, "")) ) {

      return ( new Function( "return " + data ) )();

    }
    jQuery.error( "Invalid JSON: " + data );
  },

  // Cross-browser xml parsing
  parseXML: function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    try {
      if ( window.DOMParser ) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
      } else { // IE
        xml = new ActiveXObject( "Microsoft.XMLDOM" );
        xml.async = "false";
        xml.loadXML( data );
      }
    } catch( e ) {
      xml = undefined;
    }
    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
      jQuery.error( "Invalid XML: " + data );
    }
    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  // Workarounds based on findings by Jim Driscoll
  // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
  globalEval: function( data ) {
    if ( data && core_rnotwhite.test( data ) ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  // Convert dashed to camelCase; used by the css and data modules
  // Microsoft forgot to hump their vendor prefix (#9572)
  camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  },

  // args is for internal usage only
  each: function( obj, callback, args ) {
    var name,
      i = 0,
      length = obj.length,
      isObj = length === undefined || jQuery.isFunction( obj );

    if ( args ) {
      if ( isObj ) {
        for ( name in obj ) {
          if ( callback.apply( obj[ name ], args ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.apply( obj[ i++ ], args ) === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isObj ) {
        for ( name in obj ) {
          if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
            break;
          }
        }
      }
    }

    return obj;
  },

  // Use native String.trim function wherever possible
  trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
    function( text ) {
      return text == null ?
        "" :
        core_trim.call( text );
    } :

    // Otherwise use our own trimming functionality
    function( text ) {
      return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
    },

  // results is for internal usage only
  makeArray: function( arr, results ) {
    var type,
      ret = results || [];

    if ( arr != null ) {
      // The window, strings (and functions) also have 'length'
      // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
      type = jQuery.type( arr );

      if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
        core_push.call( ret, arr );
      } else {
        jQuery.merge( ret, arr );
      }
    }

    return ret;
  },

  inArray: function( elem, arr, i ) {
    var len;

    if ( arr ) {
      if ( core_indexOf ) {
        return core_indexOf.call( arr, elem, i );
      }

      len = arr.length;
      i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

      for ( ; i < len; i++ ) {
        // Skip accessing in sparse arrays
        if ( i in arr && arr[ i ] === elem ) {
          return i;
        }
      }
    }

    return -1;
  },

  merge: function( first, second ) {
    var l = second.length,
      i = first.length,
      j = 0;

    if ( typeof l === "number" ) {
      for ( ; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }

    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var retVal,
      ret = [],
      i = 0,
      length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value, key,
      ret = [],
      i = 0,
      length = elems.length,
      // jquery objects are treated as arrays
      isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( key in elems ) {
        value = callback( elems[ key ], key, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return ret.concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    var tmp, args, proxy;

    if ( typeof context === "string" ) {
      tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    args = core_slice.call( arguments, 2 );
    proxy = function() {
      return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
  },

  // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function
  access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
    var exec,
      bulk = key == null,
      i = 0,
      length = elems.length;

    // Sets many values
    if ( key && typeof key === "object" ) {
      for ( i in key ) {
        jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
      }
      chainable = 1;

    // Sets one value
    } else if ( value !== undefined ) {
      // Optionally, function values get executed if exec is true
      exec = pass === undefined && jQuery.isFunction( value );

      if ( bulk ) {
        // Bulk operations only iterate when executing function values
        if ( exec ) {
          exec = fn;
          fn = function( elem, key, value ) {
            return exec.call( jQuery( elem ), value );
          };

        // Otherwise they run against the entire set
        } else {
          fn.call( elems, value );
          fn = null;
        }
      }

      if ( fn ) {
        for (; i < length; i++ ) {
          fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
        }
      }

      chainable = 1;
    }

    return chainable ?
      elems :

      // Gets
      bulk ?
        fn.call( elems ) :
        length ? fn( elems[0], key ) : emptyGet;
  },

  now: function() {
    return ( new Date() ).getTime();
  }
});

jQuery.ready.promise = function( obj ) {
  if ( !readyList ) {

    readyList = jQuery.Deferred();

    // Catch cases where $(document).ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      setTimeout( jQuery.ready, 1 );

    // Standards-based browsers support DOMContentLoaded
    } else if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", jQuery.ready, false );

    // If IE event model is used
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", DOMContentLoaded );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", jQuery.ready );

      // If IE and not a frame
      // continually check to see if the document is ready
      var top = false;

      try {
        top = window.frameElement == null && document.documentElement;
      } catch(e) {}

      if ( top && top.doScroll ) {
        (function doScrollCheck() {
          if ( !jQuery.isReady ) {

            try {
              // Use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              top.doScroll("left");
            } catch(e) {
              return setTimeout( doScrollCheck, 50 );
            }

            // and execute any waiting functions
            jQuery.ready();
          }
        })();
      }
    }
  }
  return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
  var object = optionsCache[ options ] = {};
  jQuery.each( options.split( core_rspace ), function( _, flag ) {
    object[ flag ] = true;
  });
  return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );

  var // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // Flag to know if list is currently firing
    firing,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = !options.once && [],
    // Fire callbacks
    fire = function( data ) {
      memory = options.memory && data;
      fired = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      firing = true;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
          memory = false; // To prevent further calls using add
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( stack ) {
          if ( stack.length ) {
            fire( stack.shift() );
          }
        } else if ( memory ) {
          list = [];
        } else {
          self.disable();
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          // First, we save the current length
          var start = list.length;
          (function add( args ) {
            jQuery.each( args, function( _, arg ) {
              var type = jQuery.type( arg );
              if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
                list.push( arg );
              } else if ( arg && arg.length && type !== "string" ) {
                // Inspect recursively
                add( arg );
              }
            });
          })( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away
          } else if ( memory ) {
            firingStart = start;
            fire( memory );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          jQuery.each( arguments, function( _, arg ) {
            var index;
            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
              list.splice( index, 1 );
              // Handle firing indexes
              if ( firing ) {
                if ( index <= firingLength ) {
                  firingLength--;
                }
                if ( index <= firingIndex ) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      // Control if a given callback is in the list
      has: function( fn ) {
        return jQuery.inArray( fn, list ) > -1;
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        args = args || [];
        args = [ context, args.slice ? args.slice() : args ];
        if ( list && ( !fired || stack ) ) {
          if ( firing ) {
            stack.push( args );
          } else {
            fire( args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};
jQuery.extend({

  Deferred: function( func ) {
    var tuples = [
        // action, add listener, listener list, final state
        [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
        [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
        [ "notify", "progress", jQuery.Callbacks("memory") ]
      ],
      state = "pending",
      promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done( arguments ).fail( arguments );
          return this;
        },
        then: function( /* fnDone, fnFail, fnProgress */ ) {
          var fns = arguments;
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( tuples, function( i, tuple ) {
              var action = tuple[ 0 ],
                fn = fns[ i ];
              // deferred[ done | fail | progress ] for forwarding actions to newDefer
              deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
                function() {
                  var returned = fn.apply( this, arguments );
                  if ( returned && jQuery.isFunction( returned.promise ) ) {
                    returned.promise()
                      .done( newDefer.resolve )
                      .fail( newDefer.reject )
                      .progress( newDefer.notify );
                  } else {
                    newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                  }
                } :
                newDefer[ action ]
              );
            });
            fns = null;
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          return obj != null ? jQuery.extend( obj, promise ) : promise;
        }
      },
      deferred = {};

    // Keep pipe for back-compat
    promise.pipe = promise.then;

    // Add list-specific methods
    jQuery.each( tuples, function( i, tuple ) {
      var list = tuple[ 2 ],
        stateString = tuple[ 3 ];

      // promise[ done | fail | progress ] = list.add
      promise[ tuple[1] ] = list.add;

      // Handle state
      if ( stateString ) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      }

      // deferred[ resolve | reject | notify ] = list.fire
      deferred[ tuple[0] ] = list.fire;
      deferred[ tuple[0] + "With" ] = list.fireWith;
    });

    // Make the deferred a promise
    promise.promise( deferred );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
      resolveValues = core_slice.call( arguments ),
      length = resolveValues.length,

      // the count of uncompleted subordinates
      remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
      updateFunc = function( i, contexts, values ) {
        return function( value ) {
          contexts[ i ] = this;
          values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
          if( values === progressValues ) {
            deferred.notifyWith( contexts, values );
          } else if ( !( --remaining ) ) {
            deferred.resolveWith( contexts, values );
          }
        };
      },

      progressValues, progressContexts, resolveContexts;

    // add listeners to Deferred subordinates; treat others as resolved
    if ( length > 1 ) {
      progressValues = new Array( length );
      progressContexts = new Array( length );
      resolveContexts = new Array( length );
      for ( ; i < length; i++ ) {
        if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
          resolveValues[ i ].promise()
            .done( updateFunc( i, resolveContexts, resolveValues ) )
            .fail( deferred.reject )
            .progress( updateFunc( i, progressContexts, progressValues ) );
        } else {
          --remaining;
        }
      }
    }

    // if we're not waiting on anything, resolve the master
    if ( !remaining ) {
      deferred.resolveWith( resolveContexts, resolveValues );
    }

    return deferred.promise();
  }
});
jQuery.support = (function() {

  var support,
    all,
    a,
    select,
    opt,
    input,
    fragment,
    eventName,
    i,
    isSupported,
    clickFn,
    div = document.createElement("div");

  // Preliminary tests
  div.setAttribute( "className", "t" );
  div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

  all = div.getElementsByTagName("*");
  a = div.getElementsByTagName("a")[ 0 ];
  a.style.cssText = "top:1px;float:left;opacity:.5";

  // Can't get basic test support
  if ( !all || !all.length ) {
    return {};
  }

  // First batch of supports tests
  select = document.createElement("select");
  opt = select.appendChild( document.createElement("option") );
  input = div.getElementsByTagName("input")[ 0 ];

  support = {
    // IE strips leading whitespace when .innerHTML is used
    leadingWhitespace: ( div.firstChild.nodeType === 3 ),

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    tbody: !div.getElementsByTagName("tbody").length,

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    htmlSerialize: !!div.getElementsByTagName("link").length,

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    style: /top/.test( a.getAttribute("style") ),

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    hrefNormalized: ( a.getAttribute("href") === "/a" ),

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    opacity: /^0.5/.test( a.style.opacity ),

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    cssFloat: !!a.style.cssFloat,

    // Make sure that if no value is specified for a checkbox
    // that it defaults to "on".
    // (WebKit defaults to "" instead)
    checkOn: ( input.value === "on" ),

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    optSelected: opt.selected,

    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    getSetAttribute: div.className !== "t",

    // Tests for enctype support on a form(#6743)
    enctype: !!document.createElement("form").enctype,

    // Makes sure cloning an html5 element does not cause problems
    // Where outerHTML is undefined, this still works
    html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

    // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
    boxModel: ( document.compatMode === "CSS1Compat" ),

    // Will be defined later
    submitBubbles: true,
    changeBubbles: true,
    focusinBubbles: false,
    deleteExpando: true,
    noCloneEvent: true,
    inlineBlockNeedsLayout: false,
    shrinkWrapBlocks: false,
    reliableMarginRight: true,
    boxSizingReliable: true,
    pixelPosition: false
  };

  // Make sure checked status is properly cloned
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Test to see if it's possible to delete an expando from an element
  // Fails in Internet Explorer
  try {
    delete div.test;
  } catch( e ) {
    support.deleteExpando = false;
  }

  if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
    div.attachEvent( "onclick", clickFn = function() {
      // Cloning a node shouldn't copy over any
      // bound event handlers (IE does this)
      support.noCloneEvent = false;
    });
    div.cloneNode( true ).fireEvent("onclick");
    div.detachEvent( "onclick", clickFn );
  }

  // Check if a radio maintains its value
  // after being appended to the DOM
  input = document.createElement("input");
  input.value = "t";
  input.setAttribute( "type", "radio" );
  support.radioValue = input.value === "t";

  input.setAttribute( "checked", "checked" );

  // #11217 - WebKit loses check when the name is after the checked attribute
  input.setAttribute( "name", "t" );

  div.appendChild( input );
  fragment = document.createDocumentFragment();
  fragment.appendChild( div.lastChild );

  // WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  // Check if a disconnected checkbox will retain its checked
  // value of true after appended to the DOM (IE6/7)
  support.appendChecked = input.checked;

  fragment.removeChild( input );
  fragment.appendChild( div );

  // Technique from Juriy Zaytsev
  // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
  // We only care about the case where non-standard event systems
  // are used, namely in IE. Short-circuiting here helps us to
  // avoid an eval call (in setAttribute) which can cause CSP
  // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
  if ( div.attachEvent ) {
    for ( i in {
      submit: true,
      change: true,
      focusin: true
    }) {
      eventName = "on" + i;
      isSupported = ( eventName in div );
      if ( !isSupported ) {
        div.setAttribute( eventName, "return;" );
        isSupported = ( typeof div[ eventName ] === "function" );
      }
      support[ i + "Bubbles" ] = isSupported;
    }
  }

  // Run tests that need a body at doc ready
  jQuery(function() {
    var container, div, tds, marginDiv,
      divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
      body = document.getElementsByTagName("body")[0];

    if ( !body ) {
      // Return for frameset docs that don't have a body
      return;
    }

    container = document.createElement("div");
    container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
    body.insertBefore( container, body.firstChild );

    // Construct the test element
    div = document.createElement("div");
    container.appendChild( div );

    // Check if table cells still have offsetWidth/Height when they are set
    // to display:none and there are still other visible table cells in a
    // table row; if so, offsetWidth/Height are not reliable for use when
    // determining if an element has been hidden directly using
    // display:none (it is still safe to use offsets if a parent element is
    // hidden; don safety goggles and see bug #4512 for more information).
    // (only IE 8 fails this test)
    div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
    tds = div.getElementsByTagName("td");
    tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
    isSupported = ( tds[ 0 ].offsetHeight === 0 );

    tds[ 0 ].style.display = "";
    tds[ 1 ].style.display = "none";

    // Check if empty table cells still have offsetWidth/Height
    // (IE <= 8 fail this test)
    support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

    // Check box-sizing and margin behavior
    div.innerHTML = "";
    div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
    support.boxSizing = ( div.offsetWidth === 4 );
    support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

    // NOTE: To any future maintainer, we've window.getComputedStyle
    // because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
      support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
      support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. For more
      // info see bug #3333
      // Fails in WebKit before Feb 2011 nightlies
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      marginDiv = document.createElement("div");
      marginDiv.style.cssText = div.style.cssText = divReset;
      marginDiv.style.marginRight = marginDiv.style.width = "0";
      div.style.width = "1px";
      div.appendChild( marginDiv );
      support.reliableMarginRight =
        !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
    }

    if ( typeof div.style.zoom !== "undefined" ) {
      // Check if natively block-level elements act like inline-block
      // elements when setting their display to 'inline' and giving
      // them layout
      // (IE < 8 does this)
      div.innerHTML = "";
      div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
      support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

      // Check if elements with layout shrink-wrap their children
      // (IE 6 does this)
      div.style.display = "block";
      div.style.overflow = "visible";
      div.innerHTML = "<div></div>";
      div.firstChild.style.width = "5px";
      support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

      container.style.zoom = 1;
    }

    // Null elements to avoid leaks in IE
    body.removeChild( container );
    container = div = tds = marginDiv = null;
  });

  // Null elements to avoid leaks in IE
  fragment.removeChild( div );
  all = a = select = opt = input = fragment = div = null;

  return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
  rmultiDash = /([A-Z])/g;

jQuery.extend({
  cache: {},

  deletedIds: [],

  // Remove at next major release (1.9/2.0)
  uuid: 0,

  // Unique for each copy of jQuery on the page
  // Non-digits removed to match rinlinejQuery
  expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
    "embed": true,
    // Ban all objects except for Flash (which handle expandos)
    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    "applet": true
  },

  hasData: function( elem ) {
    elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
    return !!elem && !isEmptyDataObject( elem );
  },

  data: function( elem, name, data, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var thisCache, ret,
      internalKey = jQuery.expando,
      getByName = typeof name === "string",

      // We have to handle DOM nodes and JS objects differently because IE6-7
      // can't GC object references properly across the DOM-JS boundary
      isNode = elem.nodeType,

      // Only DOM nodes need the global jQuery cache; JS object data is
      // attached directly to the object so GC can occur automatically
      cache = isNode ? jQuery.cache : elem,

      // Only defining an ID for JS objects if its cache already exists allows
      // the code to shortcut on the same path as a DOM node with no cache
      id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

    // Avoid doing any more work than we need to when trying to get data on an
    // object that has no data at all
    if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
      return;
    }

    if ( !id ) {
      // Only DOM nodes need a new unique ID for each element since their data
      // ends up in the global cache
      if ( isNode ) {
        elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
      } else {
        id = internalKey;
      }
    }

    if ( !cache[ id ] ) {
      cache[ id ] = {};

      // Avoids exposing jQuery metadata on plain JS objects when the object
      // is serialized using JSON.stringify
      if ( !isNode ) {
        cache[ id ].toJSON = jQuery.noop;
      }
    }

    // An object can be passed to jQuery.data instead of a key/value pair; this gets
    // shallow copied over onto the existing cache
    if ( typeof name === "object" || typeof name === "function" ) {
      if ( pvt ) {
        cache[ id ] = jQuery.extend( cache[ id ], name );
      } else {
        cache[ id ].data = jQuery.extend( cache[ id ].data, name );
      }
    }

    thisCache = cache[ id ];

    // jQuery data() is stored in a separate object inside the object's internal data
    // cache in order to avoid key collisions between internal data and user-defined
    // data.
    if ( !pvt ) {
      if ( !thisCache.data ) {
        thisCache.data = {};
      }

      thisCache = thisCache.data;
    }

    if ( data !== undefined ) {
      thisCache[ jQuery.camelCase( name ) ] = data;
    }

    // Check for both converted-to-camel and non-converted data property names
    // If a data property was specified
    if ( getByName ) {

      // First Try to find as-is property data
      ret = thisCache[ name ];

      // Test for null|undefined property data
      if ( ret == null ) {

        // Try to find the camelCased property
        ret = thisCache[ jQuery.camelCase( name ) ];
      }
    } else {
      ret = thisCache;
    }

    return ret;
  },

  removeData: function( elem, name, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var thisCache, i, l,

      isNode = elem.nodeType,

      // See jQuery.data for more information
      cache = isNode ? jQuery.cache : elem,
      id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

    // If there is already no cache entry for this object, there is no
    // purpose in continuing
    if ( !cache[ id ] ) {
      return;
    }

    if ( name ) {

      thisCache = pvt ? cache[ id ] : cache[ id ].data;

      if ( thisCache ) {

        // Support array or space separated string names for data keys
        if ( !jQuery.isArray( name ) ) {

          // try the string as a key before any manipulation
          if ( name in thisCache ) {
            name = [ name ];
          } else {

            // split the camel cased version by spaces unless a key with the spaces exists
            name = jQuery.camelCase( name );
            if ( name in thisCache ) {
              name = [ name ];
            } else {
              name = name.split(" ");
            }
          }
        }

        for ( i = 0, l = name.length; i < l; i++ ) {
          delete thisCache[ name[i] ];
        }

        // If there is no data left in the cache, we want to continue
        // and let the cache object itself get destroyed
        if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
          return;
        }
      }
    }

    // See jQuery.data for more information
    if ( !pvt ) {
      delete cache[ id ].data;

      // Don't destroy the parent cache unless the internal data object
      // had been the only thing left in it
      if ( !isEmptyDataObject( cache[ id ] ) ) {
        return;
      }
    }

    // Destroy the cache
    if ( isNode ) {
      jQuery.cleanData( [ elem ], true );

    // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
    } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
      delete cache[ id ];

    // When all else fails, null
    } else {
      cache[ id ] = null;
    }
  },

  // For internal use only.
  _data: function( elem, name, data ) {
    return jQuery.data( elem, name, data, true );
  },

  // A method for determining if a DOM node can handle the data expando
  acceptData: function( elem ) {
    var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

    // nodes accept data unless otherwise specified; rejection can be conditional
    return !noData || noData !== true && elem.getAttribute("classid") === noData;
  }
});

jQuery.fn.extend({
  data: function( key, value ) {
    var parts, part, attr, name, l,
      elem = this[0],
      i = 0,
      data = null;

    // Gets all values
    if ( key === undefined ) {
      if ( this.length ) {
        data = jQuery.data( elem );

        if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
          attr = elem.attributes;
          for ( l = attr.length; i < l; i++ ) {
            name = attr[i].name;

            if ( !name.indexOf( "data-" ) ) {
              name = jQuery.camelCase( name.substring(5) );

              dataAttr( elem, name, data[ name ] );
            }
          }
          jQuery._data( elem, "parsedAttrs", true );
        }
      }

      return data;
    }

    // Sets multiple values
    if ( typeof key === "object" ) {
      return this.each(function() {
        jQuery.data( this, key );
      });
    }

    parts = key.split( ".", 2 );
    parts[1] = parts[1] ? "." + parts[1] : "";
    part = parts[1] + "!";

    return jQuery.access( this, function( value ) {

      if ( value === undefined ) {
        data = this.triggerHandler( "getData" + part, [ parts[0] ] );

        // Try to fetch any internally stored data first
        if ( data === undefined && elem ) {
          data = jQuery.data( elem, key );
          data = dataAttr( elem, key, data );
        }

        return data === undefined && parts[1] ?
          this.data( parts[0] ) :
          data;
      }

      parts[1] = value;
      this.each(function() {
        var self = jQuery( this );

        self.triggerHandler( "setData" + part, parts );
        jQuery.data( this, key, value );
        self.triggerHandler( "changeData" + part, parts );
      });
    }, null, value, arguments.length > 1, null, false );
  },

  removeData: function( key ) {
    return this.each(function() {
      jQuery.removeData( this, key );
    });
  }
});

function dataAttr( elem, key, data ) {
  // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute
  if ( data === undefined && elem.nodeType === 1 ) {

    var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

    data = elem.getAttribute( name );

    if ( typeof data === "string" ) {
      try {
        data = data === "true" ? true :
        data === "false" ? false :
        data === "null" ? null :
        // Only convert to a number if it doesn't change the string
        +data + "" === data ? +data :
        rbrace.test( data ) ? jQuery.parseJSON( data ) :
          data;
      } catch( e ) {}

      // Make sure we set the data so it isn't changed later
      jQuery.data( elem, key, data );

    } else {
      data = undefined;
    }
  }

  return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
  var name;
  for ( name in obj ) {

    // if the public data object is empty, the private is still empty
    if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
      continue;
    }
    if ( name !== "toJSON" ) {
      return false;
    }
  }

  return true;
}
jQuery.extend({
  queue: function( elem, type, data ) {
    var queue;

    if ( elem ) {
      type = ( type || "fx" ) + "queue";
      queue = jQuery._data( elem, type );

      // Speed up dequeue by getting out quickly if this is just a lookup
      if ( data ) {
        if ( !queue || jQuery.isArray(data) ) {
          queue = jQuery._data( elem, type, jQuery.makeArray(data) );
        } else {
          queue.push( data );
        }
      }
      return queue || [];
    }
  },

  dequeue: function( elem, type ) {
    type = type || "fx";

    var queue = jQuery.queue( elem, type ),
      startLength = queue.length,
      fn = queue.shift(),
      hooks = jQuery._queueHooks( elem, type ),
      next = function() {
        jQuery.dequeue( elem, type );
      };

    // If the fx queue is dequeued, always remove the progress sentinel
    if ( fn === "inprogress" ) {
      fn = queue.shift();
      startLength--;
    }

    if ( fn ) {

      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if ( type === "fx" ) {
        queue.unshift( "inprogress" );
      }

      // clear up the last queue stop function
      delete hooks.stop;
      fn.call( elem, next, hooks );
    }

    if ( !startLength && hooks ) {
      hooks.empty.fire();
    }
  },

  // not intended for public consumption - generates a queueHooks object, or returns the current one
  _queueHooks: function( elem, type ) {
    var key = type + "queueHooks";
    return jQuery._data( elem, key ) || jQuery._data( elem, key, {
      empty: jQuery.Callbacks("once memory").add(function() {
        jQuery.removeData( elem, type + "queue", true );
        jQuery.removeData( elem, key, true );
      })
    });
  }
});

jQuery.fn.extend({
  queue: function( type, data ) {
    var setter = 2;

    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
      setter--;
    }

    if ( arguments.length < setter ) {
      return jQuery.queue( this[0], type );
    }

    return data === undefined ?
      this :
      this.each(function() {
        var queue = jQuery.queue( this, type, data );

        // ensure a hooks for this queue
        jQuery._queueHooks( this, type );

        if ( type === "fx" && queue[0] !== "inprogress" ) {
          jQuery.dequeue( this, type );
        }
      });
  },
  dequeue: function( type ) {
    return this.each(function() {
      jQuery.dequeue( this, type );
    });
  },
  // Based off of the plugin by Clint Helfers, with permission.
  // http://blindsignals.com/index.php/2009/07/jquery-delay/
  delay: function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    type = type || "fx";

    return this.queue( type, function( next, hooks ) {
      var timeout = setTimeout( next, time );
      hooks.stop = function() {
        clearTimeout( timeout );
      };
    });
  },
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function( type, obj ) {
    var tmp,
      count = 1,
      defer = jQuery.Deferred(),
      elements = this,
      i = this.length,
      resolve = function() {
        if ( !( --count ) ) {
          defer.resolveWith( elements, [ elements ] );
        }
      };

    if ( typeof type !== "string" ) {
      obj = type;
      type = undefined;
    }
    type = type || "fx";

    while( i-- ) {
      tmp = jQuery._data( elements[ i ], type + "queueHooks" );
      if ( tmp && tmp.empty ) {
        count++;
        tmp.empty.add( resolve );
      }
    }
    resolve();
    return defer.promise( obj );
  }
});
var nodeHook, boolHook, fixSpecified,
  rclass = /[\t\r\n]/g,
  rreturn = /\r/g,
  rtype = /^(?:button|input)$/i,
  rfocusable = /^(?:button|input|object|select|textarea)$/i,
  rclickable = /^a(?:rea|)$/i,
  rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
  getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
  attr: function( name, value ) {
    return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
  },

  removeAttr: function( name ) {
    return this.each(function() {
      jQuery.removeAttr( this, name );
    });
  },

  prop: function( name, value ) {
    return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
  },

  removeProp: function( name ) {
    name = jQuery.propFix[ name ] || name;
    return this.each(function() {
      // try/catch handles cases where IE balks (such as removing a property on window)
      try {
        this[ name ] = undefined;
        delete this[ name ];
      } catch( e ) {}
    });
  },

  addClass: function( value ) {
    var classNames, i, l, elem,
      setClass, c, cl;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).addClass( value.call(this, j, this.className) );
      });
    }

    if ( value && typeof value === "string" ) {
      classNames = value.split( core_rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];

        if ( elem.nodeType === 1 ) {
          if ( !elem.className && classNames.length === 1 ) {
            elem.className = value;

          } else {
            setClass = " " + elem.className + " ";

            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                setClass += classNames[ c ] + " ";
              }
            }
            elem.className = jQuery.trim( setClass );
          }
        }
      }
    }

    return this;
  },

  removeClass: function( value ) {
    var removes, className, elem, c, cl, i, l;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).removeClass( value.call(this, j, this.className) );
      });
    }
    if ( (value && typeof value === "string") || value === undefined ) {
      removes = ( value || "" ).split( core_rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];
        if ( elem.nodeType === 1 && elem.className ) {

          className = (" " + elem.className + " ").replace( rclass, " " );

          // loop over each item in the removal list
          for ( c = 0, cl = removes.length; c < cl; c++ ) {
            // Remove until there is nothing to remove,
            while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
              className = className.replace( " " + removes[ c ] + " " , " " );
            }
          }
          elem.className = value ? jQuery.trim( className ) : "";
        }
      }
    }

    return this;
  },

  toggleClass: function( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( i ) {
        jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = jQuery( this ),
          state = stateVal,
          classNames = value.split( core_rspace );

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space separated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      } else if ( type === "undefined" || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          jQuery._data( this, "__className__", this.className );
        }

        // toggle whole className
        this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
      }
    });
  },

  hasClass: function( selector ) {
    var className = " " + selector + " ",
      i = 0,
      l = this.length;
    for ( ; i < l; i++ ) {
      if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
        return true;
      }
    }

    return false;
  },

  val: function( value ) {
    var hooks, ret, isFunction,
      elem = this[0];

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return;
    }

    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var val,
        self = jQuery(this);

      if ( this.nodeType !== 1 ) {
        return;
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
});

jQuery.extend({
  valHooks: {
    option: {
      get: function( elem ) {
        // attributes.value is undefined in Blackberry 4.7 but
        // uses .value. See #6932
        var val = elem.attributes.value;
        return !val || val.specified ? elem.value : elem.text;
      }
    },
    select: {
      get: function( elem ) {
        var value, i, max, option,
          index = elem.selectedIndex,
          values = [],
          options = elem.options,
          one = elem.type === "select-one";

        // Nothing was selected
        if ( index < 0 ) {
          return null;
        }

        // Loop through all the selected options
        i = one ? index : 0;
        max = one ? index + 1 : options.length;
        for ( ; i < max; i++ ) {
          option = options[ i ];

          // Don't return options that are disabled or in a disabled optgroup
          if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
              (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

            // Get the specific value for the option
            value = jQuery( option ).val();

            // We don't need an array for one selects
            if ( one ) {
              return value;
            }

            // Multi-Selects return an array
            values.push( value );
          }
        }

        // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
        if ( one && !values.length && options.length ) {
          return jQuery( options[ index ] ).val();
        }

        return values;
      },

      set: function( elem, value ) {
        var values = jQuery.makeArray( value );

        jQuery(elem).find("option").each(function() {
          this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
        });

        if ( !values.length ) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  },

  // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
  attrFn: {},

  attr: function( elem, name, value, pass ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set attributes on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
      return jQuery( elem )[ name ]( value );
    }

    // Fallback to prop when attributes are not supported
    if ( typeof elem.getAttribute === "undefined" ) {
      return jQuery.prop( elem, name, value );
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // All attributes are lowercase
    // Grab necessary hook if one is defined
    if ( notxml ) {
      name = name.toLowerCase();
      hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
    }

    if ( value !== undefined ) {

      if ( value === null ) {
        jQuery.removeAttr( elem, name );
        return;

      } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        elem.setAttribute( name, value + "" );
        return value;
      }

    } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
      return ret;

    } else {

      ret = elem.getAttribute( name );

      // Non-existent attributes return null, we normalize to undefined
      return ret === null ?
        undefined :
        ret;
    }
  },

  removeAttr: function( elem, value ) {
    var propName, attrNames, name, isBool,
      i = 0;

    if ( value && elem.nodeType === 1 ) {

      attrNames = value.split( core_rspace );

      for ( ; i < attrNames.length; i++ ) {
        name = attrNames[ i ];

        if ( name ) {
          propName = jQuery.propFix[ name ] || name;
          isBool = rboolean.test( name );

          // See #9699 for explanation of this approach (setting first, then removal)
          // Do not do this for boolean attributes (see #10870)
          if ( !isBool ) {
            jQuery.attr( elem, name, "" );
          }
          elem.removeAttribute( getSetAttribute ? name : propName );

          // Set corresponding property to false for boolean attributes
          if ( isBool && propName in elem ) {
            elem[ propName ] = false;
          }
        }
      }
    }
  },

  attrHooks: {
    type: {
      set: function( elem, value ) {
        // We can't allow the type property to be changed (since it causes problems in IE)
        if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
          jQuery.error( "type property can't be changed" );
        } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
          // Setting the type on a radio button after the value resets the value in IE6-9
          // Reset value to it's default in case type is set after value
          // This is for element creation
          var val = elem.value;
          elem.setAttribute( "type", value );
          if ( val ) {
            elem.value = val;
          }
          return value;
        }
      }
    },
    // Use the value property for back compat
    // Use the nodeHook for button elements in IE6/7 (#1954)
    value: {
      get: function( elem, name ) {
        if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
          return nodeHook.get( elem, name );
        }
        return name in elem ?
          elem.value :
          null;
      },
      set: function( elem, value, name ) {
        if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
          return nodeHook.set( elem, value, name );
        }
        // Does not return so that setAttribute is also used
        elem.value = value;
      }
    }
  },

  propFix: {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },

  prop: function( elem, name, value ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set properties on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    if ( notxml ) {
      // Fix name and attach hooks
      name = jQuery.propFix[ name ] || name;
      hooks = jQuery.propHooks[ name ];
    }

    if ( value !== undefined ) {
      if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        return ( elem[ name ] = value );
      }

    } else {
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {
        return elem[ name ];
      }
    }
  },

  propHooks: {
    tabIndex: {
      get: function( elem ) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        var attributeNode = elem.getAttributeNode("tabindex");

        return attributeNode && attributeNode.specified ?
          parseInt( attributeNode.value, 10 ) :
          rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
            0 :
            undefined;
      }
    }
  }
});

// Hook for boolean attributes
boolHook = {
  get: function( elem, name ) {
    // Align boolean attributes with corresponding properties
    // Fall back to attribute presence where some booleans are not supported
    var attrNode,
      property = jQuery.prop( elem, name );
    return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
      name.toLowerCase() :
      undefined;
  },
  set: function( elem, value, name ) {
    var propName;
    if ( value === false ) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr( elem, name );
    } else {
      // value is true since we know at this point it's type boolean and not false
      // Set boolean attributes to the same name and set the DOM property
      propName = jQuery.propFix[ name ] || name;
      if ( propName in elem ) {
        // Only set the IDL specifically if it already exists on the element
        elem[ propName ] = true;
      }

      elem.setAttribute( name, name.toLowerCase() );
    }
    return name;
  }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

  fixSpecified = {
    name: true,
    id: true,
    coords: true
  };

  // Use this for any attribute in IE6/7
  // This fixes almost every IE6/7 issue
  nodeHook = jQuery.valHooks.button = {
    get: function( elem, name ) {
      var ret;
      ret = elem.getAttributeNode( name );
      return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
        ret.value :
        undefined;
    },
    set: function( elem, value, name ) {
      // Set the existing or create a new attribute node
      var ret = elem.getAttributeNode( name );
      if ( !ret ) {
        ret = document.createAttribute( name );
        elem.setAttributeNode( ret );
      }
      return ( ret.value = value + "" );
    }
  };

  // Set width and height to auto instead of 0 on empty string( Bug #8150 )
  // This is for removals
  jQuery.each([ "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      set: function( elem, value ) {
        if ( value === "" ) {
          elem.setAttribute( name, "auto" );
          return value;
        }
      }
    });
  });

  // Set contenteditable to false on removals(#10429)
  // Setting to empty string throws an error as an invalid value
  jQuery.attrHooks.contenteditable = {
    get: nodeHook.get,
    set: function( elem, value, name ) {
      if ( value === "" ) {
        value = "false";
      }
      nodeHook.set( elem, value, name );
    }
  };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
  jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      get: function( elem ) {
        var ret = elem.getAttribute( name, 2 );
        return ret === null ? undefined : ret;
      }
    });
  });
}

if ( !jQuery.support.style ) {
  jQuery.attrHooks.style = {
    get: function( elem ) {
      // Return undefined in the case of empty string
      // Normalize to lowercase since IE uppercases css property names
      return elem.style.cssText.toLowerCase() || undefined;
    },
    set: function( elem, value ) {
      return ( elem.style.cssText = value + "" );
    }
  };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
  jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
    get: function( elem ) {
      var parent = elem.parentNode;

      if ( parent ) {
        parent.selectedIndex;

        // Make sure that it also works with optgroups, see #5701
        if ( parent.parentNode ) {
          parent.parentNode.selectedIndex;
        }
      }
      return null;
    }
  });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
  jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      get: function( elem ) {
        // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      }
    };
  });
}
jQuery.each([ "radio", "checkbox" ], function() {
  jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
    set: function( elem, value ) {
      if ( jQuery.isArray( value ) ) {
        return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
      }
    }
  });
});
var rformElems = /^(?:textarea|input|select)$/i,
  rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
  rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
  rkeyEvent = /^key/,
  rmouseEvent = /^(?:mouse|contextmenu)|click/,
  rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
  hoverHack = function( events ) {
    return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
  };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

  add: function( elem, types, handler, data, selector ) {

    var elemData, eventHandle, events,
      t, tns, type, namespaces, handleObj,
      handleObjIn, handlers, special;

    // Don't attach events to noData or text/comment nodes (allow plain objects tho)
    if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
      return;
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if ( handler.handler ) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    if ( !handler.guid ) {
      handler.guid = jQuery.guid++;
    }

    // Init the element's event structure and main handler, if this is the first
    events = elemData.events;
    if ( !events ) {
      elemData.events = events = {};
    }
    eventHandle = elemData.handle;
    if ( !eventHandle ) {
      elemData.handle = eventHandle = function( e ) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
          jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
          undefined;
      };
      // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
      eventHandle.elem = elem;
    }

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = jQuery.trim( hoverHack(types) ).split( " " );
    for ( t = 0; t < types.length; t++ ) {

      tns = rtypenamespace.exec( types[t] ) || [];
      type = tns[1];
      namespaces = ( tns[2] || "" ).split( "." ).sort();

      // If event changes its type, use the special event handlers for the changed type
      special = jQuery.event.special[ type ] || {};

      // If selector defined, determine special event api type, otherwise given type
      type = ( selector ? special.delegateType : special.bindType ) || type;

      // Update special based on newly reset type
      special = jQuery.event.special[ type ] || {};

      // handleObj is passed to all event handlers
      handleObj = jQuery.extend({
        type: type,
        origType: tns[1],
        data: data,
        handler: handler,
        guid: handler.guid,
        selector: selector,
        needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
        namespace: namespaces.join(".")
      }, handleObjIn );

      // Init the event handler queue if we're the first
      handlers = events[ type ];
      if ( !handlers ) {
        handlers = events[ type ] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener/attachEvent if the special events handler returns false
        if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
          // Bind the global event handler to the element
          if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );

          } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + type, eventHandle );
          }
        }
      }

      if ( special.add ) {
        special.add.call( elem, handleObj );

        if ( !handleObj.handler.guid ) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add to the element's handler list, delegates in front
      if ( selector ) {
        handlers.splice( handlers.delegateCount++, 0, handleObj );
      } else {
        handlers.push( handleObj );
      }

      // Keep track of which events have ever been used, for event optimization
      jQuery.event.global[ type ] = true;
    }

    // Nullify elem to prevent memory leaks in IE
    elem = null;
  },

  global: {},

  // Detach an event or set of events from an element
  remove: function( elem, types, handler, selector, mappedTypes ) {

    var t, tns, type, origType, namespaces, origCount,
      j, events, special, eventType, handleObj,
      elemData = jQuery.hasData( elem ) && jQuery._data( elem );

    if ( !elemData || !(events = elemData.events) ) {
      return;
    }

    // Once for each type.namespace in types; type may be omitted
    types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
    for ( t = 0; t < types.length; t++ ) {
      tns = rtypenamespace.exec( types[t] ) || [];
      type = origType = tns[1];
      namespaces = tns[2];

      // Unbind all events (on this namespace, if provided) for the element
      if ( !type ) {
        for ( type in events ) {
          jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
        }
        continue;
      }

      special = jQuery.event.special[ type ] || {};
      type = ( selector? special.delegateType : special.bindType ) || type;
      eventType = events[ type ] || [];
      origCount = eventType.length;
      namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

      // Remove matching events
      for ( j = 0; j < eventType.length; j++ ) {
        handleObj = eventType[ j ];

        if ( ( mappedTypes || origType === handleObj.origType ) &&
           ( !handler || handler.guid === handleObj.guid ) &&
           ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
           ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
          eventType.splice( j--, 1 );

          if ( handleObj.selector ) {
            eventType.delegateCount--;
          }
          if ( special.remove ) {
            special.remove.call( elem, handleObj );
          }
        }
      }

      // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)
      if ( eventType.length === 0 && origCount !== eventType.length ) {
        if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
          jQuery.removeEvent( elem, type, elemData.handle );
        }

        delete events[ type ];
      }
    }

    // Remove the expando if it's no longer used
    if ( jQuery.isEmptyObject( events ) ) {
      delete elemData.handle;

      // removeData also checks for emptiness and clears the expando if empty
      // so use it instead of delete
      jQuery.removeData( elem, "events", true );
    }
  },

  // Events that are safe to short-circuit if no handlers are attached.
  // Native DOM events should not be added, they may have inline handlers.
  customEvent: {
    "getData": true,
    "setData": true,
    "changeData": true
  },

  trigger: function( event, data, elem, onlyHandlers ) {
    // Don't do events on text and comment nodes
    if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
      return;
    }

    // Event object or event type
    var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
      type = event.type || event,
      namespaces = [];

    // focus/blur morphs to focusin/out; ensure we're not firing them right now
    if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
      return;
    }

    if ( type.indexOf( "!" ) >= 0 ) {
      // Exclusive events trigger only for the exact event (no namespaces)
      type = type.slice(0, -1);
      exclusive = true;
    }

    if ( type.indexOf( "." ) >= 0 ) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split(".");
      type = namespaces.shift();
      namespaces.sort();
    }

    if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
      // No jQuery handlers for this event type, and it can't have inline handlers
      return;
    }

    // Caller can pass in an Event, Object, or just an event type string
    event = typeof event === "object" ?
      // jQuery.Event object
      event[ jQuery.expando ] ? event :
      // Object literal
      new jQuery.Event( type, event ) :
      // Just the event type (string)
      new jQuery.Event( type );

    event.type = type;
    event.isTrigger = true;
    event.exclusive = exclusive;
    event.namespace = namespaces.join( "." );
    event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
    ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

    // Handle a global trigger
    if ( !elem ) {

      // TODO: Stop taunting the data cache; remove global events and always attach to document
      cache = jQuery.cache;
      for ( i in cache ) {
        if ( cache[ i ].events && cache[ i ].events[ type ] ) {
          jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
        }
      }
      return;
    }

    // Clean up the event in case it is being reused
    event.result = undefined;
    if ( !event.target ) {
      event.target = elem;
    }

    // Clone any incoming data and prepend the event, creating the handler arg list
    data = data != null ? jQuery.makeArray( data ) : [];
    data.unshift( event );

    // Allow special events to draw outside the lines
    special = jQuery.event.special[ type ] || {};
    if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
      return;
    }

    // Determine event propagation path in advance, per W3C events spec (#9951)
    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    eventPath = [[ elem, special.bindType || type ]];
    if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

      bubbleType = special.delegateType || type;
      cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
      for ( old = elem; cur; cur = cur.parentNode ) {
        eventPath.push([ cur, bubbleType ]);
        old = cur;
      }

      // Only add window if we got to document (e.g., not plain obj or detached DOM)
      if ( old === (elem.ownerDocument || document) ) {
        eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
      }
    }

    // Fire handlers on the event path
    for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

      cur = eventPath[i][0];
      event.type = eventPath[i][1];

      handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
      if ( handle ) {
        handle.apply( cur, data );
      }
      // Note that this is a bare JS function and not a jQuery handler
      handle = ontype && cur[ ontype ];
      if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
        event.preventDefault();
      }
    }
    event.type = type;

    // If nobody prevented the default action, do it now
    if ( !onlyHandlers && !event.isDefaultPrevented() ) {

      if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
        !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

        // Call a native DOM method on the target with the same name name as the event.
        // Can't use an .isFunction() check here because IE6/7 fails that test.
        // Don't do default actions on window, that's where global variables be (#6170)
        // IE<9 dies on focus/blur to hidden element (#1486)
        if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

          // Don't re-trigger an onFOO event when we call its FOO() method
          old = elem[ ontype ];

          if ( old ) {
            elem[ ontype ] = null;
          }

          // Prevent re-triggering of the same event, since we already bubbled it above
          jQuery.event.triggered = type;
          elem[ type ]();
          jQuery.event.triggered = undefined;

          if ( old ) {
            elem[ ontype ] = old;
          }
        }
      }
    }

    return event.result;
  },

  dispatch: function( event ) {

    // Make a writable jQuery.Event from the native event object
    event = jQuery.event.fix( event || window.event );

    var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
      handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
      delegateCount = handlers.delegateCount,
      args = core_slice.call( arguments ),
      run_all = !event.exclusive && !event.namespace,
      special = jQuery.event.special[ event.type ] || {},
      handlerQueue = [];

    // Use the fix-ed jQuery.Event rather than the (read-only) native event
    args[0] = event;
    event.delegateTarget = this;

    // Call the preDispatch hook for the mapped type, and let it bail if desired
    if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
      return;
    }

    // Determine handlers that should run if there are delegated events
    // Avoid non-left-click bubbling in Firefox (#3861)
    if ( delegateCount && !(event.button && event.type === "click") ) {

      for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

        // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
        if ( cur.disabled !== true || event.type !== "click" ) {
          selMatch = {};
          matches = [];
          for ( i = 0; i < delegateCount; i++ ) {
            handleObj = handlers[ i ];
            sel = handleObj.selector;

            if ( selMatch[ sel ] === undefined ) {
              selMatch[ sel ] = handleObj.needsContext ?
                jQuery( sel, this ).index( cur ) >= 0 :
                jQuery.find( sel, this, null, [ cur ] ).length;
            }
            if ( selMatch[ sel ] ) {
              matches.push( handleObj );
            }
          }
          if ( matches.length ) {
            handlerQueue.push({ elem: cur, matches: matches });
          }
        }
      }
    }

    // Add the remaining (directly-bound) handlers
    if ( handlers.length > delegateCount ) {
      handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
    }

    // Run delegates first; they may want to stop propagation beneath us
    for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
      matched = handlerQueue[ i ];
      event.currentTarget = matched.elem;

      for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
        handleObj = matched.matches[ j ];

        // Triggered event must either 1) be non-exclusive and have no namespace, or
        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
        if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

          event.data = handleObj.data;
          event.handleObj = handleObj;

          ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

          if ( ret !== undefined ) {
            event.result = ret;
            if ( ret === false ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if ( special.postDispatch ) {
      special.postDispatch.call( this, event );
    }

    return event.result;
  },

  // Includes some event props shared by KeyEvent and MouseEvent
  // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
  props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

  fixHooks: {},

  keyHooks: {
    props: "char charCode key keyCode".split(" "),
    filter: function( event, original ) {

      // Add which for key events
      if ( event.which == null ) {
        event.which = original.charCode != null ? original.charCode : original.keyCode;
      }

      return event;
    }
  },

  mouseHooks: {
    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
    filter: function( event, original ) {
      var eventDoc, doc, body,
        button = original.button,
        fromElement = original.fromElement;

      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && original.clientX != null ) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Add relatedTarget, if necessary
      if ( !event.relatedTarget && fromElement ) {
        event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && button !== undefined ) {
        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
      }

      return event;
    }
  },

  fix: function( event ) {
    if ( event[ jQuery.expando ] ) {
      return event;
    }

    // Create a writable copy of the event object and normalize some properties
    var i, prop,
      originalEvent = event,
      fixHook = jQuery.event.fixHooks[ event.type ] || {},
      copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

    event = jQuery.Event( originalEvent );

    for ( i = copy.length; i; ) {
      prop = copy[ --i ];
      event[ prop ] = originalEvent[ prop ];
    }

    // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
    if ( !event.target ) {
      event.target = originalEvent.srcElement || document;
    }

    // Target should not be a text node (#504, Safari)
    if ( event.target.nodeType === 3 ) {
      event.target = event.target.parentNode;
    }

    // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
    event.metaKey = !!event.metaKey;

    return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
  },

  special: {
    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },

    focus: {
      delegateType: "focusin"
    },
    blur: {
      delegateType: "focusout"
    },

    beforeunload: {
      setup: function( data, namespaces, eventHandle ) {
        // We only want to do this special case on windows
        if ( jQuery.isWindow( this ) ) {
          this.onbeforeunload = eventHandle;
        }
      },

      teardown: function( namespaces, eventHandle ) {
        if ( this.onbeforeunload === eventHandle ) {
          this.onbeforeunload = null;
        }
      }
    }
  },

  simulate: function( type, elem, event, bubble ) {
    // Piggyback on a donor event to simulate a different one.
    // Fake originalEvent to avoid donor's stopPropagation, but if the
    // simulated event prevents default then we do the same on the donor.
    var e = jQuery.extend(
      new jQuery.Event(),
      event,
      { type: type,
        isSimulated: true,
        originalEvent: {}
      }
    );
    if ( bubble ) {
      jQuery.event.trigger( e, null, elem );
    } else {
      jQuery.event.dispatch.call( elem, e );
    }
    if ( e.isDefaultPrevented() ) {
      event.preventDefault();
    }
  }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
  function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, handle, false );
    }
  } :
  function( elem, type, handle ) {
    var name = "on" + type;

    if ( elem.detachEvent ) {

      // #8545, #7054, preventing memory leaks for custom events in IE6-8 –
      // detachEvent needed property on element, by name of that event, to properly expose it to GC
      if ( typeof elem[ name ] === "undefined" ) {
        elem[ name ] = null;
      }

      elem.detachEvent( name, handle );
    }
  };

jQuery.Event = function( src, props ) {
  // Allow instantiation without the 'new' keyword
  if ( !(this instanceof jQuery.Event) ) {
    return new jQuery.Event( src, props );
  }

  // Event object
  if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    jQuery.extend( this, props );
  }

  // Create a timestamp if incoming event doesn't have one
  this.timeStamp = src && src.timeStamp || jQuery.now();

  // Mark it as fixed
  this[ jQuery.expando ] = true;
};

function returnFalse() {
  return false;
}
function returnTrue() {
  return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
  preventDefault: function() {
    this.isDefaultPrevented = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }

    // if preventDefault exists run it on the original event
    if ( e.preventDefault ) {
      e.preventDefault();

    // otherwise set the returnValue property of the original event to false (IE)
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    this.isPropagationStopped = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }
    // if stopPropagation exists run it on the original event
    if ( e.stopPropagation ) {
      e.stopPropagation();
    }
    // otherwise set the cancelBubble property of the original event to true (IE)
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  },
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, function( orig, fix ) {
  jQuery.event.special[ orig ] = {
    delegateType: fix,
    bindType: fix,

    handle: function( event ) {
      var ret,
        target = this,
        related = event.relatedTarget,
        handleObj = event.handleObj,
        selector = handleObj.selector;

      // For mousenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window
      if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply( this, arguments );
        event.type = fix;
      }
      return ret;
    }
  };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

  jQuery.event.special.submit = {
    setup: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Lazy-add a submit handler when a descendant form may potentially be submitted
      jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
        // Node name check avoids a VML-related crash in IE (#9807)
        var elem = e.target,
          form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
        if ( form && !jQuery._data( form, "_submit_attached" ) ) {
          jQuery.event.add( form, "submit._submit", function( event ) {
            event._submit_bubble = true;
          });
          jQuery._data( form, "_submit_attached", true );
        }
      });
      // return undefined since we don't need an event listener
    },

    postDispatch: function( event ) {
      // If form was submitted by the user, bubble the event up the tree
      if ( event._submit_bubble ) {
        delete event._submit_bubble;
        if ( this.parentNode && !event.isTrigger ) {
          jQuery.event.simulate( "submit", this.parentNode, event, true );
        }
      }
    },

    teardown: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
      jQuery.event.remove( this, "._submit" );
    }
  };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

  jQuery.event.special.change = {

    setup: function() {

      if ( rformElems.test( this.nodeName ) ) {
        // IE doesn't fire change on a check/radio until blur; trigger it on click
        // after a propertychange. Eat the blur-change in special.change.handle.
        // This still fires onchange a second time for check/radio after blur.
        if ( this.type === "checkbox" || this.type === "radio" ) {
          jQuery.event.add( this, "propertychange._change", function( event ) {
            if ( event.originalEvent.propertyName === "checked" ) {
              this._just_changed = true;
            }
          });
          jQuery.event.add( this, "click._change", function( event ) {
            if ( this._just_changed && !event.isTrigger ) {
              this._just_changed = false;
            }
            // Allow triggered, simulated change events (#11500)
            jQuery.event.simulate( "change", this, event, true );
          });
        }
        return false;
      }
      // Delegated event; lazy-add a change handler on descendant inputs
      jQuery.event.add( this, "beforeactivate._change", function( e ) {
        var elem = e.target;

        if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
          jQuery.event.add( elem, "change._change", function( event ) {
            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
              jQuery.event.simulate( "change", this.parentNode, event, true );
            }
          });
          jQuery._data( elem, "_change_attached", true );
        }
      });
    },

    handle: function( event ) {
      var elem = event.target;

      // Swallow native change events from checkbox/radio, we already triggered them above
      if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
        return event.handleObj.handler.apply( this, arguments );
      }
    },

    teardown: function() {
      jQuery.event.remove( this, "._change" );

      return !rformElems.test( this.nodeName );
    }
  };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
  jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    // Attach a single capturing handler while someone wants focusin/focusout
    var attaches = 0,
      handler = function( event ) {
        jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
      };

    jQuery.event.special[ fix ] = {
      setup: function() {
        if ( attaches++ === 0 ) {
          document.addEventListener( orig, handler, true );
        }
      },
      teardown: function() {
        if ( --attaches === 0 ) {
          document.removeEventListener( orig, handler, true );
        }
      }
    };
  });
}

jQuery.fn.extend({

  on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
    var origFn, type;

    // Types can be a map of types/handlers
    if ( typeof types === "object" ) {
      // ( types-Object, selector, data )
      if ( typeof selector !== "string" ) { // && selector != null
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
      }
      for ( type in types ) {
        this.on( type, selector, data, types[ type ], one );
      }
      return this;
    }

    if ( data == null && fn == null ) {
      // ( types, fn )
      fn = selector;
      data = selector = undefined;
    } else if ( fn == null ) {
      if ( typeof selector === "string" ) {
        // ( types, selector, fn )
        fn = data;
        data = undefined;
      } else {
        // ( types, data, fn )
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if ( fn === false ) {
      fn = returnFalse;
    } else if ( !fn ) {
      return this;
    }

    if ( one === 1 ) {
      origFn = fn;
      fn = function( event ) {
        // Can use an empty set, since event contains the info
        jQuery().off( event );
        return origFn.apply( this, arguments );
      };
      // Use same guid so caller can remove using origFn
      fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    return this.each( function() {
      jQuery.event.add( this, types, fn, data, selector );
    });
  },
  one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
  },
  off: function( types, selector, fn ) {
    var handleObj, type;
    if ( types && types.preventDefault && types.handleObj ) {
      // ( event )  dispatched jQuery.Event
      handleObj = types.handleObj;
      jQuery( types.delegateTarget ).off(
        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
        handleObj.selector,
        handleObj.handler
      );
      return this;
    }
    if ( typeof types === "object" ) {
      // ( types-object [, selector] )
      for ( type in types ) {
        this.off( type, selector, types[ type ] );
      }
      return this;
    }
    if ( selector === false || typeof selector === "function" ) {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }
    if ( fn === false ) {
      fn = returnFalse;
    }
    return this.each(function() {
      jQuery.event.remove( this, types, fn, selector );
    });
  },

  bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
  },
  unbind: function( types, fn ) {
    return this.off( types, null, fn );
  },

  live: function( types, data, fn ) {
    jQuery( this.context ).on( types, this.selector, data, fn );
    return this;
  },
  die: function( types, fn ) {
    jQuery( this.context ).off( types, this.selector || "**", fn );
    return this;
  },

  delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
  },
  undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
  },

  trigger: function( type, data ) {
    return this.each(function() {
      jQuery.event.trigger( type, data, this );
    });
  },
  triggerHandler: function( type, data ) {
    if ( this[0] ) {
      return jQuery.event.trigger( type, data, this[0], true );
    }
  },

  toggle: function( fn ) {
    // Save reference to arguments for access in closure
    var args = arguments,
      guid = fn.guid || jQuery.guid++,
      i = 0,
      toggler = function( event ) {
        // Figure out which function to execute
        var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
        jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

        // Make sure that clicks stop
        event.preventDefault();

        // and execute the function
        return args[ lastToggle ].apply( this, arguments ) || false;
      };

    // link all the functions, so any of them can unbind this click handler
    toggler.guid = guid;
    while ( i < args.length ) {
      args[ i++ ].guid = guid;
    }

    return this.click( toggler );
  },

  hover: function( fnOver, fnOut ) {
    return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
  }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

  // Handle event binding
  jQuery.fn[ name ] = function( data, fn ) {
    if ( fn == null ) {
      fn = data;
      data = null;
    }

    return arguments.length > 0 ?
      this.on( name, null, data, fn ) :
      this.trigger( name );
  };

  if ( rkeyEvent.test( name ) ) {
    jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
  }

  if ( rmouseEvent.test( name ) ) {
    jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
  }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
  assertGetIdNotName,
  Expr,
  getText,
  isXML,
  contains,
  compile,
  sortOrder,
  hasDuplicate,
  outermostContext,

  baseHasDuplicate = true,
  strundefined = "undefined",

  expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

  Token = String,
  document = window.document,
  docElem = document.documentElement,
  dirruns = 0,
  done = 0,
  pop = [].pop,
  push = [].push,
  slice = [].slice,
  // Use a stripped-down indexOf if a native one is unavailable
  indexOf = [].indexOf || function( elem ) {
    var i = 0,
      len = this.length;
    for ( ; i < len; i++ ) {
      if ( this[i] === elem ) {
        return i;
      }
    }
    return -1;
  },

  // Augment a function for special use by Sizzle
  markFunction = function( fn, value ) {
    fn[ expando ] = value == null || value;
    return fn;
  },

  createCache = function() {
    var cache = {},
      keys = [];

    return markFunction(function( key, value ) {
      // Only keep the most recent entries
      if ( keys.push( key ) > Expr.cacheLength ) {
        delete cache[ keys.shift() ];
      }

      return (cache[ key ] = value);
    }, cache );
  },

  classCache = createCache(),
  tokenCache = createCache(),
  compilerCache = createCache(),

  // Regex

  // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
  whitespace = "[\\x20\\t\\r\\n\\f]",
  // http://www.w3.org/TR/css3-syntax/#characters
  characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

  // Loosely modeled on CSS identifier characters
  // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
  // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  identifier = characterEncoding.replace( "w", "w#" ),

  // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
  operators = "([*^$|!~]?=)",
  attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
    "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

  // Prefer arguments not in parens/brackets,
  //   then attribute selectors and non-pseudos (denoted by :),
  //   then anything else
  // These preferences are here to reduce the number of selectors
  //   needing tokenize in the PSEUDO preFilter
  pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

  // For matchExpr.POS and matchExpr.needsContext
  pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
    "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

  // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
  rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

  rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
  rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
  rpseudo = new RegExp( pseudos ),

  // Easily-parseable/retrievable ID or TAG or CLASS selectors
  rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

  rnot = /^:not/,
  rsibling = /[\x20\t\r\n\f]*[+~]/,
  rendsWithNot = /:not\($/,

  rheader = /h\d/i,
  rinputs = /input|select|textarea|button/i,

  rbackslash = /\\(?!\\)/g,

  matchExpr = {
    "ID": new RegExp( "^#(" + characterEncoding + ")" ),
    "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
    "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
    "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
    "ATTR": new RegExp( "^" + attributes ),
    "PSEUDO": new RegExp( "^" + pseudos ),
    "POS": new RegExp( pos, "i" ),
    "CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
      "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
      "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    // For use in libraries implementing .is()
    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
  },

  // Support

  // Used for testing something on an element
  assert = function( fn ) {
    var div = document.createElement("div");

    try {
      return fn( div );
    } catch (e) {
      return false;
    } finally {
      // release memory in IE
      div = null;
    }
  },

  // Check if getElementsByTagName("*") returns only elements
  assertTagNameNoComments = assert(function( div ) {
    div.appendChild( document.createComment("") );
    return !div.getElementsByTagName("*").length;
  }),

  // Check if getAttribute returns normalized href attributes
  assertHrefNotNormalized = assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
      div.firstChild.getAttribute("href") === "#";
  }),

  // Check if attributes should be retrieved by attribute nodes
  assertAttributes = assert(function( div ) {
    div.innerHTML = "<select></select>";
    var type = typeof div.lastChild.getAttribute("multiple");
    // IE8 returns a string for some attributes even when not present
    return type !== "boolean" && type !== "string";
  }),

  // Check if getElementsByClassName can be trusted
  assertUsableClassName = assert(function( div ) {
    // Opera can't find a second classname (in 9.6)
    div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
    if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
      return false;
    }

    // Safari 3.2 caches class attributes and doesn't catch changes
    div.lastChild.className = "e";
    return div.getElementsByClassName("e").length === 2;
  }),

  // Check if getElementById returns elements by name
  // Check if getElementsByName privileges form controls or returns elements by ID
  assertUsableName = assert(function( div ) {
    // Inject content
    div.id = expando + 0;
    div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
    docElem.insertBefore( div, docElem.firstChild );

    // Test
    var pass = document.getElementsByName &&
      // buggy browsers will return fewer than the correct 2
      document.getElementsByName( expando ).length === 2 +
      // buggy browsers will return more than the correct 0
      document.getElementsByName( expando + 0 ).length;
    assertGetIdNotName = !document.getElementById( expando );

    // Cleanup
    docElem.removeChild( div );

    return pass;
  });

// If slice is not available, provide a backup
try {
  slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
  slice = function( i ) {
    var elem,
      results = [];
    for ( ; (elem = this[i]); i++ ) {
      results.push( elem );
    }
    return results;
  };
}

function Sizzle( selector, context, results, seed ) {
  results = results || [];
  context = context || document;
  var match, elem, xml, m,
    nodeType = context.nodeType;

  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  if ( nodeType !== 1 && nodeType !== 9 ) {
    return [];
  }

  xml = isXML( context );

  if ( !xml && !seed ) {
    if ( (match = rquickExpr.exec( selector )) ) {
      // Speed-up: Sizzle("#ID")
      if ( (m = match[1]) ) {
        if ( nodeType === 9 ) {
          elem = context.getElementById( m );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE, Opera, and Webkit return items
            // by name instead of ID
            if ( elem.id === m ) {
              results.push( elem );
              return results;
            }
          } else {
            return results;
          }
        } else {
          // Context is not a document
          if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
            contains( context, elem ) && elem.id === m ) {
            results.push( elem );
            return results;
          }
        }

      // Speed-up: Sizzle("TAG")
      } else if ( match[2] ) {
        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
        return results;

      // Speed-up: Sizzle(".CLASS")
      } else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
        return results;
      }
    }
  }

  // All others
  return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
  return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
  return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return name === "input" && elem.type === type;
  };
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return (name === "input" || name === "button") && elem.type === type;
  };
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
  return markFunction(function( argument ) {
    argument = +argument;
    return markFunction(function( seed, matches ) {
      var j,
        matchIndexes = fn( [], seed.length, argument ),
        i = matchIndexes.length;

      // Match elements found at the specified indexes
      while ( i-- ) {
        if ( seed[ (j = matchIndexes[i]) ] ) {
          seed[j] = !(matches[j] = seed[j]);
        }
      }
    });
  });
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
  var node,
    ret = "",
    i = 0,
    nodeType = elem.nodeType;

  if ( nodeType ) {
    if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (see #11153)
      if ( typeof elem.textContent === "string" ) {
        return elem.textContent;
      } else {
        // Traverse its children
        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
          ret += getText( elem );
        }
      }
    } else if ( nodeType === 3 || nodeType === 4 ) {
      return elem.nodeValue;
    }
    // Do not include comment or processing instruction nodes
  } else {

    // If no nodeType, this is expected to be an array
    for ( ; (node = elem[i]); i++ ) {
      // Do not traverse comment nodes
      ret += getText( node );
    }
  }
  return ret;
};

isXML = Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  var documentElement = elem && (elem.ownerDocument || elem).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
  function( a, b ) {
    var adown = a.nodeType === 9 ? a.documentElement : a,
      bup = b && b.parentNode;
    return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
  } :
  docElem.compareDocumentPosition ?
  function( a, b ) {
    return b && !!( a.compareDocumentPosition( b ) & 16 );
  } :
  function( a, b ) {
    while ( (b = b.parentNode) ) {
      if ( b === a ) {
        return true;
      }
    }
    return false;
  };

Sizzle.attr = function( elem, name ) {
  var val,
    xml = isXML( elem );

  if ( !xml ) {
    name = name.toLowerCase();
  }
  if ( (val = Expr.attrHandle[ name ]) ) {
    return val( elem );
  }
  if ( xml || assertAttributes ) {
    return elem.getAttribute( name );
  }
  val = elem.getAttributeNode( name );
  return val ?
    typeof elem[ name ] === "boolean" ?
      elem[ name ] ? name : null :
      val.specified ? val.value : null :
    null;
};

Expr = Sizzle.selectors = {

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  // IE6/7 return a modified href
  attrHandle: assertHrefNotNormalized ?
    {} :
    {
      "href": function( elem ) {
        return elem.getAttribute( "href", 2 );
      },
      "type": function( elem ) {
        return elem.getAttribute("type");
      }
    },

  find: {
    "ID": assertGetIdNotName ?
      function( id, context, xml ) {
        if ( typeof context.getElementById !== strundefined && !xml ) {
          var m = context.getElementById( id );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          return m && m.parentNode ? [m] : [];
        }
      } :
      function( id, context, xml ) {
        if ( typeof context.getElementById !== strundefined && !xml ) {
          var m = context.getElementById( id );

          return m ?
            m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
              [m] :
              undefined :
            [];
        }
      },

    "TAG": assertTagNameNoComments ?
      function( tag, context ) {
        if ( typeof context.getElementsByTagName !== strundefined ) {
          return context.getElementsByTagName( tag );
        }
      } :
      function( tag, context ) {
        var results = context.getElementsByTagName( tag );

        // Filter out possible comments
        if ( tag === "*" ) {
          var elem,
            tmp = [],
            i = 0;

          for ( ; (elem = results[i]); i++ ) {
            if ( elem.nodeType === 1 ) {
              tmp.push( elem );
            }
          }

          return tmp;
        }
        return results;
      },

    "NAME": assertUsableName && function( tag, context ) {
      if ( typeof context.getElementsByName !== strundefined ) {
        return context.getElementsByName( name );
      }
    },

    "CLASS": assertUsableClassName && function( className, context, xml ) {
      if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
        return context.getElementsByClassName( className );
      }
    }
  },

  relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
  },

  preFilter: {
    "ATTR": function( match ) {
      match[1] = match[1].replace( rbackslash, "" );

      // Move the given value to match[3] whether quoted or unquoted
      match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

      if ( match[2] === "~=" ) {
        match[3] = " " + match[3] + " ";
      }

      return match.slice( 0, 4 );
    },

    "CHILD": function( match ) {
      /* matches from matchExpr["CHILD"]
        1 type (only|nth|...)
        2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
        3 xn-component of xn+y argument ([+-]?\d*n|)
        4 sign of xn-component
        5 x of xn-component
        6 sign of y-component
        7 y of y-component
      */
      match[1] = match[1].toLowerCase();

      if ( match[1] === "nth" ) {
        // nth-child requires argument
        if ( !match[2] ) {
          Sizzle.error( match[0] );
        }

        // numeric x and y parameters for Expr.filter.CHILD
        // remember that false/true cast respectively to 0/1
        match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
        match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

      // other types prohibit arguments
      } else if ( match[2] ) {
        Sizzle.error( match[0] );
      }

      return match;
    },

    "PSEUDO": function( match ) {
      var unquoted, excess;
      if ( matchExpr["CHILD"].test( match[0] ) ) {
        return null;
      }

      if ( match[3] ) {
        match[2] = match[3];
      } else if ( (unquoted = match[4]) ) {
        // Only check arguments that contain a pseudo
        if ( rpseudo.test(unquoted) &&
          // Get excess from tokenize (recursively)
          (excess = tokenize( unquoted, true )) &&
          // advance to the next closing parenthesis
          (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

          // excess is a negative index
          unquoted = unquoted.slice( 0, excess );
          match[0] = match[0].slice( 0, excess );
        }
        match[2] = unquoted;
      }

      // Return only captures needed by the pseudo filter method (type and argument)
      return match.slice( 0, 3 );
    }
  },

  filter: {
    "ID": assertGetIdNotName ?
      function( id ) {
        id = id.replace( rbackslash, "" );
        return function( elem ) {
          return elem.getAttribute("id") === id;
        };
      } :
      function( id ) {
        id = id.replace( rbackslash, "" );
        return function( elem ) {
          var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
          return node && node.value === id;
        };
      },

    "TAG": function( nodeName ) {
      if ( nodeName === "*" ) {
        return function() { return true; };
      }
      nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

      return function( elem ) {
        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
      };
    },

    "CLASS": function( className ) {
      var pattern = classCache[ expando ][ className ];
      if ( !pattern ) {
        pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
      }
      return function( elem ) {
        return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
      };
    },

    "ATTR": function( name, operator, check ) {
      return function( elem, context ) {
        var result = Sizzle.attr( elem, name );

        if ( result == null ) {
          return operator === "!=";
        }
        if ( !operator ) {
          return true;
        }

        result += "";

        return operator === "=" ? result === check :
          operator === "!=" ? result !== check :
          operator === "^=" ? check && result.indexOf( check ) === 0 :
          operator === "*=" ? check && result.indexOf( check ) > -1 :
          operator === "$=" ? check && result.substr( result.length - check.length ) === check :
          operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
          operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
          false;
      };
    },

    "CHILD": function( type, argument, first, last ) {

      if ( type === "nth" ) {
        return function( elem ) {
          var node, diff,
            parent = elem.parentNode;

          if ( first === 1 && last === 0 ) {
            return true;
          }

          if ( parent ) {
            diff = 0;
            for ( node = parent.firstChild; node; node = node.nextSibling ) {
              if ( node.nodeType === 1 ) {
                diff++;
                if ( elem === node ) {
                  break;
                }
              }
            }
          }

          // Incorporate the offset (or cast to NaN), then check against cycle size
          diff -= last;
          return diff === first || ( diff % first === 0 && diff / first >= 0 );
        };
      }

      return function( elem ) {
        var node = elem;

        switch ( type ) {
          case "only":
          case "first":
            while ( (node = node.previousSibling) ) {
              if ( node.nodeType === 1 ) {
                return false;
              }
            }

            if ( type === "first" ) {
              return true;
            }

            node = elem;

            /* falls through */
          case "last":
            while ( (node = node.nextSibling) ) {
              if ( node.nodeType === 1 ) {
                return false;
              }
            }

            return true;
        }
      };
    },

    "PSEUDO": function( pseudo, argument ) {
      // pseudo-class names are case-insensitive
      // http://www.w3.org/TR/selectors/#pseudo-classes
      // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      // Remember that setFilters inherits from pseudos
      var args,
        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
          Sizzle.error( "unsupported pseudo: " + pseudo );

      // The user may use createPseudo to indicate that
      // arguments are needed to create the filter function
      // just as Sizzle does
      if ( fn[ expando ] ) {
        return fn( argument );
      }

      // But maintain support for old signatures
      if ( fn.length > 1 ) {
        args = [ pseudo, pseudo, "", argument ];
        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
          markFunction(function( seed, matches ) {
            var idx,
              matched = fn( seed, argument ),
              i = matched.length;
            while ( i-- ) {
              idx = indexOf.call( seed, matched[i] );
              seed[ idx ] = !( matches[ idx ] = matched[i] );
            }
          }) :
          function( elem ) {
            return fn( elem, 0, args );
          };
      }

      return fn;
    }
  },

  pseudos: {
    "not": markFunction(function( selector ) {
      // Trim the selector passed to compile
      // to avoid treating leading and trailing
      // spaces as combinators
      var input = [],
        results = [],
        matcher = compile( selector.replace( rtrim, "$1" ) );

      return matcher[ expando ] ?
        markFunction(function( seed, matches, context, xml ) {
          var elem,
            unmatched = matcher( seed, null, xml, [] ),
            i = seed.length;

          // Match elements unmatched by `matcher`
          while ( i-- ) {
            if ( (elem = unmatched[i]) ) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) :
        function( elem, context, xml ) {
          input[0] = elem;
          matcher( input, null, xml, results );
          return !results.pop();
        };
    }),

    "has": markFunction(function( selector ) {
      return function( elem ) {
        return Sizzle( selector, elem ).length > 0;
      };
    }),

    "contains": markFunction(function( text ) {
      return function( elem ) {
        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
      };
    }),

    "enabled": function( elem ) {
      return elem.disabled === false;
    },

    "disabled": function( elem ) {
      return elem.disabled === true;
    },

    "checked": function( elem ) {
      // In CSS3, :checked should return both checked and selected elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      var nodeName = elem.nodeName.toLowerCase();
      return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
    },

    "selected": function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }

      return elem.selected === true;
    },

    "parent": function( elem ) {
      return !Expr.pseudos["empty"]( elem );
    },

    "empty": function( elem ) {
      // http://www.w3.org/TR/selectors/#empty-pseudo
      // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
      //   not comment, processing instructions, or others
      // Thanks to Diego Perini for the nodeName shortcut
      //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
      var nodeType;
      elem = elem.firstChild;
      while ( elem ) {
        if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
          return false;
        }
        elem = elem.nextSibling;
      }
      return true;
    },

    "header": function( elem ) {
      return rheader.test( elem.nodeName );
    },

    "text": function( elem ) {
      var type, attr;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" &&
        (type = elem.type) === "text" &&
        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
    },

    // Input types
    "radio": createInputPseudo("radio"),
    "checkbox": createInputPseudo("checkbox"),
    "file": createInputPseudo("file"),
    "password": createInputPseudo("password"),
    "image": createInputPseudo("image"),

    "submit": createButtonPseudo("submit"),
    "reset": createButtonPseudo("reset"),

    "button": function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && elem.type === "button" || name === "button";
    },

    "input": function( elem ) {
      return rinputs.test( elem.nodeName );
    },

    "focus": function( elem ) {
      var doc = elem.ownerDocument;
      return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
    },

    "active": function( elem ) {
      return elem === elem.ownerDocument.activeElement;
    },

    // Positional types
    "first": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ 0 ];
    }),

    "last": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ length - 1 ];
    }),

    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ argument < 0 ? argument + length : argument ];
    }),

    "even": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = 0; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = 1; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    })
  }
};

function siblingCheck( a, b, ret ) {
  if ( a === b ) {
    return ret;
  }

  var cur = a.nextSibling;

  while ( cur ) {
    if ( cur === b ) {
      return -1;
    }

    cur = cur.nextSibling;
  }

  return 1;
}

sortOrder = docElem.compareDocumentPosition ?
  function( a, b ) {
    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
      a.compareDocumentPosition :
      a.compareDocumentPosition(b) & 4
    ) ? -1 : 1;
  } :
  function( a, b ) {
    // The nodes are identical, we can exit early
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Fallback to using sourceIndex (in IE) if it's available on both nodes
    } else if ( a.sourceIndex && b.sourceIndex ) {
      return a.sourceIndex - b.sourceIndex;
    }

    var al, bl,
      ap = [],
      bp = [],
      aup = a.parentNode,
      bup = b.parentNode,
      cur = aup;

    // If the nodes are siblings (or identical) we can do a quick check
    if ( aup === bup ) {
      return siblingCheck( a, b );

    // If no parents were found then the nodes are disconnected
    } else if ( !aup ) {
      return -1;

    } else if ( !bup ) {
      return 1;
    }

    // Otherwise they're somewhere else in the tree so we need
    // to build up a full list of the parentNodes for comparison
    while ( cur ) {
      ap.unshift( cur );
      cur = cur.parentNode;
    }

    cur = bup;

    while ( cur ) {
      bp.unshift( cur );
      cur = cur.parentNode;
    }

    al = ap.length;
    bl = bp.length;

    // Start walking down the tree looking for a discrepancy
    for ( var i = 0; i < al && i < bl; i++ ) {
      if ( ap[i] !== bp[i] ) {
        return siblingCheck( ap[i], bp[i] );
      }
    }

    // We ended someplace up the tree so do a sibling check
    return i === al ?
      siblingCheck( a, bp[i], -1 ) :
      siblingCheck( ap[i], b, 1 );
  };

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
  var elem,
    i = 1;

  hasDuplicate = baseHasDuplicate;
  results.sort( sortOrder );

  if ( hasDuplicate ) {
    for ( ; (elem = results[i]); i++ ) {
      if ( elem === results[ i - 1 ] ) {
        results.splice( i--, 1 );
      }
    }
  }

  return results;
};

Sizzle.error = function( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
  var matched, match, tokens, type, soFar, groups, preFilters,
    cached = tokenCache[ expando ][ selector ];

  if ( cached ) {
    return parseOnly ? 0 : cached.slice( 0 );
  }

  soFar = selector;
  groups = [];
  preFilters = Expr.preFilter;

  while ( soFar ) {

    // Comma and first run
    if ( !matched || (match = rcomma.exec( soFar )) ) {
      if ( match ) {
        soFar = soFar.slice( match[0].length );
      }
      groups.push( tokens = [] );
    }

    matched = false;

    // Combinators
    if ( (match = rcombinators.exec( soFar )) ) {
      tokens.push( matched = new Token( match.shift() ) );
      soFar = soFar.slice( matched.length );

      // Cast descendant combinators to space
      matched.type = match[0].replace( rtrim, " " );
    }

    // Filters
    for ( type in Expr.filter ) {
      if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
        // The last two arguments here are (context, xml) for backCompat
        (match = preFilters[ type ]( match, document, true ))) ) {

        tokens.push( matched = new Token( match.shift() ) );
        soFar = soFar.slice( matched.length );
        matched.type = type;
        matched.matches = match;
      }
    }

    if ( !matched ) {
      break;
    }
  }

  // Return the length of the invalid excess
  // if we're just parsing
  // Otherwise, throw an error or return tokens
  return parseOnly ?
    soFar.length :
    soFar ?
      Sizzle.error( selector ) :
      // Cache the tokens
      tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
  var dir = combinator.dir,
    checkNonElements = base && combinator.dir === "parentNode",
    doneName = done++;

  return combinator.first ?
    // Check against closest ancestor/preceding element
    function( elem, context, xml ) {
      while ( (elem = elem[ dir ]) ) {
        if ( checkNonElements || elem.nodeType === 1  ) {
          return matcher( elem, context, xml );
        }
      }
    } :

    // Check against all ancestor/preceding elements
    function( elem, context, xml ) {
      // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
      if ( !xml ) {
        var cache,
          dirkey = dirruns + " " + doneName + " ",
          cachedkey = dirkey + cachedruns;
        while ( (elem = elem[ dir ]) ) {
          if ( checkNonElements || elem.nodeType === 1 ) {
            if ( (cache = elem[ expando ]) === cachedkey ) {
              return elem.sizset;
            } else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
              if ( elem.sizset ) {
                return elem;
              }
            } else {
              elem[ expando ] = cachedkey;
              if ( matcher( elem, context, xml ) ) {
                elem.sizset = true;
                return elem;
              }
              elem.sizset = false;
            }
          }
        }
      } else {
        while ( (elem = elem[ dir ]) ) {
          if ( checkNonElements || elem.nodeType === 1 ) {
            if ( matcher( elem, context, xml ) ) {
              return elem;
            }
          }
        }
      }
    };
}

function elementMatcher( matchers ) {
  return matchers.length > 1 ?
    function( elem, context, xml ) {
      var i = matchers.length;
      while ( i-- ) {
        if ( !matchers[i]( elem, context, xml ) ) {
          return false;
        }
      }
      return true;
    } :
    matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
  var elem,
    newUnmatched = [],
    i = 0,
    len = unmatched.length,
    mapped = map != null;

  for ( ; i < len; i++ ) {
    if ( (elem = unmatched[i]) ) {
      if ( !filter || filter( elem, context, xml ) ) {
        newUnmatched.push( elem );
        if ( mapped ) {
          map.push( i );
        }
      }
    }
  }

  return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
  if ( postFilter && !postFilter[ expando ] ) {
    postFilter = setMatcher( postFilter );
  }
  if ( postFinder && !postFinder[ expando ] ) {
    postFinder = setMatcher( postFinder, postSelector );
  }
  return markFunction(function( seed, results, context, xml ) {
    // Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
    if ( seed && postFinder ) {
      return;
    }

    var i, elem, postFilterIn,
      preMap = [],
      postMap = [],
      preexisting = results.length,

      // Get initial elements from seed or context
      elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

      // Prefilter to get matcher input, preserving a map for seed-results synchronization
      matcherIn = preFilter && ( seed || !selector ) ?
        condense( elems, preMap, preFilter, context, xml ) :
        elems,

      matcherOut = matcher ?
        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

          // ...intermediate processing is necessary
          [] :

          // ...otherwise use results directly
          results :
        matcherIn;

    // Find primary matches
    if ( matcher ) {
      matcher( matcherIn, matcherOut, context, xml );
    }

    // Apply postFilter
    if ( postFilter ) {
      postFilterIn = condense( matcherOut, postMap );
      postFilter( postFilterIn, [], context, xml );

      // Un-match failing elements by moving them back to matcherIn
      i = postFilterIn.length;
      while ( i-- ) {
        if ( (elem = postFilterIn[i]) ) {
          matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
        }
      }
    }

    // Keep seed and results synchronized
    if ( seed ) {
      // Ignore postFinder because it can't coexist with seed
      i = preFilter && matcherOut.length;
      while ( i-- ) {
        if ( (elem = matcherOut[i]) ) {
          seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
        }
      }
    } else {
      matcherOut = condense(
        matcherOut === results ?
          matcherOut.splice( preexisting, matcherOut.length ) :
          matcherOut
      );
      if ( postFinder ) {
        postFinder( null, results, matcherOut, xml );
      } else {
        push.apply( results, matcherOut );
      }
    }
  });
}

function matcherFromTokens( tokens ) {
  var checkContext, matcher, j,
    len = tokens.length,
    leadingRelative = Expr.relative[ tokens[0].type ],
    implicitRelative = leadingRelative || Expr.relative[" "],
    i = leadingRelative ? 1 : 0,

    // The foundational matcher ensures that elements are reachable from top-level context(s)
    matchContext = addCombinator( function( elem ) {
      return elem === checkContext;
    }, implicitRelative, true ),
    matchAnyContext = addCombinator( function( elem ) {
      return indexOf.call( checkContext, elem ) > -1;
    }, implicitRelative, true ),
    matchers = [ function( elem, context, xml ) {
      return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
        (checkContext = context).nodeType ?
          matchContext( elem, context, xml ) :
          matchAnyContext( elem, context, xml ) );
    } ];

  for ( ; i < len; i++ ) {
    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
      matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
    } else {
      // The concatenated values are (context, xml) for backCompat
      matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

      // Return special upon seeing a positional matcher
      if ( matcher[ expando ] ) {
        // Find the next relative operator (if any) for proper handling
        j = ++i;
        for ( ; j < len; j++ ) {
          if ( Expr.relative[ tokens[j].type ] ) {
            break;
          }
        }
        return setMatcher(
          i > 1 && elementMatcher( matchers ),
          i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
          matcher,
          i < j && matcherFromTokens( tokens.slice( i, j ) ),
          j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
          j < len && tokens.join("")
        );
      }
      matchers.push( matcher );
    }
  }

  return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
  var bySet = setMatchers.length > 0,
    byElement = elementMatchers.length > 0,
    superMatcher = function( seed, context, xml, results, expandContext ) {
      var elem, j, matcher,
        setMatched = [],
        matchedCount = 0,
        i = "0",
        unmatched = seed && [],
        outermost = expandContext != null,
        contextBackup = outermostContext,
        // We must always have either seed elements or context
        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
        // Nested matchers should use non-integer dirruns
        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

      if ( outermost ) {
        outermostContext = context !== document && context;
        cachedruns = superMatcher.el;
      }

      // Add elements passing elementMatchers directly to results
      for ( ; (elem = elems[i]) != null; i++ ) {
        if ( byElement && elem ) {
          for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
            if ( matcher( elem, context, xml ) ) {
              results.push( elem );
              break;
            }
          }
          if ( outermost ) {
            dirruns = dirrunsUnique;
            cachedruns = ++superMatcher.el;
          }
        }

        // Track unmatched elements for set filters
        if ( bySet ) {
          // They will have gone through all possible matchers
          if ( (elem = !matcher && elem) ) {
            matchedCount--;
          }

          // Lengthen the array for every element, matched or not
          if ( seed ) {
            unmatched.push( elem );
          }
        }
      }

      // Apply set filters to unmatched elements
      matchedCount += i;
      if ( bySet && i !== matchedCount ) {
        for ( j = 0; (matcher = setMatchers[j]); j++ ) {
          matcher( unmatched, setMatched, context, xml );
        }

        if ( seed ) {
          // Reintegrate element matches to eliminate the need for sorting
          if ( matchedCount > 0 ) {
            while ( i-- ) {
              if ( !(unmatched[i] || setMatched[i]) ) {
                setMatched[i] = pop.call( results );
              }
            }
          }

          // Discard index placeholder values to get only actual matches
          setMatched = condense( setMatched );
        }

        // Add matches to results
        push.apply( results, setMatched );

        // Seedless set matches succeeding multiple successful matchers stipulate sorting
        if ( outermost && !seed && setMatched.length > 0 &&
          ( matchedCount + setMatchers.length ) > 1 ) {

          Sizzle.uniqueSort( results );
        }
      }

      // Override manipulation of globals by nested matchers
      if ( outermost ) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }

      return unmatched;
    };

  superMatcher.el = 0;
  return bySet ?
    markFunction( superMatcher ) :
    superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
  var i,
    setMatchers = [],
    elementMatchers = [],
    cached = compilerCache[ expando ][ selector ];

  if ( !cached ) {
    // Generate a function of recursive functions that can be used to check each element
    if ( !group ) {
      group = tokenize( selector );
    }
    i = group.length;
    while ( i-- ) {
      cached = matcherFromTokens( group[i] );
      if ( cached[ expando ] ) {
        setMatchers.push( cached );
      } else {
        elementMatchers.push( cached );
      }
    }

    // Cache the compiled function
    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
  }
  return cached;
};

function multipleContexts( selector, contexts, results, seed ) {
  var i = 0,
    len = contexts.length;
  for ( ; i < len; i++ ) {
    Sizzle( selector, contexts[i], results, seed );
  }
  return results;
}

function select( selector, context, results, seed, xml ) {
  var i, tokens, token, type, find,
    match = tokenize( selector ),
    j = match.length;

  if ( !seed ) {
    // Try to minimize operations if there is only one group
    if ( match.length === 1 ) {

      // Take a shortcut and set the context if the root selector is an ID
      tokens = match[0] = match[0].slice( 0 );
      if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
          context.nodeType === 9 && !xml &&
          Expr.relative[ tokens[1].type ] ) {

        context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
        if ( !context ) {
          return results;
        }

        selector = selector.slice( tokens.shift().length );
      }

      // Fetch a seed set for right-to-left matching
      for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
        token = tokens[i];

        // Abort if we hit a combinator
        if ( Expr.relative[ (type = token.type) ] ) {
          break;
        }
        if ( (find = Expr.find[ type ]) ) {
          // Search, expanding context for leading sibling combinators
          if ( (seed = find(
            token.matches[0].replace( rbackslash, "" ),
            rsibling.test( tokens[0].type ) && context.parentNode || context,
            xml
          )) ) {

            // If seed is empty or no tokens remain, we can return early
            tokens.splice( i, 1 );
            selector = seed.length && tokens.join("");
            if ( !selector ) {
              push.apply( results, slice.call( seed, 0 ) );
              return results;
            }

            break;
          }
        }
      }
    }
  }

  // Compile and execute a filtering function
  // Provide `match` to avoid retokenization if we modified the selector above
  compile( selector, match )(
    seed,
    context,
    xml,
    results,
    rsibling.test( selector )
  );
  return results;
}

if ( document.querySelectorAll ) {
  (function() {
    var disconnectedMatch,
      oldSelect = select,
      rescape = /'|\\/g,
      rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

      // qSa(:focus) reports false when true (Chrome 21),
      // A support test would require too much code (would include document ready)
      rbuggyQSA = [":focus"],

      // matchesSelector(:focus) reports false when true (Chrome 21),
      // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
      // A support test would require too much code (would include document ready)
      // just skip matchesSelector for :active
      rbuggyMatches = [ ":active", ":focus" ],
      matches = docElem.matchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.webkitMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector;

    // Build QSA regex
    // Regex strategy adopted from Diego Perini
    assert(function( div ) {
      // Select is set to empty string on purpose
      // This is to test IE's treatment of not explictly
      // setting a boolean content attribute,
      // since its presence should be enough
      // http://bugs.jquery.com/ticket/12359
      div.innerHTML = "<select><option selected=''></option></select>";

      // IE8 - Some boolean attributes are not treated correctly
      if ( !div.querySelectorAll("[selected]").length ) {
        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
      }

      // Webkit/Opera - :checked should return selected option elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      // IE8 throws error here (do not put tests after this one)
      if ( !div.querySelectorAll(":checked").length ) {
        rbuggyQSA.push(":checked");
      }
    });

    assert(function( div ) {

      // Opera 10-12/IE9 - ^= $= *= and empty values
      // Should not select anything
      div.innerHTML = "<p test=''></p>";
      if ( div.querySelectorAll("[test^='']").length ) {
        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
      }

      // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
      // IE8 throws error here (do not put tests after this one)
      div.innerHTML = "<input type='hidden'/>";
      if ( !div.querySelectorAll(":enabled").length ) {
        rbuggyQSA.push(":enabled", ":disabled");
      }
    });

    // rbuggyQSA always contains :focus, so no need for a length check
    rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

    select = function( selector, context, results, seed, xml ) {
      // Only use querySelectorAll when not filtering,
      // when this is not xml,
      // and when no QSA bugs apply
      if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
        var groups, i,
          old = true,
          nid = expando,
          newContext = context,
          newSelector = context.nodeType === 9 && selector;

        // qSA works strangely on Element-rooted queries
        // We can work around this by specifying an extra ID on the root
        // and working up from there (Thanks to Andrew Dupont for the technique)
        // IE 8 doesn't work on object elements
        if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
          groups = tokenize( selector );

          if ( (old = context.getAttribute("id")) ) {
            nid = old.replace( rescape, "\\$&" );
          } else {
            context.setAttribute( "id", nid );
          }
          nid = "[id='" + nid + "'] ";

          i = groups.length;
          while ( i-- ) {
            groups[i] = nid + groups[i].join("");
          }
          newContext = rsibling.test( selector ) && context.parentNode || context;
          newSelector = groups.join(",");
        }

        if ( newSelector ) {
          try {
            push.apply( results, slice.call( newContext.querySelectorAll(
              newSelector
            ), 0 ) );
            return results;
          } catch(qsaError) {
          } finally {
            if ( !old ) {
              context.removeAttribute("id");
            }
          }
        }
      }

      return oldSelect( selector, context, results, seed, xml );
    };

    if ( matches ) {
      assert(function( div ) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9)
        disconnectedMatch = matches.call( div, "div" );

        // This should fail with an exception
        // Gecko does not error, returns false instead
        try {
          matches.call( div, "[test!='']:sizzle" );
          rbuggyMatches.push( "!=", pseudos );
        } catch ( e ) {}
      });

      // rbuggyMatches always contains :active and :focus, so no need for a length check
      rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

      Sizzle.matchesSelector = function( elem, expr ) {
        // Make sure that attribute selectors are quoted
        expr = expr.replace( rattributeQuotes, "='$1']" );

        // rbuggyMatches always contains :active, so no need for an existence check
        if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
          try {
            var ret = matches.call( elem, expr );

            // IE 9's matchesSelector returns false on disconnected nodes
            if ( ret || disconnectedMatch ||
                // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && elem.document.nodeType !== 11 ) {
              return ret;
            }
          } catch(e) {}
        }

        return Sizzle( expr, null, null, [ elem ] ).length > 0;
      };
    }
  })();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
  rparentsprev = /^(?:parents|prev(?:Until|All))/,
  isSimple = /^.[^:#\[\.,]*$/,
  rneedsContext = jQuery.expr.match.needsContext,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

jQuery.fn.extend({
  find: function( selector ) {
    var i, l, length, n, r, ret,
      self = this;

    if ( typeof selector !== "string" ) {
      return jQuery( selector ).filter(function() {
        for ( i = 0, l = self.length; i < l; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      });
    }

    ret = this.pushStack( "", "find", selector );

    for ( i = 0, l = this.length; i < l; i++ ) {
      length = ret.length;
      jQuery.find( selector, this[i], ret );

      if ( i > 0 ) {
        // Make sure that the results are unique
        for ( n = length; n < ret.length; n++ ) {
          for ( r = 0; r < length; r++ ) {
            if ( ret[r] === ret[n] ) {
              ret.splice(n--, 1);
              break;
            }
          }
        }
      }
    }

    return ret;
  },

  has: function( target ) {
    var i,
      targets = jQuery( target, this ),
      len = targets.length;

    return this.filter(function() {
      for ( i = 0; i < len; i++ ) {
        if ( jQuery.contains( this, targets[i] ) ) {
          return true;
        }
      }
    });
  },

  not: function( selector ) {
    return this.pushStack( winnow(this, selector, false), "not", selector);
  },

  filter: function( selector ) {
    return this.pushStack( winnow(this, selector, true), "filter", selector );
  },

  is: function( selector ) {
    return !!selector && (
      typeof selector === "string" ?
        // If this is a positional/relative selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        rneedsContext.test( selector ) ?
          jQuery( selector, this.context ).index( this[0] ) >= 0 :
          jQuery.filter( selector, this ).length > 0 :
        this.filter( selector ).length > 0 );
  },

  closest: function( selectors, context ) {
    var cur,
      i = 0,
      l = this.length,
      ret = [],
      pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

    for ( ; i < l; i++ ) {
      cur = this[i];

      while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
        if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
          ret.push( cur );
          break;
        }
        cur = cur.parentNode;
      }
    }

    ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

    return this.pushStack( ret, "closest", selectors );
  },

  // Determine the position of an element within
  // the matched set of elements
  index: function( elem ) {

    // No argument, return index in parent
    if ( !elem ) {
      return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
    }

    // index in selector
    if ( typeof elem === "string" ) {
      return jQuery.inArray( this[0], jQuery( elem ) );
    }

    // Locate the position of the desired element
    return jQuery.inArray(
      // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this );
  },

  add: function( selector, context ) {
    var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      all = jQuery.merge( this.get(), set );

    return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
      all :
      jQuery.unique( all ) );
  },

  addBack: function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter(selector)
    );
  }
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
  return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
  do {
    cur = cur[ dir ];
  } while ( cur && cur.nodeType !== 1 );

  return cur;
}

jQuery.each({
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elem ) {
    return jQuery.dir( elem, "parentNode" );
  },
  parentsUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "parentNode", until );
  },
  next: function( elem ) {
    return sibling( elem, "nextSibling" );
  },
  prev: function( elem ) {
    return sibling( elem, "previousSibling" );
  },
  nextAll: function( elem ) {
    return jQuery.dir( elem, "nextSibling" );
  },
  prevAll: function( elem ) {
    return jQuery.dir( elem, "previousSibling" );
  },
  nextUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "nextSibling", until );
  },
  prevUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "previousSibling", until );
  },
  siblings: function( elem ) {
    return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
  },
  children: function( elem ) {
    return jQuery.sibling( elem.firstChild );
  },
  contents: function( elem ) {
    return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      jQuery.merge( [], elem.childNodes );
  }
}, function( name, fn ) {
  jQuery.fn[ name ] = function( until, selector ) {
    var ret = jQuery.map( this, fn, until );

    if ( !runtil.test( name ) ) {
      selector = until;
    }

    if ( selector && typeof selector === "string" ) {
      ret = jQuery.filter( selector, ret );
    }

    ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

    if ( this.length > 1 && rparentsprev.test( name ) ) {
      ret = ret.reverse();
    }

    return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
  };
});

jQuery.extend({
  filter: function( expr, elems, not ) {
    if ( not ) {
      expr = ":not(" + expr + ")";
    }

    return elems.length === 1 ?
      jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
      jQuery.find.matches(expr, elems);
  },

  dir: function( elem, dir, until ) {
    var matched = [],
      cur = elem[ dir ];

    while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
      if ( cur.nodeType === 1 ) {
        matched.push( cur );
      }
      cur = cur[dir];
    }
    return matched;
  },

  sibling: function( n, elem ) {
    var r = [];

    for ( ; n; n = n.nextSibling ) {
      if ( n.nodeType === 1 && n !== elem ) {
        r.push( n );
      }
    }

    return r;
  }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

  // Can't pass null or undefined to indexOf in Firefox 4
  // Set to 0 to skip string check
  qualifier = qualifier || 0;

  if ( jQuery.isFunction( qualifier ) ) {
    return jQuery.grep(elements, function( elem, i ) {
      var retVal = !!qualifier.call( elem, i, elem );
      return retVal === keep;
    });

  } else if ( qualifier.nodeType ) {
    return jQuery.grep(elements, function( elem, i ) {
      return ( elem === qualifier ) === keep;
    });

  } else if ( typeof qualifier === "string" ) {
    var filtered = jQuery.grep(elements, function( elem ) {
      return elem.nodeType === 1;
    });

    if ( isSimple.test( qualifier ) ) {
      return jQuery.filter(qualifier, filtered, !keep);
    } else {
      qualifier = jQuery.filter( qualifier, filtered );
    }
  }

  return jQuery.grep(elements, function( elem, i ) {
    return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
  });
}
function createSafeFragment( document ) {
  var list = nodeNames.split( "|" ),
  safeFrag = document.createDocumentFragment();

  if ( safeFrag.createElement ) {
    while ( list.length ) {
      safeFrag.createElement(
        list.pop()
      );
    }
  }
  return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
  rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
  rleadingWhitespace = /^\s+/,
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
  rtagName = /<([\w:]+)/,
  rtbody = /<tbody/i,
  rhtml = /<|&#?\w+;/,
  rnoInnerhtml = /<(?:script|style|link)/i,
  rnocache = /<(?:script|object|embed|option|style)/i,
  rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
  rcheckableType = /^(?:checkbox|radio)$/,
  // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  rscriptType = /\/(java|ecma)script/i,
  rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
  wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  },
  safeFragment = createSafeFragment( document ),
  fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
  wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
  text: function( value ) {
    return jQuery.access( this, function( value ) {
      return value === undefined ?
        jQuery.text( this ) :
        this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
    }, null, value, arguments.length );
  },

  wrapAll: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapAll( html.call(this, i) );
      });
    }

    if ( this[0] ) {
      // The elements to wrap the target around
      var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

      if ( this[0].parentNode ) {
        wrap.insertBefore( this[0] );
      }

      wrap.map(function() {
        var elem = this;

        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
          elem = elem.firstChild;
        }

        return elem;
      }).append( this );
    }

    return this;
  },

  wrapInner: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapInner( html.call(this, i) );
      });
    }

    return this.each(function() {
      var self = jQuery( this ),
        contents = self.contents();

      if ( contents.length ) {
        contents.wrapAll( html );

      } else {
        self.append( html );
      }
    });
  },

  wrap: function( html ) {
    var isFunction = jQuery.isFunction( html );

    return this.each(function(i) {
      jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
    });
  },

  unwrap: function() {
    return this.parent().each(function() {
      if ( !jQuery.nodeName( this, "body" ) ) {
        jQuery( this ).replaceWith( this.childNodes );
      }
    }).end();
  },

  append: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 ) {
        this.appendChild( elem );
      }
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 ) {
        this.insertBefore( elem, this.firstChild );
      }
    });
  },

  before: function() {
    if ( !isDisconnected( this[0] ) ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this );
      });
    }

    if ( arguments.length ) {
      var set = jQuery.clean( arguments );
      return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
    }
  },

  after: function() {
    if ( !isDisconnected( this[0] ) ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this.nextSibling );
      });
    }

    if ( arguments.length ) {
      var set = jQuery.clean( arguments );
      return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
    }
  },

  // keepData is for internal use only--do not document
  remove: function( selector, keepData ) {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( elem.getElementsByTagName("*") );
          jQuery.cleanData( [ elem ] );
        }

        if ( elem.parentNode ) {
          elem.parentNode.removeChild( elem );
        }
      }
    }

    return this;
  },

  empty: function() {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      // Remove element nodes and prevent memory leaks
      if ( elem.nodeType === 1 ) {
        jQuery.cleanData( elem.getElementsByTagName("*") );
      }

      // Remove any remaining nodes
      while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
      }
    }

    return this;
  },

  clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function () {
      return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    });
  },

  html: function( value ) {
    return jQuery.access( this, function( value ) {
      var elem = this[0] || {},
        i = 0,
        l = this.length;

      if ( value === undefined ) {
        return elem.nodeType === 1 ?
          elem.innerHTML.replace( rinlinejQuery, "" ) :
          undefined;
      }

      // See if we can take a shortcut and just use innerHTML
      if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
        ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
        ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
        !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

        value = value.replace( rxhtmlTag, "<$1></$2>" );

        try {
          for (; i < l; i++ ) {
            // Remove element nodes and prevent memory leaks
            elem = this[i] || {};
            if ( elem.nodeType === 1 ) {
              jQuery.cleanData( elem.getElementsByTagName( "*" ) );
              elem.innerHTML = value;
            }
          }

          elem = 0;

        // If using innerHTML throws an exception, use the fallback method
        } catch(e) {}
      }

      if ( elem ) {
        this.empty().append( value );
      }
    }, null, value, arguments.length );
  },

  replaceWith: function( value ) {
    if ( !isDisconnected( this[0] ) ) {
      // Make sure that the elements are removed from the DOM before they are inserted
      // this can help fix replacing a parent with child elements
      if ( jQuery.isFunction( value ) ) {
        return this.each(function(i) {
          var self = jQuery(this), old = self.html();
          self.replaceWith( value.call( this, i, old ) );
        });
      }

      if ( typeof value !== "string" ) {
        value = jQuery( value ).detach();
      }

      return this.each(function() {
        var next = this.nextSibling,
          parent = this.parentNode;

        jQuery( this ).remove();

        if ( next ) {
          jQuery(next).before( value );
        } else {
          jQuery(parent).append( value );
        }
      });
    }

    return this.length ?
      this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
      this;
  },

  detach: function( selector ) {
    return this.remove( selector, true );
  },

  domManip: function( args, table, callback ) {

    // Flatten any nested arrays
    args = [].concat.apply( [], args );

    var results, first, fragment, iNoClone,
      i = 0,
      value = args[0],
      scripts = [],
      l = this.length;

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
      return this.each(function() {
        jQuery(this).domManip( args, table, callback );
      });
    }

    if ( jQuery.isFunction(value) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        args[0] = value.call( this, i, table ? self.html() : undefined );
        self.domManip( args, table, callback );
      });
    }

    if ( this[0] ) {
      results = jQuery.buildFragment( args, this, scripts );
      fragment = results.fragment;
      first = fragment.firstChild;

      if ( fragment.childNodes.length === 1 ) {
        fragment = first;
      }

      if ( first ) {
        table = table && jQuery.nodeName( first, "tr" );

        // Use the original fragment for the last item instead of the first because it can end up
        // being emptied incorrectly in certain situations (#8070).
        // Fragments from the fragment cache must always be cloned and never used in place.
        for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
          callback.call(
            table && jQuery.nodeName( this[i], "table" ) ?
              findOrAppend( this[i], "tbody" ) :
              this[i],
            i === iNoClone ?
              fragment :
              jQuery.clone( fragment, true, true )
          );
        }
      }

      // Fix #11809: Avoid leaking memory
      fragment = first = null;

      if ( scripts.length ) {
        jQuery.each( scripts, function( i, elem ) {
          if ( elem.src ) {
            if ( jQuery.ajax ) {
              jQuery.ajax({
                url: elem.src,
                type: "GET",
                dataType: "script",
                async: false,
                global: false,
                "throws": true
              });
            } else {
              jQuery.error("no ajax");
            }
          } else {
            jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
          }

          if ( elem.parentNode ) {
            elem.parentNode.removeChild( elem );
          }
        });
      }
    }

    return this;
  }
});

function findOrAppend( elem, tag ) {
  return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

  if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
    return;
  }

  var type, i, l,
    oldData = jQuery._data( src ),
    curData = jQuery._data( dest, oldData ),
    events = oldData.events;

  if ( events ) {
    delete curData.handle;
    curData.events = {};

    for ( type in events ) {
      for ( i = 0, l = events[ type ].length; i < l; i++ ) {
        jQuery.event.add( dest, type, events[ type ][ i ] );
      }
    }
  }

  // make the cloned public data object a copy from the original
  if ( curData.data ) {
    curData.data = jQuery.extend( {}, curData.data );
  }
}

function cloneFixAttributes( src, dest ) {
  var nodeName;

  // We do not need to do anything for non-Elements
  if ( dest.nodeType !== 1 ) {
    return;
  }

  // clearAttributes removes the attributes, which we don't want,
  // but also removes the attachEvent events, which we *do* want
  if ( dest.clearAttributes ) {
    dest.clearAttributes();
  }

  // mergeAttributes, in contrast, only merges back on the
  // original attributes, not the events
  if ( dest.mergeAttributes ) {
    dest.mergeAttributes( src );
  }

  nodeName = dest.nodeName.toLowerCase();

  if ( nodeName === "object" ) {
    // IE6-10 improperly clones children of object elements using classid.
    // IE10 throws NoModificationAllowedError if parent is null, #12132.
    if ( dest.parentNode ) {
      dest.outerHTML = src.outerHTML;
    }

    // This path appears unavoidable for IE9. When cloning an object
    // element in IE9, the outerHTML strategy above is not sufficient.
    // If the src has innerHTML and the destination does not,
    // copy the src.innerHTML into the dest.innerHTML. #10324
    if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
      dest.innerHTML = src.innerHTML;
    }

  } else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    // IE6-8 fails to persist the checked state of a cloned checkbox
    // or radio button. Worse, IE6-7 fail to give the cloned element
    // a checked appearance if the defaultChecked value isn't also set

    dest.defaultChecked = dest.checked = src.checked;

    // IE6-7 get confused and end up setting the value of a cloned
    // checkbox/radio button to an empty string instead of "on"
    if ( dest.value !== src.value ) {
      dest.value = src.value;
    }

  // IE6-8 fails to return the selected option to the default selected
  // state when cloning options
  } else if ( nodeName === "option" ) {
    dest.selected = src.defaultSelected;

  // IE6-8 fails to set the defaultValue to the correct value when
  // cloning other types of input fields
  } else if ( nodeName === "input" || nodeName === "textarea" ) {
    dest.defaultValue = src.defaultValue;

  // IE blanks contents when cloning scripts
  } else if ( nodeName === "script" && dest.text !== src.text ) {
    dest.text = src.text;
  }

  // Event data gets referenced instead of copied if the expando
  // gets copied too
  dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
  var fragment, cacheable, cachehit,
    first = args[ 0 ];

  // Set context from what may come in as undefined or a jQuery collection or a node
  // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
  // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
  context = context || document;
  context = !context.nodeType && context[0] || context;
  context = context.ownerDocument || context;

  // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
  // Cloning options loses the selected state, so don't cache them
  // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
  // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
  // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
  if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
    first.charAt(0) === "<" && !rnocache.test( first ) &&
    (jQuery.support.checkClone || !rchecked.test( first )) &&
    (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

    // Mark cacheable and look for a hit
    cacheable = true;
    fragment = jQuery.fragments[ first ];
    cachehit = fragment !== undefined;
  }

  if ( !fragment ) {
    fragment = context.createDocumentFragment();
    jQuery.clean( args, context, fragment, scripts );

    // Update the cache, but only store false
    // unless this is a second parsing of the same content
    if ( cacheable ) {
      jQuery.fragments[ first ] = cachehit && fragment;
    }
  }

  return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
  appendTo: "append",
  prependTo: "prepend",
  insertBefore: "before",
  insertAfter: "after",
  replaceAll: "replaceWith"
}, function( name, original ) {
  jQuery.fn[ name ] = function( selector ) {
    var elems,
      i = 0,
      ret = [],
      insert = jQuery( selector ),
      l = insert.length,
      parent = this.length === 1 && this[0].parentNode;

    if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
      insert[ original ]( this[0] );
      return this;
    } else {
      for ( ; i < l; i++ ) {
        elems = ( i > 0 ? this.clone(true) : this ).get();
        jQuery( insert[i] )[ original ]( elems );
        ret = ret.concat( elems );
      }

      return this.pushStack( ret, name, insert.selector );
    }
  };
});

function getAll( elem ) {
  if ( typeof elem.getElementsByTagName !== "undefined" ) {
    return elem.getElementsByTagName( "*" );

  } else if ( typeof elem.querySelectorAll !== "undefined" ) {
    return elem.querySelectorAll( "*" );

  } else {
    return [];
  }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
  if ( rcheckableType.test( elem.type ) ) {
    elem.defaultChecked = elem.checked;
  }
}

jQuery.extend({
  clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    var srcElements,
      destElements,
      i,
      clone;

    if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
      clone = elem.cloneNode( true );

    // IE<=8 does not properly clone detached, unknown element nodes
    } else {
      fragmentDiv.innerHTML = elem.outerHTML;
      fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
    }

    if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
      // IE copies events bound via attachEvent when using cloneNode.
      // Calling detachEvent on the clone will also remove the events
      // from the original. In order to get around this, we use some
      // proprietary methods to clear the events. Thanks to MooTools
      // guys for this hotness.

      cloneFixAttributes( elem, clone );

      // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
      srcElements = getAll( elem );
      destElements = getAll( clone );

      // Weird iteration because IE will replace the length property
      // with an element if you are cloning the body and one of the
      // elements on the page has a name or id of "length"
      for ( i = 0; srcElements[i]; ++i ) {
        // Ensure that the destination node is not null; Fixes #9587
        if ( destElements[i] ) {
          cloneFixAttributes( srcElements[i], destElements[i] );
        }
      }
    }

    // Copy the events from the original to the clone
    if ( dataAndEvents ) {
      cloneCopyEvent( elem, clone );

      if ( deepDataAndEvents ) {
        srcElements = getAll( elem );
        destElements = getAll( clone );

        for ( i = 0; srcElements[i]; ++i ) {
          cloneCopyEvent( srcElements[i], destElements[i] );
        }
      }
    }

    srcElements = destElements = null;

    // Return the cloned set
    return clone;
  },

  clean: function( elems, context, fragment, scripts ) {
    var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
      safe = context === document && safeFragment,
      ret = [];

    // Ensure that context is a document
    if ( !context || typeof context.createDocumentFragment === "undefined" ) {
      context = document;
    }

    // Use the already-created safe fragment if context permits
    for ( i = 0; (elem = elems[i]) != null; i++ ) {
      if ( typeof elem === "number" ) {
        elem += "";
      }

      if ( !elem ) {
        continue;
      }

      // Convert html string into DOM nodes
      if ( typeof elem === "string" ) {
        if ( !rhtml.test( elem ) ) {
          elem = context.createTextNode( elem );
        } else {
          // Ensure a safe container in which to render the html
          safe = safe || createSafeFragment( context );
          div = context.createElement("div");
          safe.appendChild( div );

          // Fix "XHTML"-style tags in all browsers
          elem = elem.replace(rxhtmlTag, "<$1></$2>");

          // Go to html and back, then peel off extra wrappers
          tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
          wrap = wrapMap[ tag ] || wrapMap._default;
          depth = wrap[0];
          div.innerHTML = wrap[1] + elem + wrap[2];

          // Move to the right depth
          while ( depth-- ) {
            div = div.lastChild;
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if ( !jQuery.support.tbody ) {

            // String was a <table>, *may* have spurious <tbody>
            hasBody = rtbody.test(elem);
              tbody = tag === "table" && !hasBody ?
                div.firstChild && div.firstChild.childNodes :

                // String was a bare <thead> or <tfoot>
                wrap[1] === "<table>" && !hasBody ?
                  div.childNodes :
                  [];

            for ( j = tbody.length - 1; j >= 0 ; --j ) {
              if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                tbody[ j ].parentNode.removeChild( tbody[ j ] );
              }
            }
          }

          // IE completely kills leading whitespace when innerHTML is used
          if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
            div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
          }

          elem = div.childNodes;

          // Take out of fragment container (we need a fresh div each time)
          div.parentNode.removeChild( div );
        }
      }

      if ( elem.nodeType ) {
        ret.push( elem );
      } else {
        jQuery.merge( ret, elem );
      }
    }

    // Fix #11356: Clear elements from safeFragment
    if ( div ) {
      elem = div = safe = null;
    }

    // Reset defaultChecked for any radios and checkboxes
    // about to be appended to the DOM in IE 6/7 (#8060)
    if ( !jQuery.support.appendChecked ) {
      for ( i = 0; (elem = ret[i]) != null; i++ ) {
        if ( jQuery.nodeName( elem, "input" ) ) {
          fixDefaultChecked( elem );
        } else if ( typeof elem.getElementsByTagName !== "undefined" ) {
          jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
        }
      }
    }

    // Append elements to a provided document fragment
    if ( fragment ) {
      // Special handling of each script element
      handleScript = function( elem ) {
        // Check if we consider it executable
        if ( !elem.type || rscriptType.test( elem.type ) ) {
          // Detach the script and store it in the scripts array (if provided) or the fragment
          // Return truthy to indicate that it has been handled
          return scripts ?
            scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
            fragment.appendChild( elem );
        }
      };

      for ( i = 0; (elem = ret[i]) != null; i++ ) {
        // Check if we're done after handling an executable script
        if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
          // Append to fragment and handle embedded scripts
          fragment.appendChild( elem );
          if ( typeof elem.getElementsByTagName !== "undefined" ) {
            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
            jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

            // Splice the scripts into ret after their former ancestor and advance our index beyond them
            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
            i += jsTags.length;
          }
        }
      }
    }

    return ret;
  },

  cleanData: function( elems, /* internal */ acceptData ) {
    var data, id, elem, type,
      i = 0,
      internalKey = jQuery.expando,
      cache = jQuery.cache,
      deleteExpando = jQuery.support.deleteExpando,
      special = jQuery.event.special;

    for ( ; (elem = elems[i]) != null; i++ ) {

      if ( acceptData || jQuery.acceptData( elem ) ) {

        id = elem[ internalKey ];
        data = id && cache[ id ];

        if ( data ) {
          if ( data.events ) {
            for ( type in data.events ) {
              if ( special[ type ] ) {
                jQuery.event.remove( elem, type );

              // This is a shortcut to avoid jQuery.event.remove's overhead
              } else {
                jQuery.removeEvent( elem, type, data.handle );
              }
            }
          }

          // Remove cache only if it was not already removed by jQuery.event.remove
          if ( cache[ id ] ) {

            delete cache[ id ];

            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( deleteExpando ) {
              delete elem[ internalKey ];

            } else if ( elem.removeAttribute ) {
              elem.removeAttribute( internalKey );

            } else {
              elem[ internalKey ] = null;
            }

            jQuery.deletedIds.push( id );
          }
        }
      }
    }
  }
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
  ua = ua.toLowerCase();

  var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
    /(msie) ([\w.]+)/.exec( ua ) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
    [];

  return {
    browser: match[ 1 ] || "",
    version: match[ 2 ] || "0"
  };
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
  browser[ matched.browser ] = true;
  browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
  browser.webkit = true;
} else if ( browser.webkit ) {
  browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
  function jQuerySub( selector, context ) {
    return new jQuerySub.fn.init( selector, context );
  }
  jQuery.extend( true, jQuerySub, this );
  jQuerySub.superclass = this;
  jQuerySub.fn = jQuerySub.prototype = this();
  jQuerySub.fn.constructor = jQuerySub;
  jQuerySub.sub = this.sub;
  jQuerySub.fn.init = function init( selector, context ) {
    if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
      context = jQuerySub( context );
    }

    return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
  };
  jQuerySub.fn.init.prototype = jQuerySub.fn;
  var rootjQuerySub = jQuerySub(document);
  return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
  ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity=([^)]*)/,
  rposition = /^(top|right|bottom|left)$/,
  // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
  // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  rmargin = /^margin/,
  rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
  rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
  rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
  elemdisplay = {},

  cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  cssNormalTransform = {
    letterSpacing: 0,
    fontWeight: 400
  },

  cssExpand = [ "Top", "Right", "Bottom", "Left" ],
  cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

  eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

  // shortcut for names that are not vendor prefixed
  if ( name in style ) {
    return name;
  }

  // check for vendor prefixed names
  var capName = name.charAt(0).toUpperCase() + name.slice(1),
    origName = name,
    i = cssPrefixes.length;

  while ( i-- ) {
    name = cssPrefixes[ i ] + capName;
    if ( name in style ) {
      return name;
    }
  }

  return origName;
}

function isHidden( elem, el ) {
  elem = el || elem;
  return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
  var elem, display,
    values = [],
    index = 0,
    length = elements.length;

  for ( ; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    values[ index ] = jQuery._data( elem, "olddisplay" );
    if ( show ) {
      // Reset the inline display of this element to learn if it is
      // being hidden by cascaded rules or not
      if ( !values[ index ] && elem.style.display === "none" ) {
        elem.style.display = "";
      }

      // Set elements which have been overridden with display: none
      // in a stylesheet to whatever the default browser style is
      // for such an element
      if ( elem.style.display === "" && isHidden( elem ) ) {
        values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
      }
    } else {
      display = curCSS( elem, "display" );

      if ( !values[ index ] && display !== "none" ) {
        jQuery._data( elem, "olddisplay", display );
      }
    }
  }

  // Set the display of most of the elements in a second loop
  // to avoid the constant reflow
  for ( index = 0; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
      elem.style.display = show ? values[ index ] || "" : "none";
    }
  }

  return elements;
}

jQuery.fn.extend({
  css: function( name, value ) {
    return jQuery.access( this, function( elem, name, value ) {
      return value !== undefined ?
        jQuery.style( elem, name, value ) :
        jQuery.css( elem, name );
    }, name, value, arguments.length > 1 );
  },
  show: function() {
    return showHide( this, true );
  },
  hide: function() {
    return showHide( this );
  },
  toggle: function( state, fn2 ) {
    var bool = typeof state === "boolean";

    if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
      return eventsToggle.apply( this, arguments );
    }

    return this.each(function() {
      if ( bool ? state : isHidden( this ) ) {
        jQuery( this ).show();
      } else {
        jQuery( this ).hide();
      }
    });
  }
});

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function( elem, computed ) {
        if ( computed ) {
          // We should always get a number back from opacity
          var ret = curCSS( elem, "opacity" );
          return ret === "" ? "1" : ret;

        }
      }
    }
  },

  // Exclude the following css properties to add px
  cssNumber: {
    "fillOpacity": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  },

  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {
    // normalize float css property
    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
  },

  // Get and set the style property on a DOM Node
  style: function( elem, name, value, extra ) {
    // Don't set styles on text and comment nodes
    if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      return;
    }

    // Make sure that we're working with the right name
    var ret, type, hooks,
      origName = jQuery.camelCase( name ),
      style = elem.style;

    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // Check if we're setting a value
    if ( value !== undefined ) {
      type = typeof value;

      // convert relative number strings (+= or -=) to relative numbers. #7345
      if ( type === "string" && (ret = rrelNum.exec( value )) ) {
        value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
        // Fixes bug #9237
        type = "number";
      }

      // Make sure that NaN and null values aren't set. See: #7116
      if ( value == null || type === "number" && isNaN( value ) ) {
        return;
      }

      // If a number was passed in, add 'px' to the (except for certain CSS properties)
      if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
        value += "px";
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
        // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
        // Fixes bug #5509
        try {
          style[ name ] = value;
        } catch(e) {}
      }

    } else {
      // If a hook was provided get the non-computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
        return ret;
      }

      // Otherwise just get the value from the style object
      return style[ name ];
    }
  },

  css: function( elem, name, numeric, extra ) {
    var val, num, hooks,
      origName = jQuery.camelCase( name );

    // Make sure that we're working with the right name
    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks ) {
      val = hooks.get( elem, true, extra );
    }

    // Otherwise, if a way to get the computed value exists, use that
    if ( val === undefined ) {
      val = curCSS( elem, name );
    }

    //convert "normal" to computed value
    if ( val === "normal" && name in cssNormalTransform ) {
      val = cssNormalTransform[ name ];
    }

    // Return, converting to number if forced or a qualifier was provided and val looks numeric
    if ( numeric || extra !== undefined ) {
      num = parseFloat( val );
      return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
    }
    return val;
  },

  // A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback ) {
    var ret, name,
      old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    ret = callback.call( elem );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }

    return ret;
  }
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
  curCSS = function( elem, name ) {
    var ret, width, minWidth, maxWidth,
      computed = window.getComputedStyle( elem, null ),
      style = elem.style;

    if ( computed ) {

      ret = computed[ name ];
      if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
        ret = jQuery.style( elem, name );
      }

      // A tribute to the "awesome hack by Dean Edwards"
      // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
      // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
      // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
      if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;

        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }

    return ret;
  };
} else if ( document.documentElement.currentStyle ) {
  curCSS = function( elem, name ) {
    var left, rsLeft,
      ret = elem.currentStyle && elem.currentStyle[ name ],
      style = elem.style;

    // Avoid setting ret to empty string here
    // so we don't default to auto
    if ( ret == null && style && style[ name ] ) {
      ret = style[ name ];
    }

    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    // but not position css attributes, as those are proportional to the parent element instead
    // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
    if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

      // Remember the original values
      left = style.left;
      rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

      // Put in the new values to get a computed value out
      if ( rsLeft ) {
        elem.runtimeStyle.left = elem.currentStyle.left;
      }
      style.left = name === "fontSize" ? "1em" : ret;
      ret = style.pixelLeft + "px";

      // Revert the changed values
      style.left = left;
      if ( rsLeft ) {
        elem.runtimeStyle.left = rsLeft;
      }
    }

    return ret === "" ? "auto" : ret;
  };
}

function setPositiveNumber( elem, value, subtract ) {
  var matches = rnumsplit.exec( value );
  return matches ?
      Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
      value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
  var i = extra === ( isBorderBox ? "border" : "content" ) ?
    // If we already have the right measurement, avoid augmentation
    4 :
    // Otherwise initialize for horizontal or vertical properties
    name === "width" ? 1 : 0,

    val = 0;

  for ( ; i < 4; i += 2 ) {
    // both box models exclude margin, so add it if we want it
    if ( extra === "margin" ) {
      // we use jQuery.css instead of curCSS here
      // because of the reliableMarginRight CSS hook!
      val += jQuery.css( elem, extra + cssExpand[ i ], true );
    }

    // From this point on we use curCSS for maximum performance (relevant in animations)
    if ( isBorderBox ) {
      // border-box includes padding, so remove it if we want content
      if ( extra === "content" ) {
        val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
      }

      // at this point, extra isn't border nor margin, so remove border
      if ( extra !== "margin" ) {
        val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
      }
    } else {
      // at this point, extra isn't content, so add padding
      val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

      // at this point, extra isn't content nor padding, so add border
      if ( extra !== "padding" ) {
        val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
      }
    }
  }

  return val;
}

function getWidthOrHeight( elem, name, extra ) {

  // Start with offset property, which is equivalent to the border-box value
  var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
    valueIsBorderBox = true,
    isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

  // some non-html elements return undefined for offsetWidth, so check for null/undefined
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  if ( val <= 0 || val == null ) {
    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name );
    if ( val < 0 || val == null ) {
      val = elem.style[ name ];
    }

    // Computed unit is not pixels. Stop here and return.
    if ( rnumnonpx.test(val) ) {
      return val;
    }

    // we need the check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable elem.style
    valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;
  }

  // use the active box-sizing model to add/subtract irrelevant styles
  return ( val +
    augmentWidthOrHeight(
      elem,
      name,
      extra || ( isBorderBox ? "border" : "content" ),
      valueIsBorderBox
    )
  ) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
  if ( elemdisplay[ nodeName ] ) {
    return elemdisplay[ nodeName ];
  }

  var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
    display = elem.css("display");
  elem.remove();

  // If the simple way fails,
  // get element's real default display by attaching it to a temp iframe
  if ( display === "none" || display === "" ) {
    // Use the already-created iframe if possible
    iframe = document.body.appendChild(
      iframe || jQuery.extend( document.createElement("iframe"), {
        frameBorder: 0,
        width: 0,
        height: 0
      })
    );

    // Create a cacheable copy of the iframe document on first call.
    // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
    // document to it; WebKit & Firefox won't allow reusing the iframe document.
    if ( !iframeDoc || !iframe.createElement ) {
      iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
      iframeDoc.write("<!doctype html><html><body>");
      iframeDoc.close();
    }

    elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

    display = curCSS( elem, "display" );
    document.body.removeChild( iframe );
  }

  // Store the correct default display
  elemdisplay[ nodeName ] = display;

  return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
  jQuery.cssHooks[ name ] = {
    get: function( elem, computed, extra ) {
      if ( computed ) {
        // certain elements can have dimension info if we invisibly show them
        // however, it must have a current display style that would benefit from this
        if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
          return jQuery.swap( elem, cssShow, function() {
            return getWidthOrHeight( elem, name, extra );
          });
        } else {
          return getWidthOrHeight( elem, name, extra );
        }
      }
    },

    set: function( elem, value, extra ) {
      return setPositiveNumber( elem, value, extra ?
        augmentWidthOrHeight(
          elem,
          name,
          extra,
          jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
        ) : 0
      );
    }
  };
});

if ( !jQuery.support.opacity ) {
  jQuery.cssHooks.opacity = {
    get: function( elem, computed ) {
      // IE uses filters for opacity
      return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
        ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
        computed ? "1" : "";
    },

    set: function( elem, value ) {
      var style = elem.style,
        currentStyle = elem.currentStyle,
        opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
        filter = currentStyle && currentStyle.filter || style.filter || "";

      // IE has trouble with opacity if it does not have layout
      // Force it by setting the zoom level
      style.zoom = 1;

      // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
      if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
        style.removeAttribute ) {

        // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
        // if "filter:" is present at all, clearType is disabled, we want to avoid this
        // style.removeAttribute is IE Only, but so apparently is this code path...
        style.removeAttribute( "filter" );

        // if there there is no filter style applied in a css rule, we are done
        if ( currentStyle && !currentStyle.filter ) {
          return;
        }
      }

      // otherwise, set new filter values
      style.filter = ralpha.test( filter ) ?
        filter.replace( ralpha, opacity ) :
        filter + " " + opacity;
    }
  };
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
  if ( !jQuery.support.reliableMarginRight ) {
    jQuery.cssHooks.marginRight = {
      get: function( elem, computed ) {
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        // Work around by temporarily setting element display to inline-block
        return jQuery.swap( elem, { "display": "inline-block" }, function() {
          if ( computed ) {
            return curCSS( elem, "marginRight" );
          }
        });
      }
    };
  }

  // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
  // getComputedStyle returns percent when specified for top/left/bottom/right
  // rather than make the css module depend on the offset module, we just check for it here
  if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
    jQuery.each( [ "top", "left" ], function( i, prop ) {
      jQuery.cssHooks[ prop ] = {
        get: function( elem, computed ) {
          if ( computed ) {
            var ret = curCSS( elem, prop );
            // if curCSS returns percentage, fallback to offset
            return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
          }
        }
      };
    });
  }

});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.hidden = function( elem ) {
    return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
  };

  jQuery.expr.filters.visible = function( elem ) {
    return !jQuery.expr.filters.hidden( elem );
  };
}

// These hooks are used by animate to expand properties
jQuery.each({
  margin: "",
  padding: "",
  border: "Width"
}, function( prefix, suffix ) {
  jQuery.cssHooks[ prefix + suffix ] = {
    expand: function( value ) {
      var i,

        // assumes a single number if not a string
        parts = typeof value === "string" ? value.split(" ") : [ value ],
        expanded = {};

      for ( i = 0; i < 4; i++ ) {
        expanded[ prefix + cssExpand[ i ] + suffix ] =
          parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
      }

      return expanded;
    }
  };

  if ( !rmargin.test( prefix ) ) {
    jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
  }
});
var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
  rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
  serialize: function() {
    return jQuery.param( this.serializeArray() );
  },
  serializeArray: function() {
    return this.map(function(){
      return this.elements ? jQuery.makeArray( this.elements ) : this;
    })
    .filter(function(){
      return this.name && !this.disabled &&
        ( this.checked || rselectTextarea.test( this.nodeName ) ||
          rinput.test( this.type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val, i ){
            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    }).get();
  }
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
  var prefix,
    s = [],
    add = function( key, value ) {
      // If value is a function, invoke it and return its value
      value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
      s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    };

  // Set traditional to true for jQuery <= 1.3.2 behavior.
  if ( traditional === undefined ) {
    traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
  }

  // If an array was passed in, assume that it is an array of form elements.
  if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    // Serialize the form elements
    jQuery.each( a, function() {
      add( this.name, this.value );
    });

  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
  var name;

  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // If array item is non-scalar (array or object), encode its
        // numeric index to resolve deserialization ambiguity issues.
        // Note that rack (as of 1.0.0) can't currently deserialize
        // nested arrays properly, and attempting to do so may cause
        // a server error. Possible fixes are to modify rack's
        // deserialization algorithm or to provide an option or flag
        // to force array serialization to be shallow.
        buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && jQuery.type( obj ) === "object" ) {
    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}
var
  // Document location
  ajaxLocParts,
  ajaxLocation,

  rhash = /#.*$/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
  rnoContent = /^(?:GET|HEAD)$/,
  rprotocol = /^\/\//,
  rquery = /\?/,
  rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  rts = /([?&])_=[^&]*/,
  rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

  // Keep a copy of the old load method
  _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},

  // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
  ajaxLocation = location.href;
} catch( e ) {
  // Use the href attribute of an A element
  // since IE will modify it given document.location
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function( dataTypeExpression, func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    var dataType, list, placeBefore,
      dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
      i = 0,
      length = dataTypes.length;

    if ( jQuery.isFunction( func ) ) {
      // For each dataType in the dataTypeExpression
      for ( ; i < length; i++ ) {
        dataType = dataTypes[ i ];
        // We control if we're asked to add before
        // any existing element
        placeBefore = /^\+/.test( dataType );
        if ( placeBefore ) {
          dataType = dataType.substr( 1 ) || "*";
        }
        list = structure[ dataType ] = structure[ dataType ] || [];
        // then we add to the structure accordingly
        list[ placeBefore ? "unshift" : "push" ]( func );
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
    dataType /* internal */, inspected /* internal */ ) {

  dataType = dataType || options.dataTypes[ 0 ];
  inspected = inspected || {};

  inspected[ dataType ] = true;

  var selection,
    list = structure[ dataType ],
    i = 0,
    length = list ? list.length : 0,
    executeOnly = ( structure === prefilters );

  for ( ; i < length && ( executeOnly || !selection ); i++ ) {
    selection = list[ i ]( options, originalOptions, jqXHR );
    // If we got redirected to another dataType
    // we try there if executing only and not done already
    if ( typeof selection === "string" ) {
      if ( !executeOnly || inspected[ selection ] ) {
        selection = undefined;
      } else {
        options.dataTypes.unshift( selection );
        selection = inspectPrefiltersOrTransports(
            structure, options, originalOptions, jqXHR, selection, inspected );
      }
    }
  }
  // If we're only executing or nothing was selected
  // we try the catchall dataType if not done already
  if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
    selection = inspectPrefiltersOrTransports(
        structure, options, originalOptions, jqXHR, "*", inspected );
  }
  // unnecessary when only executing (prefilters)
  // but it'll be ignored by the caller in that case
  return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
  var key, deep,
    flatOptions = jQuery.ajaxSettings.flatOptions || {};
  for ( key in src ) {
    if ( src[ key ] !== undefined ) {
      ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    }
  }
  if ( deep ) {
    jQuery.extend( true, target, deep );
  }
}

jQuery.fn.load = function( url, params, callback ) {
  if ( typeof url !== "string" && _load ) {
    return _load.apply( this, arguments );
  }

  // Don't do a request if no elements are being requested
  if ( !this.length ) {
    return this;
  }

  var selector, type, response,
    self = this,
    off = url.indexOf(" ");

  if ( off >= 0 ) {
    selector = url.slice( off, url.length );
    url = url.slice( 0, off );
  }

  // If it's a function
  if ( jQuery.isFunction( params ) ) {

    // We assume that it's the callback
    callback = params;
    params = undefined;

  // Otherwise, build a param string
  } else if ( params && typeof params === "object" ) {
    type = "POST";
  }

  // Request the remote document
  jQuery.ajax({
    url: url,

    // if "type" variable is undefined, then "GET" method will be used
    type: type,
    dataType: "html",
    data: params,
    complete: function( jqXHR, status ) {
      if ( callback ) {
        self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
      }
    }
  }).done(function( responseText ) {

    // Save response for use in complete callback
    response = arguments;

    // See if a selector was specified
    self.html( selector ?

      // Create a dummy div to hold the results
      jQuery("<div>")

        // inject the contents of the document in, removing the scripts
        // to avoid any 'Permission Denied' errors in IE
        .append( responseText.replace( rscript, "" ) )

        // Locate the specified elements
        .find( selector ) :

      // If not, just inject the full result
      responseText );

  });

  return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
  jQuery.fn[ o ] = function( f ){
    return this.on( o, f );
  };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      type: method,
      url: url,
      data: data,
      success: callback,
      dataType: type
    });
  };
});

jQuery.extend({

  getScript: function( url, callback ) {
    return jQuery.get( url, undefined, callback, "script" );
  },

  getJSON: function( url, data, callback ) {
    return jQuery.get( url, data, callback, "json" );
  },

  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function( target, settings ) {
    if ( settings ) {
      // Building a settings object
      ajaxExtend( target, jQuery.ajaxSettings );
    } else {
      // Extending ajaxSettings
      settings = target;
      target = jQuery.ajaxSettings;
    }
    ajaxExtend( target, settings );
    return target;
  },

  ajaxSettings: {
    url: ajaxLocation,
    isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
    global: true,
    type: "GET",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    processData: true,
    async: true,
    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    throws: false,
    traditional: false,
    headers: {},
    */

    accepts: {
      xml: "application/xml, text/xml",
      html: "text/html",
      text: "text/plain",
      json: "application/json, text/javascript",
      "*": allTypes
    },

    contents: {
      xml: /xml/,
      html: /html/,
      json: /json/
    },

    responseFields: {
      xml: "responseXML",
      text: "responseText"
    },

    // List of data converters
    // 1) key format is "source_type destination_type" (a single space in-between)
    // 2) the catchall symbol "*" can be used for source_type
    converters: {

      // Convert anything to text
      "* text": window.String,

      // Text to html (true = no transformation)
      "text html": true,

      // Evaluate text as a json expression
      "text json": jQuery.parseJSON,

      // Parse text as xml
      "text xml": jQuery.parseXML
    },

    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions: {
      context: true,
      url: true
    }
  },

  ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  ajaxTransport: addToPrefiltersOrTransports( transports ),

  // Main method
  ajax: function( url, options ) {

    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    // Force options to be an object
    options = options || {};

    var // ifModified key
      ifModifiedKey,
      // Response headers
      responseHeadersString,
      responseHeaders,
      // transport
      transport,
      // timeout handle
      timeoutTimer,
      // Cross-domain detection vars
      parts,
      // To know if global events are to be dispatched
      fireGlobals,
      // Loop variable
      i,
      // Create the final options object
      s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
      callbackContext = s.context || s,
      // Context for global events
      // It's the callbackContext if one was provided in the options
      // and if it's a DOM node or a jQuery collection
      globalEventContext = callbackContext !== s &&
        ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
            jQuery( callbackContext ) : jQuery.event,
      // Deferreds
      deferred = jQuery.Deferred(),
      completeDeferred = jQuery.Callbacks( "once memory" ),
      // Status-dependent callbacks
      statusCode = s.statusCode || {},
      // Headers (they are sent all at once)
      requestHeaders = {},
      requestHeadersNames = {},
      // The jqXHR state
      state = 0,
      // Default abort message
      strAbort = "canceled",
      // Fake xhr
      jqXHR = {

        readyState: 0,

        // Caches the header
        setRequestHeader: function( name, value ) {
          if ( !state ) {
            var lname = name.toLowerCase();
            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        },

        // Raw string
        getAllResponseHeaders: function() {
          return state === 2 ? responseHeadersString : null;
        },

        // Builds headers hashtable if needed
        getResponseHeader: function( key ) {
          var match;
          if ( state === 2 ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match === undefined ? null : match;
        },

        // Overrides response content-type header
        overrideMimeType: function( type ) {
          if ( !state ) {
            s.mimeType = type;
          }
          return this;
        },

        // Cancel the request
        abort: function( statusText ) {
          statusText = statusText || strAbort;
          if ( transport ) {
            transport.abort( statusText );
          }
          done( 0, statusText );
          return this;
        }
      };

    // Callback for when everything is done
    // It is defined here because jslint complains if it is declared
    // at the end of the function (which would be more logical and readable)
    function done( status, nativeStatusText, responses, headers ) {
      var isSuccess, success, error, response, modified,
        statusText = nativeStatusText;

      // Called once
      if ( state === 2 ) {
        return;
      }

      // State is "done" now
      state = 2;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      jqXHR.readyState = status > 0 ? 4 : 0;

      // Get response data
      if ( responses ) {
        response = ajaxHandleResponses( s, jqXHR, responses );
      }

      // If successful, handle type chaining
      if ( status >= 200 && status < 300 || status === 304 ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {

          modified = jqXHR.getResponseHeader("Last-Modified");
          if ( modified ) {
            jQuery.lastModified[ ifModifiedKey ] = modified;
          }
          modified = jqXHR.getResponseHeader("Etag");
          if ( modified ) {
            jQuery.etag[ ifModifiedKey ] = modified;
          }
        }

        // If not modified
        if ( status === 304 ) {

          statusText = "notmodified";
          isSuccess = true;

        // If we have data
        } else {

          isSuccess = ajaxConvert( s, response );
          statusText = isSuccess.state;
          success = isSuccess.data;
          error = isSuccess.error;
          isSuccess = !error;
        }
      } else {
        // We extract error from statusText
        // then normalize statusText and status for non-aborts
        error = statusText;
        if ( !statusText || status ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      jqXHR.status = status;
      jqXHR.statusText = ( nativeStatusText || statusText ) + "";

      // Success/Error
      if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      }

      // Status-dependent callbacks
      jqXHR.statusCode( statusCode );
      statusCode = undefined;

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
            [ jqXHR, s, isSuccess ? success : error ] );
      }

      // Complete
      completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
        // Handle the global AJAX counter
        if ( !( --jQuery.active ) ) {
          jQuery.event.trigger( "ajaxStop" );
        }
      }
    }

    // Attach deferreds
    deferred.promise( jqXHR );
    jqXHR.success = jqXHR.done;
    jqXHR.error = jqXHR.fail;
    jqXHR.complete = completeDeferred.add;

    // Status-dependent callbacks
    jqXHR.statusCode = function( map ) {
      if ( map ) {
        var tmp;
        if ( state < 2 ) {
          for ( tmp in map ) {
            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
          }
        } else {
          tmp = map[ jqXHR.status ];
          jqXHR.always( tmp );
        }
      }
      return this;
    };

    // Remove hash character (#7531: and string promotion)
    // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
    // We also use the url parameter if available
    s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

    // Extract dataTypes list
    s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

    // A cross-domain request is in order when we have a protocol:host:port mismatch
    if ( s.crossDomain == null ) {
      parts = rurl.exec( s.url.toLowerCase() ) || false;
      s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
        ( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = jQuery.param( s.data, s.traditional );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    // If request was aborted inside a prefilter, stop there
    if ( state === 2 ) {
      return jqXHR;
    }

    // We can fire global events as of now if asked to
    fireGlobals = s.global;

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Watch for a new set of requests
    if ( fireGlobals && jQuery.active++ === 0 ) {
      jQuery.event.trigger( "ajaxStart" );
    }

    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // If data is available, append data to url
      if ( s.data ) {
        s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
        // #9682: remove data so that it's not used in an eventual retry
        delete s.data;
      }

      // Get ifModifiedKey before adding the anti-cache parameter
      ifModifiedKey = s.url;

      // Add anti-cache in url if needed
      if ( s.cache === false ) {

        var ts = jQuery.now(),
          // try replacing _= if it is there
          ret = s.url.replace( rts, "$1_=" + ts );

        // if nothing was replaced, add timestamp to the end
        s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      jqXHR.setRequestHeader( "Content-Type", s.contentType );
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      ifModifiedKey = ifModifiedKey || s.url;
      if ( jQuery.lastModified[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
      }
      if ( jQuery.etag[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
      }
    }

    // Set the Accepts header for the server, depending on the dataType
    jqXHR.setRequestHeader(
      "Accept",
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
        s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      jqXHR.setRequestHeader( i, s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
        // Abort if not done already and return
        return jqXHR.abort();

    }

    // aborting is no longer a cancellation
    strAbort = "abort";

    // Install callbacks on deferreds
    for ( i in { success: 1, error: 1, complete: 1 } ) {
      jqXHR[ i ]( s[ i ] );
    }

    // Get transport
    transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1, "No Transport" );
    } else {
      jqXHR.readyState = 1;
      // Send global event
      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      }
      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = setTimeout( function(){
          jqXHR.abort( "timeout" );
        }, s.timeout );
      }

      try {
        state = 1;
        transport.send( requestHeaders, done );
      } catch (e) {
        // Propagate exception as error if not done
        if ( state < 2 ) {
          done( -1, e );
        // Simply rethrow otherwise
        } else {
          throw e;
        }
      }
    }

    return jqXHR;
  },

  // Counter for holding the number of active queries
  active: 0,

  // Last-Modified header cache for next request
  lastModified: {},
  etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

  var ct, type, finalDataType, firstDataType,
    contents = s.contents,
    dataTypes = s.dataTypes,
    responseFields = s.responseFields;

  // Fill responseXXX fields
  for ( type in responseFields ) {
    if ( type in responses ) {
      jqXHR[ responseFields[type] ] = responses[ type ];
    }
  }

  // Remove auto dataType and get content-type in the process
  while( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {
    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }
    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

  var conv, conv2, current, tmp,
    // Work with a copy of dataTypes in case we need to modify it for conversion
    dataTypes = s.dataTypes.slice(),
    prev = dataTypes[ 0 ],
    converters = {},
    i = 0;

  // Apply the dataFilter if provided
  if ( s.dataFilter ) {
    response = s.dataFilter( response, s.dataType );
  }

  // Create converters map with lowercased keys
  if ( dataTypes[ 1 ] ) {
    for ( conv in s.converters ) {
      converters[ conv.toLowerCase() ] = s.converters[ conv ];
    }
  }

  // Convert to each sequential dataType, tolerating list modification
  for ( ; (current = dataTypes[++i]); ) {

    // There's only work to do if current dataType is non-auto
    if ( current !== "*" ) {

      // Convert response if prev dataType is non-auto and differs from current
      if ( prev !== "*" && prev !== current ) {

        // Seek a direct converter
        conv = converters[ prev + " " + current ] || converters[ "* " + current ];

        // If none found, seek a pair
        if ( !conv ) {
          for ( conv2 in converters ) {

            // If conv2 outputs current
            tmp = conv2.split(" ");
            if ( tmp[ 1 ] === current ) {

              // If prev can be converted to accepted input
              conv = converters[ prev + " " + tmp[ 0 ] ] ||
                converters[ "* " + tmp[ 0 ] ];
              if ( conv ) {
                // Condense equivalence converters
                if ( conv === true ) {
                  conv = converters[ conv2 ];

                // Otherwise, insert the intermediate dataType
                } else if ( converters[ conv2 ] !== true ) {
                  current = tmp[ 0 ];
                  dataTypes.splice( i--, 0, current );
                }

                break;
              }
            }
          }
        }

        // Apply converter (if not an equivalence)
        if ( conv !== true ) {

          // Unless errors are allowed to bubble, catch and return them
          if ( conv && s["throws"] ) {
            response = conv( response );
          } else {
            try {
              response = conv( response );
            } catch ( e ) {
              return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
            }
          }
        }
      }

      // Update prev for next iteration
      prev = current;
    }
  }

  return { state: "success", data: response };
}
var oldCallbacks = [],
  rquestion = /\?/,
  rjsonp = /(=)\?(?=&|$)|\?\?/,
  nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
  jsonp: "callback",
  jsonpCallback: function() {
    var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
    this[ callback ] = true;
    return callback;
  }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  var callbackName, overwritten, responseContainer,
    data = s.data,
    url = s.url,
    hasCallback = s.jsonp !== false,
    replaceInUrl = hasCallback && rjsonp.test( url ),
    replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
      !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
      rjsonp.test( data );

  // Handle iff the expected data type is "jsonp" or we have a parameter to set
  if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

    // Get callback name, remembering preexisting value associated with it
    callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
      s.jsonpCallback() :
      s.jsonpCallback;
    overwritten = window[ callbackName ];

    // Insert callback into url or form data
    if ( replaceInUrl ) {
      s.url = url.replace( rjsonp, "$1" + callbackName );
    } else if ( replaceInData ) {
      s.data = data.replace( rjsonp, "$1" + callbackName );
    } else if ( hasCallback ) {
      s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    }

    // Use data converter to retrieve json after script execution
    s.converters["script json"] = function() {
      if ( !responseContainer ) {
        jQuery.error( callbackName + " was not called" );
      }
      return responseContainer[ 0 ];
    };

    // force json dataType
    s.dataTypes[ 0 ] = "json";

    // Install callback
    window[ callbackName ] = function() {
      responseContainer = arguments;
    };

    // Clean-up function (fires after converters)
    jqXHR.always(function() {
      // Restore preexisting value
      window[ callbackName ] = overwritten;

      // Save back as free
      if ( s[ callbackName ] ) {
        // make sure that re-using the options doesn't screw things around
        s.jsonpCallback = originalSettings.jsonpCallback;

        // save the callback name for future use
        oldCallbacks.push( callbackName );
      }

      // Call if it was a function and we have a response
      if ( responseContainer && jQuery.isFunction( overwritten ) ) {
        overwritten( responseContainer[ 0 ] );
      }

      responseContainer = overwritten = undefined;
    });

    // Delegate to script
    return "script";
  }
});
// Install script dataType
jQuery.ajaxSetup({
  accepts: {
    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
  },
  contents: {
    script: /javascript|ecmascript/
  },
  converters: {
    "text script": function( text ) {
      jQuery.globalEval( text );
      return text;
    }
  }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
    s.global = false;
  }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

  // This transport only deals with cross domain requests
  if ( s.crossDomain ) {

    var script,
      head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

    return {

      send: function( _, callback ) {

        script = document.createElement( "script" );

        script.async = "async";

        if ( s.scriptCharset ) {
          script.charset = s.scriptCharset;
        }

        script.src = s.url;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function( _, isAbort ) {

          if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( head && script.parentNode ) {
              head.removeChild( script );
            }

            // Dereference the script
            script = undefined;

            // Callback if not abort
            if ( !isAbort ) {
              callback( 200, "success" );
            }
          }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (#2709 and #4378).
        head.insertBefore( script, head.firstChild );
      },

      abort: function() {
        if ( script ) {
          script.onload( 0, 1 );
        }
      }
    };
  }
});
var xhrCallbacks,
  // #5280: Internet Explorer will keep connections alive if we don't abort on unload
  xhrOnUnloadAbort = window.ActiveXObject ? function() {
    // Abort all pending requests
    for ( var key in xhrCallbacks ) {
      xhrCallbacks[ key ]( 0, 1 );
    }
  } : false,
  xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject( "Microsoft.XMLHTTP" );
  } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;

// Determine support properties
(function( xhr ) {
  jQuery.extend( jQuery.support, {
    ajax: !!xhr,
    cors: !!xhr && ( "withCredentials" in xhr )
  });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

  jQuery.ajaxTransport(function( s ) {
    // Cross domain only allowed if supported through XMLHttpRequest
    if ( !s.crossDomain || jQuery.support.cors ) {

      var callback;

      return {
        send: function( headers, complete ) {

          // Get a new xhr
          var handle, i,
            xhr = s.xhr();

          // Open the socket
          // Passing null username, generates a login popup on Opera (#2865)
          if ( s.username ) {
            xhr.open( s.type, s.url, s.async, s.username, s.password );
          } else {
            xhr.open( s.type, s.url, s.async );
          }

          // Apply custom fields if provided
          if ( s.xhrFields ) {
            for ( i in s.xhrFields ) {
              xhr[ i ] = s.xhrFields[ i ];
            }
          }

          // Override mime type if needed
          if ( s.mimeType && xhr.overrideMimeType ) {
            xhr.overrideMimeType( s.mimeType );
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if ( !s.crossDomain && !headers["X-Requested-With"] ) {
            headers[ "X-Requested-With" ] = "XMLHttpRequest";
          }

          // Need an extra try/catch for cross domain requests in Firefox 3
          try {
            for ( i in headers ) {
              xhr.setRequestHeader( i, headers[ i ] );
            }
          } catch( _ ) {}

          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send( ( s.hasContent && s.data ) || null );

          // Listener
          callback = function( _, isAbort ) {

            var status,
              statusText,
              responseHeaders,
              responses,
              xml;

            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occurred
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            try {

              // Was never called and is aborted or complete
              if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                // Only called once
                callback = undefined;

                // Do not keep as active anymore
                if ( handle ) {
                  xhr.onreadystatechange = jQuery.noop;
                  if ( xhrOnUnloadAbort ) {
                    delete xhrCallbacks[ handle ];
                  }
                }

                // If it's an abort
                if ( isAbort ) {
                  // Abort it manually if needed
                  if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                  }
                } else {
                  status = xhr.status;
                  responseHeaders = xhr.getAllResponseHeaders();
                  responses = {};
                  xml = xhr.responseXML;

                  // Construct response list
                  if ( xml && xml.documentElement /* #4958 */ ) {
                    responses.xml = xml;
                  }

                  // When requesting binary data, IE6-9 will throw an exception
                  // on any attempt to access responseText (#11426)
                  try {
                    responses.text = xhr.responseText;
                  } catch( _ ) {
                  }

                  // Firefox throws an exception when accessing
                  // statusText for faulty cross-domain requests
                  try {
                    statusText = xhr.statusText;
                  } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                  }

                  // Filter status for non standard behaviors

                  // If the request is local and we have data: assume a success
                  // (success with no data won't get notified, that's the best we
                  // can do given current implementations)
                  if ( !status && s.isLocal && !s.crossDomain ) {
                    status = responses.text ? 200 : 404;
                  // IE - #1450: sometimes returns 1223 when it should be 204
                  } else if ( status === 1223 ) {
                    status = 204;
                  }
                }
              }
            } catch( firefoxAccessException ) {
              if ( !isAbort ) {
                complete( -1, firefoxAccessException );
              }
            }

            // Call complete if needed
            if ( responses ) {
              complete( status, statusText, responses, responseHeaders );
            }
          };

          if ( !s.async ) {
            // if we're in sync mode we fire the callback
            callback();
          } else if ( xhr.readyState === 4 ) {
            // (IE6 & IE7) if it's in cache and has been
            // retrieved directly we need to fire the callback
            setTimeout( callback, 0 );
          } else {
            handle = ++xhrId;
            if ( xhrOnUnloadAbort ) {
              // Create the active xhrs callbacks list if needed
              // and attach the unload handler
              if ( !xhrCallbacks ) {
                xhrCallbacks = {};
                jQuery( window ).unload( xhrOnUnloadAbort );
              }
              // Add to list of active xhrs callbacks
              xhrCallbacks[ handle ] = callback;
            }
            xhr.onreadystatechange = callback;
          }
        },

        abort: function() {
          if ( callback ) {
            callback(0,1);
          }
        }
      };
    }
  });
}
var fxNow, timerId,
  rfxtypes = /^(?:toggle|show|hide)$/,
  rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
  rrun = /queueHooks$/,
  animationPrefilters = [ defaultPrefilter ],
  tweeners = {
    "*": [function( prop, value ) {
      var end, unit,
        tween = this.createTween( prop, value ),
        parts = rfxnum.exec( value ),
        target = tween.cur(),
        start = +target || 0,
        scale = 1,
        maxIterations = 20;

      if ( parts ) {
        end = +parts[2];
        unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

        // We need to compute starting value
        if ( unit !== "px" && start ) {
          // Iteratively approximate from a nonzero starting point
          // Prefer the current property, because this process will be trivial if it uses the same units
          // Fallback to end or a simple constant
          start = jQuery.css( tween.elem, prop, true ) || end || 1;

          do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            jQuery.style( tween.elem, prop, start + unit );

          // Update scale, tolerating zero or NaN from tween.cur()
          // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
          } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
        }

        tween.unit = unit;
        tween.start = start;
        // If a +=/-= token was provided, we're doing a relative animation
        tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
      }
      return tween;
    }]
  };

// Animations created synchronously will run synchronously
function createFxNow() {
  setTimeout(function() {
    fxNow = undefined;
  }, 0 );
  return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
  jQuery.each( props, function( prop, value ) {
    var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
      index = 0,
      length = collection.length;
    for ( ; index < length; index++ ) {
      if ( collection[ index ].call( animation, prop, value ) ) {

        // we're done with this property
        return;
      }
    }
  });
}

function Animation( elem, properties, options ) {
  var result,
    index = 0,
    tweenerIndex = 0,
    length = animationPrefilters.length,
    deferred = jQuery.Deferred().always( function() {
      // don't match elem in the :animated selector
      delete tick.elem;
    }),
    tick = function() {
      var currentTime = fxNow || createFxNow(),
        remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
        percent = 1 - ( remaining / animation.duration || 0 ),
        index = 0,
        length = animation.tweens.length;

      for ( ; index < length ; index++ ) {
        animation.tweens[ index ].run( percent );
      }

      deferred.notifyWith( elem, [ animation, percent, remaining ]);

      if ( percent < 1 && length ) {
        return remaining;
      } else {
        deferred.resolveWith( elem, [ animation ] );
        return false;
      }
    },
    animation = deferred.promise({
      elem: elem,
      props: jQuery.extend( {}, properties ),
      opts: jQuery.extend( true, { specialEasing: {} }, options ),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function( prop, end, easing ) {
        var tween = jQuery.Tween( elem, animation.opts, prop, end,
            animation.opts.specialEasing[ prop ] || animation.opts.easing );
        animation.tweens.push( tween );
        return tween;
      },
      stop: function( gotoEnd ) {
        var index = 0,
          // if we are going to the end, we want to run all the tweens
          // otherwise we skip this part
          length = gotoEnd ? animation.tweens.length : 0;

        for ( ; index < length ; index++ ) {
          animation.tweens[ index ].run( 1 );
        }

        // resolve when we played the last frame
        // otherwise, reject
        if ( gotoEnd ) {
          deferred.resolveWith( elem, [ animation, gotoEnd ] );
        } else {
          deferred.rejectWith( elem, [ animation, gotoEnd ] );
        }
        return this;
      }
    }),
    props = animation.props;

  propFilter( props, animation.opts.specialEasing );

  for ( ; index < length ; index++ ) {
    result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
    if ( result ) {
      return result;
    }
  }

  createTweens( animation, props );

  if ( jQuery.isFunction( animation.opts.start ) ) {
    animation.opts.start.call( elem, animation );
  }

  jQuery.fx.timer(
    jQuery.extend( tick, {
      anim: animation,
      queue: animation.opts.queue,
      elem: elem
    })
  );

  // attach callbacks from options
  return animation.progress( animation.opts.progress )
    .done( animation.opts.done, animation.opts.complete )
    .fail( animation.opts.fail )
    .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
  var index, name, easing, value, hooks;

  // camelCase, specialEasing and expand cssHook pass
  for ( index in props ) {
    name = jQuery.camelCase( index );
    easing = specialEasing[ name ];
    value = props[ index ];
    if ( jQuery.isArray( value ) ) {
      easing = value[ 1 ];
      value = props[ index ] = value[ 0 ];
    }

    if ( index !== name ) {
      props[ name ] = value;
      delete props[ index ];
    }

    hooks = jQuery.cssHooks[ name ];
    if ( hooks && "expand" in hooks ) {
      value = hooks.expand( value );
      delete props[ name ];

      // not quite $.extend, this wont overwrite keys already present.
      // also - reusing 'index' from above because we have the correct "name"
      for ( index in value ) {
        if ( !( index in props ) ) {
          props[ index ] = value[ index ];
          specialEasing[ index ] = easing;
        }
      }
    } else {
      specialEasing[ name ] = easing;
    }
  }
}

jQuery.Animation = jQuery.extend( Animation, {

  tweener: function( props, callback ) {
    if ( jQuery.isFunction( props ) ) {
      callback = props;
      props = [ "*" ];
    } else {
      props = props.split(" ");
    }

    var prop,
      index = 0,
      length = props.length;

    for ( ; index < length ; index++ ) {
      prop = props[ index ];
      tweeners[ prop ] = tweeners[ prop ] || [];
      tweeners[ prop ].unshift( callback );
    }
  },

  prefilter: function( callback, prepend ) {
    if ( prepend ) {
      animationPrefilters.unshift( callback );
    } else {
      animationPrefilters.push( callback );
    }
  }
});

function defaultPrefilter( elem, props, opts ) {
  var index, prop, value, length, dataShow, tween, hooks, oldfire,
    anim = this,
    style = elem.style,
    orig = {},
    handled = [],
    hidden = elem.nodeType && isHidden( elem );

  // handle queue: false promises
  if ( !opts.queue ) {
    hooks = jQuery._queueHooks( elem, "fx" );
    if ( hooks.unqueued == null ) {
      hooks.unqueued = 0;
      oldfire = hooks.empty.fire;
      hooks.empty.fire = function() {
        if ( !hooks.unqueued ) {
          oldfire();
        }
      };
    }
    hooks.unqueued++;

    anim.always(function() {
      // doing this makes sure that the complete handler will be called
      // before this completes
      anim.always(function() {
        hooks.unqueued--;
        if ( !jQuery.queue( elem, "fx" ).length ) {
          hooks.empty.fire();
        }
      });
    });
  }

  // height/width overflow pass
  if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
    // Make sure that nothing sneaks out
    // Record all 3 overflow attributes because IE does not
    // change the overflow attribute when overflowX and
    // overflowY are set to the same value
    opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    // Set display property to inline-block for height/width
    // animations on inline elements that are having width/height animated
    if ( jQuery.css( elem, "display" ) === "inline" &&
        jQuery.css( elem, "float" ) === "none" ) {

      // inline-level elements accept inline-block;
      // block-level elements need to be inline with layout
      if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
        style.display = "inline-block";

      } else {
        style.zoom = 1;
      }
    }
  }

  if ( opts.overflow ) {
    style.overflow = "hidden";
    if ( !jQuery.support.shrinkWrapBlocks ) {
      anim.done(function() {
        style.overflow = opts.overflow[ 0 ];
        style.overflowX = opts.overflow[ 1 ];
        style.overflowY = opts.overflow[ 2 ];
      });
    }
  }


  // show/hide pass
  for ( index in props ) {
    value = props[ index ];
    if ( rfxtypes.exec( value ) ) {
      delete props[ index ];
      if ( value === ( hidden ? "hide" : "show" ) ) {
        continue;
      }
      handled.push( index );
    }
  }

  length = handled.length;
  if ( length ) {
    dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
    if ( hidden ) {
      jQuery( elem ).show();
    } else {
      anim.done(function() {
        jQuery( elem ).hide();
      });
    }
    anim.done(function() {
      var prop;
      jQuery.removeData( elem, "fxshow", true );
      for ( prop in orig ) {
        jQuery.style( elem, prop, orig[ prop ] );
      }
    });
    for ( index = 0 ; index < length ; index++ ) {
      prop = handled[ index ];
      tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
      orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

      if ( !( prop in dataShow ) ) {
        dataShow[ prop ] = tween.start;
        if ( hidden ) {
          tween.end = tween.start;
          tween.start = prop === "width" || prop === "height" ? 1 : 0;
        }
      }
    }
  }
}

function Tween( elem, options, prop, end, easing ) {
  return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
  constructor: Tween,
  init: function( elem, options, prop, end, easing, unit ) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || "swing";
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  },
  cur: function() {
    var hooks = Tween.propHooks[ this.prop ];

    return hooks && hooks.get ?
      hooks.get( this ) :
      Tween.propHooks._default.get( this );
  },
  run: function( percent ) {
    var eased,
      hooks = Tween.propHooks[ this.prop ];

    if ( this.options.duration ) {
      this.pos = eased = jQuery.easing[ this.easing ](
        percent, this.options.duration * percent, 0, 1, this.options.duration
      );
    } else {
      this.pos = eased = percent;
    }
    this.now = ( this.end - this.start ) * eased + this.start;

    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    if ( hooks && hooks.set ) {
      hooks.set( this );
    } else {
      Tween.propHooks._default.set( this );
    }
    return this;
  }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
  _default: {
    get: function( tween ) {
      var result;

      if ( tween.elem[ tween.prop ] != null &&
        (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
        return tween.elem[ tween.prop ];
      }

      // passing any value as a 4th parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails
      // so, simple values such as "10px" are parsed to Float.
      // complex values such as "rotate(1rad)" are returned as is.
      result = jQuery.css( tween.elem, tween.prop, false, "" );
      // Empty strings, null, undefined and "auto" are converted to 0.
      return !result || result === "auto" ? 0 : result;
    },
    set: function( tween ) {
      // use step hook for back compat - use cssHook if its there - use .style if its
      // available and use plain properties where available
      if ( jQuery.fx.step[ tween.prop ] ) {
        jQuery.fx.step[ tween.prop ]( tween );
      } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
        jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
      } else {
        tween.elem[ tween.prop ] = tween.now;
      }
    }
  }
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  set: function( tween ) {
    if ( tween.elem.nodeType && tween.elem.parentNode ) {
      tween.elem[ tween.prop ] = tween.now;
    }
  }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
  var cssFn = jQuery.fn[ name ];
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return speed == null || typeof speed === "boolean" ||
      // special check for .toggle( handler, handler, ... )
      ( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
      cssFn.apply( this, arguments ) :
      this.animate( genFx( name, true ), speed, easing, callback );
  };
});

jQuery.fn.extend({
  fadeTo: function( speed, to, easing, callback ) {

    // show any hidden elements after setting opacity to 0
    return this.filter( isHidden ).css( "opacity", 0 ).show()

      // animate to the value specified
      .end().animate({ opacity: to }, speed, easing, callback );
  },
  animate: function( prop, speed, easing, callback ) {
    var empty = jQuery.isEmptyObject( prop ),
      optall = jQuery.speed( speed, easing, callback ),
      doAnimation = function() {
        // Operate on a copy of prop so per-property easing won't be lost
        var anim = Animation( this, jQuery.extend( {}, prop ), optall );

        // Empty animations resolve immediately
        if ( empty ) {
          anim.stop( true );
        }
      };

    return empty || optall.queue === false ?
      this.each( doAnimation ) :
      this.queue( optall.queue, doAnimation );
  },
  stop: function( type, clearQueue, gotoEnd ) {
    var stopQueue = function( hooks ) {
      var stop = hooks.stop;
      delete hooks.stop;
      stop( gotoEnd );
    };

    if ( typeof type !== "string" ) {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }
    if ( clearQueue && type !== false ) {
      this.queue( type || "fx", [] );
    }

    return this.each(function() {
      var dequeue = true,
        index = type != null && type + "queueHooks",
        timers = jQuery.timers,
        data = jQuery._data( this );

      if ( index ) {
        if ( data[ index ] && data[ index ].stop ) {
          stopQueue( data[ index ] );
        }
      } else {
        for ( index in data ) {
          if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
            stopQueue( data[ index ] );
          }
        }
      }

      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
          timers[ index ].anim.stop( gotoEnd );
          dequeue = false;
          timers.splice( index, 1 );
        }
      }

      // start the next in the queue if the last step wasn't forced
      // timers currently will call their complete callbacks, which will dequeue
      // but only if they were gotoEnd
      if ( dequeue || !gotoEnd ) {
        jQuery.dequeue( this, type );
      }
    });
  }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
  var which,
    attrs = { height: type },
    i = 0;

  // if we include width, step value is 1 to do all cssExpand values,
  // if we don't include width, step value is 2 to skip over Left and Right
  includeWidth = includeWidth? 1 : 0;
  for( ; i < 4 ; i += 2 - includeWidth ) {
    which = cssExpand[ i ];
    attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
  }

  if ( includeWidth ) {
    attrs.opacity = attrs.width = type;
  }

  return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx("show"),
  slideUp: genFx("hide"),
  slideToggle: genFx("toggle"),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.speed = function( speed, easing, fn ) {
  var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    complete: fn || !fn && easing ||
      jQuery.isFunction( speed ) && speed,
    duration: speed,
    easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
  };

  opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
    opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

  // normalize opt.queue - true/undefined/null -> "fx"
  if ( opt.queue == null || opt.queue === true ) {
    opt.queue = "fx";
  }

  // Queueing
  opt.old = opt.complete;

  opt.complete = function() {
    if ( jQuery.isFunction( opt.old ) ) {
      opt.old.call( this );
    }

    if ( opt.queue ) {
      jQuery.dequeue( this, opt.queue );
    }
  };

  return opt;
};

jQuery.easing = {
  linear: function( p ) {
    return p;
  },
  swing: function( p ) {
    return 0.5 - Math.cos( p*Math.PI ) / 2;
  }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
  var timer,
    timers = jQuery.timers,
    i = 0;

  for ( ; i < timers.length; i++ ) {
    timer = timers[ i ];
    // Checks the timer has not already been removed
    if ( !timer() && timers[ i ] === timer ) {
      timers.splice( i--, 1 );
    }
  }

  if ( !timers.length ) {
    jQuery.fx.stop();
  }
};

jQuery.fx.timer = function( timer ) {
  if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
    timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
  }
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
  clearInterval( timerId );
  timerId = null;
};

jQuery.fx.speeds = {
  slow: 600,
  fast: 200,
  // Default speed
  _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
  if ( arguments.length ) {
    return options === undefined ?
      this :
      this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
  }

  var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
    box = { top: 0, left: 0 },
    elem = this[ 0 ],
    doc = elem && elem.ownerDocument;

  if ( !doc ) {
    return;
  }

  if ( (body = doc.body) === elem ) {
    return jQuery.offset.bodyOffset( elem );
  }

  docElem = doc.documentElement;

  // Make sure it's not a disconnected DOM node
  if ( !jQuery.contains( docElem, elem ) ) {
    return box;
  }

  // If we don't have gBCR, just use 0,0 rather than error
  // BlackBerry 5, iOS 3 (original iPhone)
  if ( typeof elem.getBoundingClientRect !== "undefined" ) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow( doc );
  clientTop  = docElem.clientTop  || body.clientTop  || 0;
  clientLeft = docElem.clientLeft || body.clientLeft || 0;
  scrollTop  = win.pageYOffset || docElem.scrollTop;
  scrollLeft = win.pageXOffset || docElem.scrollLeft;
  return {
    top: box.top  + scrollTop  - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
};

jQuery.offset = {

  bodyOffset: function( body ) {
    var top = body.offsetTop,
      left = body.offsetLeft;

    if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
      top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
      left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
    }

    return { top: top, left: left };
  },

  setOffset: function( elem, options, i ) {
    var position = jQuery.css( elem, "position" );

    // set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    var curElem = jQuery( elem ),
      curOffset = curElem.offset(),
      curCSSTop = jQuery.css( elem, "top" ),
      curCSSLeft = jQuery.css( elem, "left" ),
      calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
      props = {}, curPosition = {}, curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if ( options.top != null ) {
      props.top = ( options.top - curOffset.top ) + curTop;
    }
    if ( options.left != null ) {
      props.left = ( options.left - curOffset.left ) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({

  position: function() {
    if ( !this[0] ) {
      return;
    }

    var elem = this[0],

    // Get *real* offsetParent
    offsetParent = this.offsetParent(),

    // Get correct offsets
    offset       = this.offset(),
    parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    // Subtract element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
    offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

    // Add offsetParent borders
    parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
    parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

    // Subtract the two offsets
    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || document.body;
      while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || document.body;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
  var top = /Y/.test( prop );

  jQuery.fn[ method ] = function( val ) {
    return jQuery.access( this, function( elem, method, val ) {
      var win = getWindow( elem );

      if ( val === undefined ) {
        return win ? (prop in win) ? win[ prop ] :
          win.document.documentElement[ method ] :
          elem[ method ];
      }

      if ( win ) {
        win.scrollTo(
          !top ? val : jQuery( win ).scrollLeft(),
           top ? val : jQuery( win ).scrollTop()
        );

      } else {
        elem[ method ] = val;
      }
    }, method, val, arguments.length, null );
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ?
    elem :
    elem.nodeType === 9 ?
      elem.defaultView || elem.parentWindow :
      false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
    // margin is only for outerHeight, outerWidth
    jQuery.fn[ funcName ] = function( margin, value ) {
      var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
        extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

      return jQuery.access( this, function( elem, type, value ) {
        var doc;

        if ( jQuery.isWindow( elem ) ) {
          // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
          // isn't a whole lot we can do. See pull request at this URL for discussion:
          // https://github.com/jquery/jquery/pull/764
          return elem.document.documentElement[ "client" + name ];
        }

        // Get document width or height
        if ( elem.nodeType === 9 ) {
          doc = elem.documentElement;

          // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
          // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
          return Math.max(
            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
            elem.body[ "offset" + name ], doc[ "offset" + name ],
            doc[ "client" + name ]
          );
        }

        return value === undefined ?
          // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css( elem, type, value, extra ) :

          // Set width or height on the element
          jQuery.style( elem, type, value, extra );
      }, type, chainable ? margin : undefined, chainable, null );
    };
  });
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
  define( "jquery", [], function () { return jQuery; } );
}

})( window );
;

//     Underscore.js 1.4.0
//     http://underscorejs.org
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.4.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return arguments.length > 2 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    var found = false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // with specific `key:value` pairs.
  _.where = function(obj, attrs) {
    if (_.isEmpty(attrs)) return [];
    return _.filter(obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (obj.length === +obj.length) return slice.call(obj);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, fromIndex) {
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item, fromIndex);
    var i = (fromIndex != null ? fromIndex : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) {
          result = func.apply(context, args);
        }
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        throttling = true;
        result = func.apply(context, args);
      }
      whenDone();
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (0 | Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });
      source +=
        escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" :
        interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" :
        evaluate ? "';\n" + evaluate + "\n__p+='" : '';
      index = offset + match.length;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
;

//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.2';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // Regular expression used to split event strings
  var eventSplitter = /\s+/;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }

  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // A hash of attributes that have silently changed since the last time
    // `change` was called.  Will become pending attributes on the next call.
    _silent: null,

    // A hash of attributes that have changed since the last `'change'` event
    // began.
    _pending: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;

      // Handle both
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // For each `set` attribute...
      for (attr in attrs) {
        val = attrs[attr];

        // If the new and current value differ, record the change.
        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        // Update or delete the current value.
        options.unset ? delete now[attr] : now[attr] = val;

        // If the new and previous value differ, record the change.  If not,
        // then remove changes for this attribute.
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      // Fire the `"change"` events.
      if (!options.silent) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;

      // Handle both `("key", value)` and `({key: value})` -style calls.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options ? _.clone(options) : {};

      // If we're "wait"-ing to set changed attributes, validate early.
      if (options.wait) {
        if (!this._validate(attrs, options)) return false;
        current = _.clone(this.attributes);
      }

      // Regular saves `set` attributes before persisting to the server.
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) {
          delete options.wait;
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) {
        triggerDestroy();
        return false;
      }

      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      options || (options = {});
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      for (var attr in this._silent) this._pending[attr] = true;

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      for (var attr in changes) {
        this.trigger('change:' + attr, this, this.get(attr), options);
      }
      if (changing) return this;

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        for (var attr in this.changed) {
          if (this._pending[attr] || this._silent[attr]) continue;
          delete this.changed[attr];
        }
        this._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. If a specific `error` callback has
    // been passed, call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        id = model.id;
        if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
          dups.push(i);
          continue;
        }
        cids[cid] = ids[id] = model;
      }

      // Remove duplicates.
      i = dups.length;
      while (i--) {
        models.splice(dups[i], 1);
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0, length = models.length; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return void 0;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      options || (options = {});
      if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event == 'add' || event == 'remove') && collection != this) return;
      if (event == 'destroy') {
        this.remove(model, options);
      }
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
      if (current == this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = (element instanceof $) ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = Collection.extend = Router.extend = View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);;

(function(e){e.Parse=e.Parse||{},e.Parse.VERSION="1.1.6"})(this),function(){function C(e,t,n){if(e===t)return e!==0||1/e==1/t;if(e==null||t==null)return e===t;e._chain&&(e=e._wrapped),t._chain&&(t=t._wrapped);if(e.isEqual&&S.isFunction(e.isEqual))return e.isEqual(t);if(t.isEqual&&S.isFunction(t.isEqual))return t.isEqual(e);var r=a.call(e);if(r!=a.call(t))return!1;switch(r){case"[object String]":return e==String(t);case"[object Number]":return e!=+e?t!=+t:e==0?1/e==1/t:e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object RegExp]":return e.source==t.source&&e.global==t.global&&e.multiline==t.multiline&&e.ignoreCase==t.ignoreCase}if(typeof e!="object"||typeof t!="object")return!1;var i=n.length;while(i--)if(n[i]==e)return!0;n.push(e);var s=0,o=!0;if(r=="[object Array]"){s=e.length,o=s==t.length;if(o)while(s--)if(!(o=s in e==s in t&&C(e[s],t[s],n)))break}else{if("constructor"in e!="constructor"in t||e.constructor!=t.constructor)return!1;for(var u in e)if(S.has(e,u)){s++;if(!(o=S.has(t,u)&&C(e[u],t[u],n)))break}if(o){for(u in t)if(S.has(t,u)&&!(s--))break;o=!s}}return n.pop(),o}var e=this,t=e._,n={},r=Array.prototype,i=Object.prototype,s=Function.prototype,o=r.slice,u=r.unshift,a=i.toString,f=i.hasOwnProperty,l=r.forEach,c=r.map,h=r.reduce,p=r.reduceRight,d=r.filter,v=r.every,m=r.some,g=r.indexOf,y=r.lastIndexOf,b=Array.isArray,w=Object.keys,E=s.bind,S=function(e){return new P(e)};typeof exports!="undefined"?(typeof module!="undefined"&&module.exports&&(exports=module.exports=S),exports._=S):e._=S,S.VERSION="1.3.3";var x=S.each=S.forEach=function(e,t,r){if(e==null)return;if(l&&e.forEach===l)e.forEach(t,r);else if(e.length===+e.length){for(var i=0,s=e.length;i<s;i++)if(i in e&&t.call(r,e[i],i,e)===n)return}else for(var o in e)if(S.has(e,o)&&t.call(r,e[o],o,e)===n)return};S.map=S.collect=function(e,t,n){var r=[];return e==null?r:c&&e.map===c?e.map(t,n):(x(e,function(e,i,s){r[r.length]=t.call(n,e,i,s)}),e.length===+e.length&&(r.length=e.length),r)},S.reduce=S.foldl=S.inject=function(e,t,n,r){var i=arguments.length>2;e==null&&(e=[]);if(h&&e.reduce===h)return r&&(t=S.bind(t,r)),i?e.reduce(t,n):e.reduce(t);x(e,function(e,s,o){i?n=t.call(r,n,e,s,o):(n=e,i=!0)});if(!i)throw new TypeError("Reduce of empty array with no initial value");return n},S.reduceRight=S.foldr=function(e,t,n,r){var i=arguments.length>2;e==null&&(e=[]);if(p&&e.reduceRight===p)return r&&(t=S.bind(t,r)),i?e.reduceRight(t,n):e.reduceRight(t);var s=S.toArray(e).reverse();return r&&!i&&(t=S.bind(t,r)),i?S.reduce(s,t,n,r):S.reduce(s,t)},S.find=S.detect=function(e,t,n){var r;return T(e,function(e,i,s){if(t.call(n,e,i,s))return r=e,!0}),r},S.filter=S.select=function(e,t,n){var r=[];return e==null?r:d&&e.filter===d?e.filter(t,n):(x(e,function(e,i,s){t.call(n,e,i,s)&&(r[r.length]=e)}),r)},S.reject=function(e,t,n){var r=[];return e==null?r:(x(e,function(e,i,s){t.call(n,e,i,s)||(r[r.length]=e)}),r)},S.every=S.all=function(e,t,r){var i=!0;return e==null?i:v&&e.every===v?e.every(t,r):(x(e,function(e,s,o){if(!(i=i&&t.call(r,e,s,o)))return n}),!!i)};var T=S.some=S.any=function(e,t,r){t||(t=S.identity);var i=!1;return e==null?i:m&&e.some===m?e.some(t,r):(x(e,function(e,s,o){if(i||(i=t.call(r,e,s,o)))return n}),!!i)};S.include=S.contains=function(e,t){var n=!1;return e==null?n:g&&e.indexOf===g?e.indexOf(t)!=-1:(n=T(e,function(e){return e===t}),n)},S.invoke=function(e,t){var n=o.call(arguments,2);return S.map(e,function(e){return(S.isFunction(t)?t||e:e[t]).apply(e,n)})},S.pluck=function(e,t){return S.map(e,function(e){return e[t]})},S.max=function(e,t,n){if(!t&&S.isArray(e)&&e[0]===+e[0])return Math.max.apply(Math,e);if(!t&&S.isEmpty(e))return-Infinity;var r={computed:-Infinity};return x(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o>=r.computed&&(r={value:e,computed:o})}),r.value},S.min=function(e,t,n){if(!t&&S.isArray(e)&&e[0]===+e[0])return Math.min.apply(Math,e);if(!t&&S.isEmpty(e))return Infinity;var r={computed:Infinity};return x(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o<r.computed&&(r={value:e,computed:o})}),r.value},S.shuffle=function(e){var t=[],n;return x(e,function(e,r,i){n=Math.floor(Math.random()*(r+1)),t[r]=t[n],t[n]=e}),t},S.sortBy=function(e,t,n){var r=S.isFunction(t)?t:function(e){return e[t]};return S.pluck(S.map(e,function(e,t,i){return{value:e,criteria:r.call(n,e,t,i)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;return n===void 0?1:r===void 0?-1:n<r?-1:n>r?1:0}),"value")},S.groupBy=function(e,t){var n={},r=S.isFunction(t)?t:function(e){return e[t]};return x(e,function(e,t){var i=r(e,t);(n[i]||(n[i]=[])).push(e)}),n},S.sortedIndex=function(e,t,n){n||(n=S.identity);var r=0,i=e.length;while(r<i){var s=r+i>>1;n(e[s])<n(t)?r=s+1:i=s}return r},S.toArray=function(e){return e?S.isArray(e)?o.call(e):S.isArguments(e)?o.call(e):e.toArray&&S.isFunction(e.toArray)?e.toArray():S.values(e):[]},S.size=function(e){return S.isArray(e)?e.length:S.keys(e).length},S.first=S.head=S.take=function(e,t,n){return t!=null&&!n?o.call(e,0,t):e[0]},S.initial=function(e,t,n){return o.call(e,0,e.length-(t==null||n?1:t))},S.last=function(e,t,n){return t!=null&&!n?o.call(e,Math.max(e.length-t,0)):e[e.length-1]},S.rest=S.tail=function(e,t,n){return o.call(e,t==null||n?1:t)},S.compact=function(e){return S.filter(e,function(e){return!!e})},S.flatten=function(e,t){return S.reduce(e,function(e,n){return S.isArray(n)?e.concat(t?n:S.flatten(n)):(e[e.length]=n,e)},[])},S.without=function(e){return S.difference(e,o.call(arguments,1))},S.uniq=S.unique=function(e,t,n){var r=n?S.map(e,n):e,i=[];return e.length<3&&(t=!0),S.reduce(r,function(n,r,s){if(t?S.last(n)!==r||!n.length:!S.include(n,r))n.push(r),i.push(e[s]);return n},[]),i},S.union=function(){return S.uniq(S.flatten(arguments,!0))},S.intersection=S.intersect=function(e){var t=o.call(arguments,1);return S.filter(S.uniq(e),function(e){return S.every(t,function(t){return S.indexOf(t,e)>=0})})},S.difference=function(e){var t=S.flatten(o.call(arguments,1),!0);return S.filter(e,function(e){return!S.include(t,e)})},S.zip=function(){var e=o.call(arguments),t=S.max(S.pluck(e,"length")),n=new Array(t);for(var r=0;r<t;r++)n[r]=S.pluck(e,""+r);return n},S.indexOf=function(e,t,n){if(e==null)return-1;var r,i;if(n)return r=S.sortedIndex(e,t),e[r]===t?r:-1;if(g&&e.indexOf===g)return e.indexOf(t);for(r=0,i=e.length;r<i;r++)if(r in e&&e[r]===t)return r;return-1},S.lastIndexOf=function(e,t){if(e==null)return-1;if(y&&e.lastIndexOf===y)return e.lastIndexOf(t);var n=e.length;while(n--)if(n in e&&e[n]===t)return n;return-1},S.range=function(e,t,n){arguments.length<=1&&(t=e||0,e=0),n=arguments[2]||1;var r=Math.max(Math.ceil((t-e)/n),0),i=0,s=new Array(r);while(i<r)s[i++]=e,e+=n;return s};var N=function(){};S.bind=function(t,n){var r,i;if(t.bind===E&&E)return E.apply(t,o.call(arguments,1));if(!S.isFunction(t))throw new TypeError;return i=o.call(arguments,2),r=function(){if(this instanceof r){N.prototype=t.prototype;var e=new N,s=t.apply(e,i.concat(o.call(arguments)));return Object(s)===s?s:e}return t.apply(n,i.concat(o.call(arguments)))}},S.bindAll=function(e){var t=o.call(arguments,1);return t.length==0&&(t=S.functions(e)),x(t,function(t){e[t]=S.bind(e[t],e)}),e},S.memoize=function(e,t){var n={};return t||(t=S.identity),function(){var r=t.apply(this,arguments);return S.has(n,r)?n[r]:n[r]=e.apply(this,arguments)}},S.delay=function(e,t){var n=o.call(arguments,2);return setTimeout(function(){return e.apply(null,n)},t)},S.defer=function(e){return S.delay.apply(S,[e,1].concat(o.call(arguments,1)))},S.throttle=function(e,t){var n,r,i,s,o,u,a=S.debounce(function(){o=s=!1},t);return function(){n=this,r=arguments;var f=function(){i=null,o&&e.apply(n,r),a()};return i||(i=setTimeout(f,t)),s?o=!0:u=e.apply(n,r),a(),s=!0,u}},S.debounce=function(e,t,n){var r;return function(){var i=this,s=arguments,o=function(){r=null,n||e.apply(i,s)};n&&!r&&e.apply(i,s),clearTimeout(r),r=setTimeout(o,t)}},S.once=function(e){var t=!1,n;return function(){return t?n:(t=!0,n=e.apply(this,arguments))}},S.wrap=function(e,t){return function(){var n=[e].concat(o.call(arguments,0));return t.apply(this,n)}},S.compose=function(){var e=arguments;return function(){var t=arguments;for(var n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},S.after=function(e,t){return e<=0?t():function(){if(--e<1)return t.apply(this,arguments)}},S.keys=w||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var n in e)S.has(e,n)&&(t[t.length]=n);return t},S.values=function(e){return S.map(e,S.identity)},S.functions=S.methods=function(e){var t=[];for(var n in e)S.isFunction(e[n])&&t.push(n);return t.sort()},S.extend=function(e){return x(o.call(arguments,1),function(t){for(var n in t)e[n]=t[n]}),e},S.pick=function(e){var t={};return x(S.flatten(o.call(arguments,1)),function(n){n in e&&(t[n]=e[n])}),t},S.defaults=function(e){return x(o.call(arguments,1),function(t){for(var n in t)e[n]==null&&(e[n]=t[n])}),e},S.clone=function(e){return S.isObject(e)?S.isArray(e)?e.slice():S.extend({},e):e},S.tap=function(e,t){return t(e),e},S.isEqual=function(e,t){return C(e,t,[])},S.isEmpty=function(e){if(e==null)return!0;if(S.isArray(e)||S.isString(e))return e.length===0;for(var t in e)if(S.has(e,t))return!1;return!0},S.isElement=function(e){return!!e&&e.nodeType==1},S.isArray=b||function(e){return a.call(e)=="[object Array]"},S.isObject=function(e){return e===Object(e)},S.isArguments=function(e){return a.call(e)=="[object Arguments]"},S.isArguments(arguments)||(S.isArguments=function(e){return!!e&&!!S.has(e,"callee")}),S.isFunction=function(e){return a.call(e)=="[object Function]"},S.isString=function(e){return a.call(e)=="[object String]"},S.isNumber=function(e){return a.call(e)=="[object Number]"},S.isFinite=function(e){return S.isNumber(e)&&isFinite(e)},S.isNaN=function(e){return e!==e},S.isBoolean=function(e){return e===!0||e===!1||a.call(e)=="[object Boolean]"},S.isDate=function(e){return a.call(e)=="[object Date]"},S.isRegExp=function(e){return a.call(e)=="[object RegExp]"},S.isNull=function(e){return e===null},S.isUndefined=function(e){return e===void 0},S.has=function(e,t){return f.call(e,t)},S.noConflict=function(){return e._=t,this},S.identity=function(e){return e},S.times=function(e,t,n){for(var r=0;r<e;r++)t.call(n,r)},S.escape=function(e){return(""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},S.result=function(e,t){if(e==null)return null;var n=e[t];return S.isFunction(n)?n.call(e):n},S.mixin=function(e){x(S.functions(e),function(t){B(t,S[t]=e[t])})};var k=0;S.uniqueId=function(e){var t=k++;return e?e+t:t},S.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var L=/.^/,A={"\\":"\\","'":"'",r:"\r",n:"\n",t:"	",u2028:"\u2028",u2029:"\u2029"};for(var O in A)A[A[O]]=O;var M=/\\|'|\r|\n|\t|\u2028|\u2029/g,_=/\\(\\|'|r|n|t|u2028|u2029)/g,D=function(e){return e.replace(_,function(e,t){return A[t]})};S.template=function(e,t,n){n=S.defaults(n||{},S.templateSettings);var r="__p+='"+e.replace(M,function(e){return"\\"+A[e]}).replace(n.escape||L,function(e,t){return"'+\n_.escape("+D(t)+")+\n'"}).replace(n.interpolate||L,function(e,t){return"'+\n("+D(t)+")+\n'"}).replace(n.evaluate||L,function(e,t){return"';\n"+D(t)+"\n;__p+='"})+"';\n";n.variable||(r="with(obj||{}){\n"+r+"}\n"),r="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+r+"return __p;\n";var i=new Function(n.variable||"obj","_",r);if(t)return i(t,S);var s=function(e){return i.call(this,e,S)};return s.source="function("+(n.variable||"obj")+"){\n"+r+"}",s},S.chain=function(e){return S(e).chain()};var P=function(e){this._wrapped=e};S.prototype=P.prototype;var H=function(e,t){return t?S(e).chain():e},B=function(e,t){P.prototype[e]=function(){var e=o.call(arguments);return u.call(e,this._wrapped),H(t.apply(S,e),this._chain)}};S.mixin(S),x(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=r[e];P.prototype[e]=function(){var n=this._wrapped;t.apply(n,arguments);var r=n.length;return(e=="shift"||e=="splice")&&r===0&&delete n[0],H(n,this._chain)}}),x(["concat","join","slice"],function(e){var t=r[e];P.prototype[e]=function(){return H(t.apply(this._wrapped,arguments),this._chain)}}),P.prototype.chain=function(){return this._chain=!0,this},P.prototype.value=function(){return this._wrapped}}.call(this),function(e){e.Parse=e.Parse||{};var t=e.Parse;typeof exports!="undefined"&&exports._?(t._=exports._.noConflict(),t.localStorage=require("localStorage"),t.XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,exports.Parse=t):(t._=_.noConflict(),typeof localStorage!="undefined"&&(t.localStorage=localStorage),typeof XMLHttpRequest!="undefined"&&(t.XMLHttpRequest=XMLHttpRequest)),typeof $!="undefined"&&(t.$=$);var n=function(){},r=function(e,r,i){var s;return r&&r.hasOwnProperty("constructor")?s=r.constructor:s=function(){e.apply(this,arguments)},t._.extend(s,e),n.prototype=e.prototype,s.prototype=new n,r&&t._.extend(s.prototype,r),i&&t._.extend(s,i),s.prototype.constructor=s,s.__super__=e.prototype,s};t.serverURL="https://api.parse.com",t.initialize=function(e,n){t._initialize(e,n)},t._initialize=function(e,n,r){t.applicationId=e,t.javaScriptKey=n,t.masterKey=r,t._useMasterKey=!1},t._getParsePath=function(e){if(!t.applicationId)throw"You need to call Parse.initialize before using Parse.";e||(e="");if(!t._.isString(e))throw"Tried to get a localStorage path that wasn't a String.";return e[0]==="/"&&(e=e.substring(1)),"Parse/"+t.applicationId+"/"+e},t._installationId=null,t._getInstallationId=function(){if(t._installationId)return t._installationId;var e=t._getParsePath("installationId");t._installationId=t.localStorage.getItem(e);if(!t._installationId||t._installationId===""){var n=function(){return Math.floor((1+Math.random())*65536).toString(16).substring(1)};t._installationId=n()+n()+"-"+n()+"-"+n()+"-"+n()+"-"+n()+n()+n(),t.localStorage.setItem(e,t._installationId)}return t._installationId},t._parseDate=function(e){var t=new RegExp("^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})(.([0-9]+))?Z$"),n=t.exec(e);if(!n)return null;var r=n[1]||0,i=(n[2]||1)-1,s=n[3]||0,o=n[4]||0,u=n[5]||0,a=n[6]||0,f=n[8]||0;return new Date(Date.UTC(r,i,s,o,u,a,f))},t._ajaxIE8=function(e,t,n,r,i){var s=new XDomainRequest;s.onload=function(){var e;try{e=JSON.parse(s.responseText)}catch(t){i&&i(s)}e&&r&&r(e,s)},s.onerror=s.ontimeout=function(){i(s)},s.onprogress=function(){},s.open(e,t),s.send(n)},t._ajax=function(e,n,r,i,s){if(typeof XDomainRequest!="undefined")return t._ajaxIE8(e,n,r,i,s);var o=!1,u=new t.XMLHttpRequest;u.onreadystatechange=function(){if(u.readyState===4){if(o)return;o=!0;if(u.status>=200&&u.status<300){var e;try{e=JSON.parse(u.responseText)}catch(t){s&&s(u)}e&&i&&i(e,u)}else s&&s(u)}},u.open(e,n,!0),u.setRequestHeader("Content-Type","text/plain"),u.send(r)},t._extend=function(e,t){var n=r(this,e,t);return n.extend=this.extend,n},t._request=function(e,n,r,i,s,o){if(!t.applicationId)throw"You must specify your applicationId using Parse.initialize";if(!t.javaScriptKey&&!t.masterKey)throw"You must specify a key using Parse.initialize";if(e!=="classes"&&e!=="push"&&e!=="users"&&e!=="login"&&e!=="functions"&&e!=="requestPasswordReset")throw"First argument must be one of classes, users, functions, or login, not '"+e+"'.";var u=t.serverURL;u.charAt(u.length-1)!=="/"&&(u+="/"),u+="1/"+e,n&&(u+="/"+n),r&&(u+="/"+r),s=t._.clone(s||{}),i!=="POST"&&(s._method=i,i="POST"),s._ApplicationId=t.applicationId,t._useMasterKey?s._MasterKey=t.masterKey:s._JavaScriptKey=t.javaScriptKey,s._ClientVersion="js"+t.VERSION,s._InstallationId=t._getInstallationId();var a=t.User.current();a&&a._sessionToken&&(s._SessionToken=a._sessionToken);var f=JSON.stringify(s);t._ajax(i,u,f,o.success,o.error)},t._getValue=function(e,n){return!e||!e[n]?null:t._.isFunction(e[n])?e[n]():e[n]},t._encode=function(e,n,r){var i=t._;if(e instanceof t.Object){if(r)throw"Parse.Objects not allowed here";if(!n||i.include(n,e)||!e._hasData)return e._toPointer();if(!e.dirty())return n=n.concat(e),t._encode(e._toFullJSON(n),n,r);throw"Can't fully embed a dirty object"}if(e instanceof t.ACL)return e.toJSON();if(e instanceof Date)return{__type:"Date",iso:e.toJSON()};if(e instanceof t.GeoPoint)return e.toJSON();if(i.isArray(e))return i.map(e,function(e){return t._encode(e,n,r)});if(i.isRegExp(e))return e.source;if(e instanceof t.Relation)return e.toJSON();if(e instanceof t.Op)return e.toJSON();if(e instanceof Object){var s={};return t._each(e,function(e,i){s[i]=t._encode(e,n,r)}),s}return e},t._decode=function(e,n){var r=t._;if(!r.isObject(n))return n;if(r.isArray(n))return t._each(n,function(e,r){n[r]=t._decode(r,e)}),n;if(n instanceof t.Object)return n;if(n instanceof t.Op)return n;if(n.__op)return t.Op._decode(n);if(n.__type==="Pointer"){var i=t.Object._create(n.className);return i._finishFetch({objectId:n.objectId},!1),i}if(n.__type==="Object"){var s=n.className;delete n.__type,delete n.className;var o=t.Object._create(s);return o._finishFetch(n,!0),o}if(n.__type==="Date")return t._parseDate(n.iso);if(n.__type==="GeoPoint")return new t.GeoPoint({latitude:n.latitude,longitude:n.longitude});if(e==="ACL")return n instanceof t.ACL?n:new t.ACL(n);if(n.__type==="Relation"){var u=new t.Relation(null,e);return u.targetClassName=n.className,u}return t._each(n,function(e,r){n[r]=t._decode(r,e)}),n},t._each=function(e,n){var r=t._;r.isObject(e)?r.each(r.keys(e),function(t){n(e[t],t)}):r.each(e,n)},t._isNullOrUndefined=function(e){return t._.isNull(e)||t._.isUndefined(e)}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Error=function(e,t){this.code=e,this.message=t},n.extend(t.Error,{OTHER_CAUSE:-1,INTERNAL_SERVER_ERROR:1,CONNECTION_FAILED:100,OBJECT_NOT_FOUND:101,INVALID_QUERY:102,INVALID_CLASS_NAME:103,MISSING_OBJECT_ID:104,INVALID_KEY_NAME:105,INVALID_POINTER:106,INVALID_JSON:107,COMMAND_UNAVAILABLE:108,NOT_INITIALIZED:109,INCORRECT_TYPE:111,INVALID_CHANNEL_NAME:112,PUSH_MISCONFIGURED:115,OBJECT_TOO_LARGE:116,OPERATION_FORBIDDEN:119,CACHE_MISS:120,INVALID_NESTED_KEY:121,INVALID_FILE_NAME:122,INVALID_ACL:123,TIMEOUT:124,INVALID_EMAIL_ADDRESS:125,DUPLICATE_VALUE:137,INVALID_ROLE_NAME:139,EXCEEDED_QUOTA:140,SCRIPT_FAILED:141,VALIDATION_ERROR:142,USERNAME_MISSING:200,PASSWORD_MISSING:201,USERNAME_TAKEN:202,EMAIL_TAKEN:203,EMAIL_MISSING:204,EMAIL_NOT_FOUND:205,SESSION_MISSING:206,MUST_CREATE_USER_THROUGH_SIGNUP:207,ACCOUNT_ALREADY_LINKED:208,LINKED_ID_MISSING:250,INVALID_LINKED_SESSION:251,UNSUPPORTED_SERVICE:252})}(this),function(){var e=this,t=e.Parse||(e.Parse={}),n=/\s+/,r=Array.prototype.slice;t.Events={on:function(e,t,r){var i,s,o,u,a;if(!t)return this;e=e.split(n),i=this._callbacks||(this._callbacks={}),s=e.shift();while(s)a=i[s],o=a?a.tail:{},o.next=u={},o.context=r,o.callback=t,i[s]={tail:u,next:a?a.next:o},s=e.shift();return this},off:function(e,t,r){var i,s,o,u,a,f;if(!(s=this._callbacks))return;if(!(e||t||r))return delete this._callbacks,this;e=e?e.split(n):_.keys(s),i=e.shift();while(i){o=s[i],delete s[i];if(!o||!t&&!r)continue;u=o.tail,o=o.next;while(o!==u)a=o.callback,f=o.context,(t&&a!==t||r&&f!==r)&&this.on(i,a,f),o=o.next;i=e.shift()}return this},trigger:function(e){var t,i,s,o,u,a,f;if(!(s=this._callbacks))return this;a=s.all,e=e.split(n),f=r.call(arguments,1),t=e.shift();while(t){i=s[t];if(i){o=i.tail;while((i=i.next)!==o)i.callback.apply(i.context||this,f)}i=a;if(i){o=i.tail,u=[t].concat(f);while((i=i.next)!==o)i.callback.apply(i.context||this,u)}t=e.shift()}return this}},t.Events.bind=t.Events.on,t.Events.unbind=t.Events.off}.call(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.GeoPoint=function(e,r){n.isArray(e)?(t.GeoPoint._validate(e[0],e[1]),this.latitude=e[0],this.longitude=e[1]):n.isObject(e)?(t.GeoPoint._validate(e.latitude,e.longitude),this.latitude=e.latitude,this.longitude=e.longitude):n.isNumber(e)&&n.isNumber(r)?(t.GeoPoint._validate(e,r),this.latitude=e,this.longitude=r):(this.latitude=0,this.longitude=0);var i=this;this.__defineGetter__&&this.__defineSetter__&&(this._latitude=this.latitude,this._longitude=this.longitude,this.__defineGetter__("latitude",function(){return i._latitude}),this.__defineGetter__("longitude",function(){return i._longitude}),this.__defineSetter__("latitude",function(e){t.GeoPoint._validate(e,i.longitude),i._latitude=e}),this.__defineSetter__("longitude",function(e){t.GeoPoint._validate(i.latitude,e),i._longitude=e}))},t.GeoPoint._validate=function(e,t){if(e<-90)throw"Parse.GeoPoint latitude "+e+" < -90.0.";if(e>90)throw"Parse.GeoPoint latitude "+e+" > 90.0.";if(t<-180)throw"Parse.GeoPoint longitude "+t+" < -180.0.";if(t>180)throw"Parse.GeoPoint longitude "+t+" > 180.0."},t.GeoPoint.current=function(e){var n=function(n){e.success&&e.success(new t.GeoPoint({latitude:n.coords.latitude,longitude:n.coords.longitude}))},r=function(t){e.error&&e.error(t)};navigator.geolocation.getCurrentPosition(n,r)},t.GeoPoint.prototype={toJSON:function(){return t.GeoPoint._validate(this.latitude,this.longitude),{__type:"GeoPoint",latitude:this.latitude,longitude:this.longitude}},radiansTo:function(e){var t=Math.PI/180,n=this.latitude*t,r=this.longitude*t,i=e.latitude*t,s=e.longitude*t,o=n-i,u=r-s,a=Math.sin(o/2),f=Math.sin(u/2),l=a*a+Math.cos(n)*Math.cos(i)*f*f;return l=Math.min(1,l),2*Math.asin(Math.sqrt(l))},kilometersTo:function(e){return this.radiansTo(e)*6371},milesTo:function(e){return this.radiansTo(e)*3958.8}}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._,r="*";t.ACL=function(e){var r=this;r.permissionsById={};if(n.isObject(e))if(e instanceof t.User)r.setReadAccess(e,!0),r.setWriteAccess(e,!0);else{if(n.isFunction(e))throw"Parse.ACL() called with a function.  Did you forget ()?";t._each(e,function(e,i){if(!n.isString(i))throw"Tried to create an ACL with an invalid userId.";r.permissionsById[i]={},t._each(e,function(e,t){if(t!=="read"&&t!=="write")throw"Tried to create an ACL with an invalid permission type.";if(!n.isBoolean(e))throw"Tried to create an ACL with an invalid permission value.";r.permissionsById[i][t]=e})})}},t.ACL.prototype.toJSON=function(){return n.clone(this.permissionsById)},t.ACL.prototype._setAccess=function(e,r,i){r instanceof t.User?r=r.id:r instanceof t.Role&&(r="role:"+r.getName());if(!n.isString(r))throw"userId must be a string.";if(!n.isBoolean(i))throw"allowed must be either true or false.";var s=this.permissionsById[r];if(!s){if(!i)return;s={},this.permissionsById[r]=s}i?this.permissionsById[r][e]=!0:(delete s[e],n.isEmpty(s)&&delete s[r])},t.ACL.prototype._getAccess=function(e,n){n instanceof t.User?n=n.id:n instanceof t.Role&&(n="role:"+n.getName());var r=this.permissionsById[n];return r?r[e]?!0:!1:!1},t.ACL.prototype.setReadAccess=function(e,t){this._setAccess("read",e,t)},t.ACL.prototype.getReadAccess=function(e){return this._getAccess("read",e)},t.ACL.prototype.setWriteAccess=function(e,t){this._setAccess("write",e,t)},t.ACL.prototype.getWriteAccess=function(e){return this._getAccess("write",e)},t.ACL.prototype.setPublicReadAccess=function(e){this.setReadAccess(r,e)},t.ACL.prototype.getPublicReadAccess=function(){return this.getReadAccess(r)},t.ACL.prototype.setPublicWriteAccess=function(e){this.setWriteAccess(r,e)},t.ACL.prototype.getPublicWriteAccess=function(){return this.getWriteAccess(r)},t.ACL.prototype.getRoleReadAccess=function(e){e instanceof t.Role&&(e=e.getName());if(n.isString(e))return this.getReadAccess("role:"+e);throw"role must be a Parse.Role or a String"},t.ACL.prototype.getRoleWriteAccess=function(e){e instanceof t.Role&&(e=e.getName());if(n.isString(e))return this.getWriteAccess("role:"+e);throw"role must be a Parse.Role or a String"},t.ACL.prototype.setRoleReadAccess=function(e,r){e instanceof t.Role&&(e=e.getName());if(n.isString(e)){this.setReadAccess("role:"+e,r);return}throw"role must be a Parse.Role or a String"},t.ACL.prototype.setRoleWriteAccess=function(e,r){e instanceof t.Role&&(e=e.getName());if(n.isString(e)){this.setWriteAccess("role:"+e,r);return}throw"role must be a Parse.Role or a String"}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Op=function(){this._initialize.apply(this,arguments)},t.Op.prototype={_initialize:function(){}},n.extend(t.Op,{_extend:t._extend,_opDecoderMap:{},_registerDecoder:function(e,n){t.Op._opDecoderMap[e]=n},_decode:function(e){var n=t.Op._opDecoderMap[e.__op];return n?n(e):undefined}}),t.Op._registerDecoder("Batch",function(e){var r=null;return n.each(e.ops,function(e){e=t.Op._decode(e),r=e._mergeWithPrevious(r)}),r}),t.Op.Set=t.Op._extend({_initialize:function(e){this._value=e},value:function(){return this._value},toJSON:function(){return t._encode(this.value())},_mergeWithPrevious:function(e){return this},_estimate:function(e){return this.value()}}),t.Op._UNSET={},t.Op.Unset=t.Op._extend({toJSON:function(){return{__op:"Delete"}},_mergeWithPrevious:function(e){return this},_estimate:function(e){return t.Op._UNSET}}),t.Op._registerDecoder("Delete",function(e){return new t.Op.Unset}),t.Op.Increment=t.Op._extend({_initialize:function(e){this._amount=e},amount:function(){return this._amount},toJSON:function(){return{__op:"Increment",amount:this._amount}},_mergeWithPrevious:function(e){if(!e)return this;if(e instanceof t.Op.Unset)return new t.Op.Set(this.amount());if(e instanceof t.Op.Set)return new t.Op.Set(e.value()+this.amount());if(e instanceof t.Op.Increment)return new t.Op.Increment(this.amount()+e.amount());throw"Op is invalid after previous op."},_estimate:function(e){return e?e+this.amount():this.amount()}}),t.Op._registerDecoder("Increment",function(e){return new t.Op.Increment(e.amount)}),t.Op.Add=t.Op._extend({_initialize:function(e){this._objects=e},objects:function(){return this._objects},toJSON:function(){return{__op:"Add",objects:t._encode(this.objects())}},_mergeWithPrevious:function(e){if(!e)return this;if(e instanceof t.Op.Unset)return new t.Op.Set(this.objects());if(e instanceof t.Op.Set)return new t.Op.Set(this._estimate(e.value()));if(e instanceof t.Op.Add)return new t.Op.Add(e.objects().concat(this.objects()));throw"Op is invalid after previous op."},_estimate:function(e){return e?e.concat(this.objects()):n.clone(this.objects())}}),t.Op._registerDecoder("Add",function(e){return new t.Op.Add(t._decode(undefined,e.objects))}),t.Op.AddUnique=t.Op._extend({_initialize:function(e){this._objects=n.uniq(e)},objects:function(){return this._objects},toJSON:function(){return{__op:"AddUnique",objects:t._encode(this.objects())}},_mergeWithPrevious:function(e){if(!e)return this;if(e instanceof t.Op.Unset)return new t.Op.Set(this.objects());if(e instanceof t.Op.Set)return new t.Op.Set(this._estimate(e.value()));if(e instanceof t.Op.AddUnique)return new t.Op.AddUnique(n.union(e.objects(),this.objects()));throw"Op is invalid after previous op."},_estimate:function(e){return e?e.concat(n.difference(this.objects(),e)):n.clone(this.objects())}}),t.Op._registerDecoder("AddUnique",function(e){return new t.Op.AddUnique(t._decode(undefined,e.objects))}),t.Op.Remove=t.Op._extend({_initialize:function(e){this._objects=n.uniq(e)},objects:function(){return this._objects},toJSON:function(){return{__op:"Remove",objects:t._encode(this.objects())}},_mergeWithPrevious:function(e){if(!e)return this;if(e instanceof t.Op.Unset)return e;if(e instanceof t.Op.Set)return new t.Op.Set(this._estimate(e.value()));if(e instanceof t.Op.Remove)return new t.Op.Remove(n.union(e.objects(),this.objects()));throw"Op is invalid after previous op."},_estimate:function(e){return e?n.difference(e,this.objects()):[]}}),t.Op._registerDecoder("Remove",function(e){return new t.Op.Remove(t._decode(undefined,e.objects))}),t.Op.Relation=t.Op._extend({_initialize:function(e,r){this._targetClassName=null;var i=this,s=function(e){if(e instanceof t.Object){if(!e.id)throw"You can't add an unsaved Parse.Object to a relation.";i._targetClassName||(i._targetClassName=e.className);if(i._targetClassName!==e.className)throw"Tried to create a Parse.Relation with 2 different types: "+i._targetClassName+" and "+e.className+".";return e.id}return e};this.relationsToAdd=n.uniq(n.map(e,s)),this.relationsToRemove=n.uniq(n.map(r,s))},added:function(){var e=this;return n.map(this.relationsToAdd,function(n){var r=t.Object._create(e._targetClassName);return r.id=n,r})},removed:function(){var e=this;return n.map(this.relationsToRemove,function(n){var r=t.Object._create(e._targetClassName);return r.id=n,r})},toJSON:function(){var e=null,t=null,r=this,i=function(e){return{__type:"Pointer",className:r._targetClassName,objectId:e}},s=null;return this.relationsToAdd.length>0&&(s=n.map(this.relationsToAdd,i),e={__op:"AddRelation",objects:s}),this.relationsToRemove.length>0&&(s=n.map(this.relationsToRemove,i),t={__op:"RemoveRelation",objects:s}),e&&t?{__op:"Batch",ops:[e,t]}:e||t||{}},_mergeWithPrevious:function(e){if(!e)return this;if(e instanceof t.Op.Unset)throw"You can't modify a relation after deleting it.";if(e instanceof t.Op.Relation){if(e._targetClassName&&e._targetClassName!==this._targetClassName)throw"Related object must be of class "+e._targetClassName+", but "+this._targetClassName+" was passed in.";var r=n.union(n.difference(e.relationsToAdd,this.relationsToRemove),this.relationsToAdd),i=n.union(n.difference(e.relationsToRemove,this.relationsToAdd),this.relationsToRemove),s=new t.Op.Relation(r,i);return s._targetClassName=this._targetClassName,s}throw"Op is invalid after previous op."},_estimate:function(e,n,r){if(!!e){if(e instanceof t.Relation){if(this._targetClassName)if(e.targetClassName){if(e.targetClassName!==this._targetClassName)throw"Related object must be a "+e.targetClassName+", but a "+this._targetClassName+" was passed in."}else e.targetClassName=this._targetClassName;return e}throw"Op is invalid after previous op."}var i=new t.Relation(n,r);i.targetClassName=this._targetClassName}}),t.Op._registerDecoder("AddRelation",function(e){return new t.Op.Relation(t._decode(undefined,e.objects),[])}),t.Op._registerDecoder("RemoveRelation",function(e){return new t.Op.Relation([],t._decode(undefined,e.objects))})}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Relation=function(e,t){this.parent=e,this.key=t,this.targetClassName=null},t.Relation.prototype={_ensureParentAndKey:function(e,t){this.parent=this.parent||e,this.key=this.key||t;if(this.parent!==e)throw"Internal Error. Relation retrieved from two different Objects.";if(this.key!==t)throw"Internal Error. Relation retrieved from two different keys."},add:function(e){n.isArray(e)||(e=[e]);var r=new t.Op.Relation(e,[]);this.parent.set(this.key,r),this.targetClassName=r._targetClassName},remove:function(e){n.isArray(e)||(e=[e]);var r=new t.Op.Relation([],e);this.parent.set(this.key,r),this.targetClassName=r._targetClassName},toJSON:function(){return{__type:"Relation",className:this.targetClassName}},query:function(){var e=t.Object._getSubclass(this.targetClassName),n=new t.Query(e);return n._addCondition("$relatedTo","object",this.parent._toPointer()),n._addCondition("$relatedTo","key",this.key),n}}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Object=function(e,r){if(n.isString(e))return t.Object._create.apply(this,arguments);e=e||{},r&&r.parse&&(e=this.parse(e));var i=t._getValue(this,"defaults");i&&(e=n.extend({},i,e)),r&&r.collection&&(this.collection=r.collection),this._serverData={},this._opSetQueue=[{}],this.attributes={},this._hashedJSON={},this._escapedAttributes={},this.cid=n.uniqueId("c"),this.changed={},this._silent={},this._pending={};if(!this.set(e,{silent:!0}))throw new Error("Can't create an invalid Parse.Object");this.changed={},this._silent={},this._pending={},this._hasData=!0,this._previousAttributes=n.clone(this.attributes),this.initialize.apply(this,arguments)};var r=function(e,t,i,s){i=i||[];var o;if(n.isFunction(s)){var u=s;o={success:function(e){u(e,null)},error:function(e){u(null,e)}}}else o=s;if(e.length){var a=o,f=o?n.clone(o):{};f.success=function(s,o){i.push(s),r(n.rest(e),t,i,a)},t.call(this,n.first(e),f)}else o.success&&o.success(i)};t.Object.saveAll=function(e,t){r(e,function(e,t){e.save(null,t)},[],t)},t.Object._signUpAll=function(e,t){r(e,function(e,t){e.signUp(null,t)},[],t)},n.extend(t.Object.prototype,t.Events,{_existed:!1,initialize:function(){},toJSON:function(){var e=this._toFullJSON();return n.each(["createdAt","objectId","updatedAt","__type","className"],function(t){delete e[t]}),e},_toFullJSON:function(e){var r=n.clone(this.attributes);return t._each(r,function(n,i){r[i]=t._encode(n,e)}),t._each(this._operations,function(e,t){r[t]=e}),r.objectId=this.id,r.createdAt=this.createdAt,r.updatedAt=this.updatedAt,r.__type="Object",r.className=this.className,r},_refreshCache:function(){var e=this;t._each(this.attributes,function(r,i){r instanceof t.Object?r._refreshCache():n.isObject(r)&&e._resetCacheForKey(i)&&e.set(i,new t.Op.Set(r),{silent:!0})})},dirty:function(e){this._refreshCache();var t=n.last(this._opSetQueue);return e?t[e]?!0:!1:this.id?n.keys(t).length>0?!0:!1:!0},_toPointer:function(){if(!this.id)throw new Error("Can't serialize an unsaved Parse.Object");return{__type:"Pointer",className:this.className,objectId:this.id}},get:function(e){return this.attributes[e]},relation:function(e){var n=this.get(e);if(n){if(n instanceof t.Relation)return n._ensureParentAndKey(this,e),n;throw"Called relation() on non-relation field "+e}return new t.Relation(this,e)},escape:function(e){var r=this._escapedAttributes[e];if(r)return r;var i=this.attributes[e],s;return t._isNullOrUndefined(i)?s="":s=n.escape(i.toString()),this._escapedAttributes[e]=s,s},has:function(e){return!t._isNullOrUndefined(this.attributes[e])},_mergeMagicFields:function(e){var t=this;n.each(["id","objectId","createdAt","updatedAt"],function(n){e[n]&&(n==="objectId"?t.id=e[n]:t[n]=e[n],delete e[n])})},_startSave:function(){this._opSetQueue.push({})},_processSaveQueue:function(){if(this._saveQueue&&this._saveQueue.length>0){var e=n.first(this._saveQueue);this._saveQueue=n.rest(this._saveQueue),e()}else this._saving=!1},_cancelSave:function(){var e=this,r=n.first(this._opSetQueue);this._opSetQueue=n.rest(this._opSetQueue);var i=n.first(this._opSetQueue);t._each(r,function(e,t){var n=r[t],s=i[t];n&&s?i[t]=s._mergeWithPrevious(n):n&&(i[t]=n)}),this._processSaveQueue()},_finishSave:function(e){var r=n.first(this._opSetQueue);this._opSetQueue=n.rest(this._opSetQueue),this._applyOpSet(r,this._serverData),this._mergeMagicFields(e);var i=this;t._each(e,function(e,n){i._serverData[n]=t._decode(n,e)}),this._rebuildAllEstimatedData(),this._processSaveQueue()},_finishFetch:function(e,n){this._opSetQueue=[{}],this._mergeMagicFields(e);var r=this;t._each(e,function(e,n){r._serverData[n]=t._decode(n,e)}),this._rebuildAllEstimatedData(),this._refreshCache(),this._opSetQueue=[{}],this._hasData=n},_applyOpSet:function(e,n){var r=this;t._.each(e,function(e,i){n[i]=e._estimate(n[i],r,i),n[i]===t.Op._UNSET&&delete n[i]})},_resetCacheForKey:function(e){var r=this.attributes[e];if(n.isObject(r)&&!(r instanceof t.Object)){r=r.toJSON?r.toJSON():r;var i=JSON.stringify(r);if(this._hashedJSON[e]!==i)return this._hashedJSON[e]=i,!0}return!1},_rebuildEstimatedDataForKey:function(e){var r=this;delete this.attributes[e],this._serverData[e]&&(this.attributes[e]=this._serverData[e]),n.each(this._opSetQueue,function(n){var i=n[e];i&&(r.attributes[e]=i._estimate(r.attributes[e],r,e),r.attributes[e]===t.Op._UNSET?delete r.attributes[e]:r._resetCacheForKey(e))})},_rebuildAllEstimatedData:function(){var e=this;this.attributes=n.clone(this._serverData),n.each(this._opSetQueue,function(t){e._applyOpSet(t,e.attributes),n.each(t,function(t,n){e._resetCacheForKey(n)})})},set:function(e,r,i){var s,o;n.isObject(e)||t._isNullOrUndefined(e)?(s=e,t._each(s,function(e,n){s[n]=t._decode(n,e)}),i=r):(s={},s[e]=t._decode(e,r)),i=i||{};if(!s)return this;s instanceof t.Object&&(s=s.attributes),i.unset&&t._each(s,function(e,n){s[n]=new t.Op.Unset});var u=n.clone(s),a=this;t._each(u,function(e,n){e instanceof t.Op&&(u[n]=e._estimate(a.attributes[n],a,n),u[n]===t.Op._UNSET&&delete u[n])});if(!this._validate(s,i))return!1;this._mergeMagicFields(s),i.changes={};var f=this._escapedAttributes,l=this._previousAttributes||{};return t._each(n.keys(s),function(e){var r=s[e];r instanceof t.Relation&&(r.parent=a),r instanceof t.Op||(r=new t.Op.Set(r));var o=!0;r instanceof t.Op.Set&&n.isEqual(a.attributes[e],r.value)&&(o=!1),o&&(delete f[e],i.silent?a._silent[e]=!0:i.changes[e]=!0);var u=n.last(a._opSetQueue);u[e]=r._mergeWithPrevious(u[e]),a._rebuildEstimatedDataForKey(e),o?(a.changed[e]=a.attributes[e],i.silent||(a._pending[e]=!0)):(delete a.changed[e],delete a._pending[e])}),i.silent||this.change(i),this},unset:function(e,t){return t=t||{},t.unset=!0,this.set(e,null,t)},increment:function(e,r){if(n.isUndefined(r)||n.isNull(r))r=1;return this.set(e,new t.Op.Increment(r))},add:function(e,n){return this.set(e,new t.Op.Add([n]))},addUnique:function(e,n){return this.set(e,new t.Op.AddUnique([n]))},remove:function(e,n){return this.set(e,new t.Op.Remove([n]))},op:function(e){return n.last(this._opSetQueue)[e]},clear:function(e){e=e||{},e.unset=!0;var t=n.extend(this.attributes,this._operations);return this.set(t,e)},_getSaveJSON:function(){var e=n.clone(n.first(this._opSetQueue));return t._each(e,function(t,n){e[n]=t.toJSON()}),e},fetch:function(e){e=e?n.clone(e):{};var r=this,i=e.success;e.success=function(e,t,n){r._finishFetch(r.parse(e,t,n),!0),i&&i(r,e)},e.error=t.Object._wrapError(e.error,r,e),t._request("classes",r.className,r.id,"GET",null,e)},save:function(e,r,i){var s,o,u,a,f;n.isObject(e)||t._isNullOrUndefined(e)?(o=e,a=r):(o={},o[e]=r,a=i);if(!a&&o){var l=n.reject(o,function(e,t){return n.include(["success","error","wait"],t)});if(l.length===0){var c=!0;n.has(o,"success")&&!n.isFunction(o.success)&&(c=!1),n.has(o,"error")&&!n.isFunction(o.error)&&(c=!1);if(c)return this.save(null,o)}}a=a?n.clone(a):{},a.wait&&(u=n.clone(this.attributes));var h=n.extend({},a,{silent:!0});if(o&&!this.set(o,a.wait?h:a))return!1;var p=a,d=n.clone(a),v=this;v._refreshCache();var m=t.Object._findUnsavedChildren(v.attributes);if(m.length>0)return t.Object.saveAll(m,{success:function(e){v.save(null,p)},error:function(e){a.error&&a.error.apply(this,arguments)}}),this;d.success=function(e,t,r){var i=v.parse(e,t,r);d.wait&&(i=n.extend(o||{},i)),v._finishSave(i),p.success?p.success(v,e):v.trigger("sync",v,e,d)},d.error=function(){v._cancelSave(),p.error&&p.error.apply(this,arguments)},d.error=t.Object._wrapError(d.error,v,d),this._startSave();var g=function(){var e=v.id?"PUT":"POST",n=v._getSaveJSON(),r="classes",i=v.className;v.className==="_User"&&!v.id&&(r="users",i=null),t._request(r,i,v.id,e,n,d),d.wait&&v.set(u,h)};return this._saving?(this._saveQueue=this._saveQueue||[],this._saveQueue.push(g)):(this._saving=!0,g()),this},destroy:function(e){e=e?n.clone(e):{};var r=this,i=e.success,s=function(){r.trigger("destroy",r,r.collection,e)};if(!this.id)return s();e.success=function(t){e.wait&&s(),i?i(r,t):r.trigger("sync",r,t,e)},e.error=t.Object._wrapError(e.error,r,e),t._request("classes",this.className,this.id,"DELETE",null,e),e.wait||s()},parse:function(e,r,i){var s=n.clone(e);return n(["createdAt","updatedAt"]).each(function(e){s[e]&&(s[e]=t._parseDate(s[e]))}),s.updatedAt||(s.updatedAt=s.createdAt),r&&(this._existed=r.status!==201),s},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.id},change:function(e){e=e||{};var r=this._changing;this._changing=!0;var i=this;t._each(this._silent,function(e){i._pending[e]=!0});var s=n.extend({},e.changes,this._silent);this._silent={},t._each(s,function(t,n){i.trigger("change:"+n,i,i.get(n),e)});if(r)return this;var o=function(e){!i._pending[e]&&!i._silent[e]&&delete i.changed[e]};while(!n.isEmpty(this._pending))this._pending={},this.trigger("change",this,e),t._each(this.changed,o),i._previousAttributes=n.clone(this.attributes);return this._changing=!1,this},existed:function(){return this._existed},hasChanged:function(e){return arguments.length?this._changed&&n.has(this._changed,e):!n.isEmpty(this._changed)},changedAttributes:function(e){if(!e)return this.hasChanged()?n.clone(this._changed):!1;var r={},i=this._previousAttributes;return t._each(e,function(e,t){n.isEqual(i[t],e)||(r[t]=e)}),r},previous:function(e){return!arguments.length||!this._previousAttributes?null:this._previousAttributes[e]},previousAttributes:function(){return n.clone(this._previousAttributes)},isValid:function(){return!this.validate(this.attributes)},validate:function(e,r){return!n.has(e,"ACL")||e.ACL instanceof t.ACL?!1:new t.Error(t.Error.OTHER_CAUSE,"ACL must be a Parse.ACL.")},_validate:function(e,t){if(t.silent||!this.validate)return!0;e=n.extend({},this.attributes,e);var r=this.validate(e,t);return r?(t&&t.error?t.error(this,r,t):this.trigger("error",this,r,t),!1):!0},getACL:function(){return this.get("ACL")},setACL:function(e,t){return this.set("ACL",e,t)}}),t.Object._getSubclass=function(e){if(!n.isString(e))throw"Parse.Object._getSubclass requires a string argument.";var r=t.Object._classMap[e];return r||(r=t.Object.extend(e),t.Object._classMap[e]=r),r},t.Object._create=function(e,n,r){var i=t.Object._getSubclass(e);return new i(n,r)},t.Object._classMap={},t.Object._extend=t._extend,t.Object.extend=function(e,r,i){if(!n.isString(e)){if(e&&n.has(e,"className"))return t.Object.extend(e.className,e,r);throw new Error("Parse.Object.extend's first argument should be the className.")}e==="User"&&(e="_User");var s=null;if(n.has(t.Object._classMap,e)){var o=t.Object._classMap[e];s=o._extend(r,i)}else r=r||{},r.className=e,s=this._extend(r,i);return s.extend=function(r){if(n.isString(r)||r&&n.has(r,"className"))return t.Object.extend.apply(s,arguments);var i=[e].concat(t._.toArray(arguments));return t.Object.extend.apply(s,i)},t.Object._classMap[e]=s,s},t.Object._wrapError=function(e,n,r){return function(i,s){i!==n&&(s=i);var o=new t.Error(-1,s.responseText);if(s.responseText){var u=JSON.parse(s.responseText);u&&(o=new t.Error(u.code,u.error))}e?e(n,o,r):n.trigger("error",n,o,r)}},t.Object._findUnsavedChildren=function(e){var r=[];if(e instanceof t.Object)e._refreshCache(),e.dirty()&&(r=[e]),r.push.apply(r,t.Object._findUnsavedChildren(e.attributes));else if(e instanceof t.Relation)var i=null;else n.isArray(e)?n.each(e,function(e){r.push.apply(r,t.Object._findUnsavedChildren(e))}):n.isObject(e)&&t._each(e,function(e){r.push.apply(r,t.Object._findUnsavedChildren(e))});return r}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Role=t.Object.extend("_Role",{constructor:function(e,r){n.isString(e)&&r instanceof t.ACL?(t.Object.prototype.constructor.call(this,null,null),this.setName(e),this.setACL(r)):t.Object.prototype.constructor.call(this,e,r)},getName:function(){return this.get("name")},setName:function(e,t){return this.set("name",e,t)},getUsers:function(){return this.relation("users")},getRoles:function(){return this.relation("roles")},validate:function(e,r){if("name"in e&&e.name!==this.getName()){var i=e.name;if(this.id&&this.id!==e.objectId)return new t.Error(t.Error.OTHER_CAUSE,"A role's name can only be set before it has been saved.");if(!n.isString(i))return new t.Error(t.Error.OTHER_CAUSE,"A role's name must be a String.");if(!/^[a-zA-Z\-_ ]+$/.test(i))return new t.Error(t.Error.OTHER_CAUSE,"A role's name can only contain alphanumeric characters, _, -, and spaces.")}return t.Object.prototype.validate?t.Object.prototype.validate.call(this,e,r):!1}})}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Collection=function(e,t){t=t||{},t.comparator&&(this.comparator=t.comparator),t.model&&(this.model=t.model),t.query&&(this.query=t.query),this._reset(),this.initialize.apply(this,arguments),e&&this.reset(e,{silent:!0,parse:t.parse})},n.extend(t.Collection.prototype,t.Events,{model:t.Object,initialize:function(){},toJSON:function(){return this.map(function(e){return e.toJSON()})},add:function(e,r){var i,s,o,u,a,f,l={},c={};r=r||{},e=n.isArray(e)?e.slice():[e];for(i=0,o=e.length;i<o;i++){e[i]=this._prepareModel(e[i],r),u=e[i];if(!u)throw new Error("Can't add an invalid model to a collection");a=u.cid;if(l[a]||this._byCid[a])throw new Error("Duplicate cid: can't add the same model to a collection twice");f=u.id;if(!t._isNullOrUndefined(f)&&(c[f]||this._byId[f]))throw new Error("Duplicate id: can't add the same model to a collection twice");c[f]=u,l[a]=u}for(i=0;i<o;i++)(u=e[i]).on("all",this._onModelEvent,this),this._byCid[u.cid]=u,u.id&&(this._byId[u.id]=u);this.length+=o,s=r.at||this.models.length,this.models.splice.apply(this.models,[s,0].concat(e)),this.comparator&&this.sort({silent:!0});if(r.silent)return this;for(i=0,o=this.models.length;i<o;i++)u=this.models[i],l[u.cid]&&(r.index=i,u.trigger("add",u,this,r));return this},remove:function(e,t){var r,i,s,o;t=t||{},e=n.isArray(e)?e.slice():[e];for(r=0,i=e.length;r<i;r++){o=this.getByCid(e[r])||this.get(e[r]);if(!o)continue;delete this._byId[o.id],delete this._byCid[o.cid],s=this.indexOf(o),this.models.splice(s,1),this.length--,t.silent||(t.index=s,o.trigger("remove",o,this,t)),this._removeReference(o)}return this},get:function(e){return e&&this._byId[e.id||e]},getByCid:function(e){return e&&this._byCid[e.cid||e]},at:function(e){return this.models[e]},sort:function(e){e=e||{};if(!this.comparator)throw new Error("Cannot sort a set without a comparator");var t=n.bind(this.comparator,this);return this.comparator.length===1?this.models=this.sortBy(t):this.models.sort(t),e.silent||this.trigger("reset",this,e),this},pluck:function(e){return n.map(this.models,function(t){return t.get(e)})},reset:function(e,t){var r=this;return e=e||[],t=t||{},n.each(this.models,function(e){r._removeReference(e)}),this._reset(),this.add(e,{silent:!0,parse:t.parse}),t.silent||this.trigger("reset",this,t),this},fetch:function(e){e=e?n.clone(e):{},e.parse===undefined&&(e.parse=!0);var r=this,i=e.success;e.success=function(t,n){e.add?r.add(t,e):r.reset(t,e),i&&i(r,n)},e.error=t.Object._wrapError(e.error,r,e);var s=this.query||new t.Query(this.model);s.find(e)},create:function(e,t){var r=this;t=t?n.clone(t):{},e=this._prepareModel(e,t);if(!e)return!1;t.wait||r.add(e,t);var i=t.success;return t.success=function(n,s,o){t.wait&&r.add(n,t),i?i(n,s):n.trigger("sync",e,s,t)},e.save(null,t),e},parse:function(e,t){return e},chain:function(){return n(this.models).chain()},_reset:function(e){this.length=0,this.models=[],this._byId={},this._byCid={}},_prepareModel:function(e,n){if(e instanceof t.Object)e.collection||(e.collection=this);else{var r=e;n.collection=this,e=new this.model(r,n),e._validate(e.attributes,n)||(e=!1)}return e},_removeReference:function(e){this===e.collection&&delete e.collection,e.off("all",this._onModelEvent,this)},_onModelEvent:function(e,t,n,r){if((e==="add"||e==="remove")&&n!==this)return;e==="destroy"&&this.remove(t,r),t&&e==="change:objectId"&&(delete this._byId[t.previous("objectId")],this._byId[t.id]=t),this.trigger.apply(this,arguments)}});var r=["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","sortBy","sortedIndex","toArray","size","first","initial","rest","last","without","indexOf","shuffle","lastIndexOf","isEmpty","groupBy"];n.each(r,function(e){t.Collection.prototype[e]=function(){return n[e].apply(n,[this.models].concat(n.toArray(arguments)))}}),t.Collection.extend=t._extend}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.View=function(e){this.cid=n.uniqueId("view"),this._configure(e||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()};var r=/^(\S+)\s*(.*)$/,i=["model","collection","el","id","attributes","className","tagName"];n.extend(t.View.prototype,t.Events,{tagName:"div",$:function(e){return this.$el.find(e)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this},make:function(e,n,r){var i=document.createElement(e);return n&&t.$(i).attr(n),r&&t.$(i).html(r),i},setElement:function(e,n){return this.$el=t.$(e),this.el=this.$el[0],n!==!1&&this.delegateEvents(),this},delegateEvents:function(e){e=e||t._getValue(this,"events");if(!e)return;this.undelegateEvents();var i=this;t._each(e,function(t,s){n.isFunction(t)||(t=i[e[s]]);if(!t)throw new Error('Event "'+e[s]+'" does not exist');var o=s.match(r),u=o[1],a=o[2];t=n.bind(t,i),u+=".delegateEvents"+i.cid,a===""?i.$el.bind(u,t):i.$el.delegate(a,u,t)})},undelegateEvents:function(){this.$el.unbind(".delegateEvents"+this.cid)},_configure:function(e){this.options&&(e=n.extend({},this.options,e));var t=this;n.each(i,function(n){e[n]&&(t[n]=e[n])}),this.options=e},_ensureElement:function(){if(!this.el){var e=t._getValue(this,"attributes")||{};this.id&&(e.id=this.id),this.className&&(e["class"]=this.className),this.setElement(this.make(this.tagName,e),!1)}else this.setElement(this.el,!1)}}),t.View.extend=t._extend}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.User=t.Object.extend("_User",{_isCurrentUser:!1,_mergeMagicFields:function(e){e.sessionToken&&(this._sessionToken=e.sessionToken,delete e.sessionToken),t.User.__super__._mergeMagicFields.call(this,e)},_cleanupAuthData:function(){if(!this.isCurrent())return;var e=this.get("authData");if(!e)return;n.each(this.get("authData"),function(t,n){e[n]||delete e[n]})},_synchronizeAllAuthData:function(){var e=this.get("authData");if(!e)return;var t=this;n.each(this.get("authData"),function(e,n){t._synchronizeAuthData(n)})},_synchronizeAuthData:function(e){if(!this.isCurrent())return;var r;n.isString(e)?(r=e,e=t.User._authProviders[r]):r=e.getAuthType();var i=this.get("authData");if(!i||!e)return;var s=e.restoreAuthentication(i[r]);s||this._unlinkFrom(e)},_handleSaveResult:function(e){e&&(this._isCurrentUser=!0),this._cleanupAuthData(),this._synchronizeAllAuthData(),delete this._serverData.password,this._rebuildEstimatedDataForKey("password"),this._refreshCache(),(e||this.isCurrent())&&t.User._saveCurrentUser(this)},_linkWith:function(e,r){var i;n.isString(e)?(i=e,e=t.User._authProviders[e]):i=e.getAuthType();if(n.has(r,"authData")){var s=this.get("authData")||{};s[i]=r.authData,this.set("authData",s);var o=n.clone(r);return o.success=function(e){e._handleSaveResult(!0),r.success&&r.success.apply(this,arguments)},this.save({authData:s},o)}var u=this;return e.authenticate({success:function(e,t){u._linkWith(e,{authData:t,success:r.success,error:r.error})},error:function(e,t){r.error&&r.error(u,t)}})},_unlinkFrom:function(e,r){var i;n.isString(e)?(i=e,e=t.User._authProviders[e]):i=e.getAuthType();var s=n.clone(r),o=this;return s.authData=null,s.success=function(t){o._synchronizeAuthData(e),r.success&&r.success.apply(this,arguments)},this._linkWith(e,s)},_isLinked:function(e){var t;n.isString(e)?t=e:t=e.getAuthType();var r=this.get("authData")||{};return!!r[t]},_logOutWithAll:function(){var e=this.get("authData");if(!e)return;var t=this;n.each(this.get("authData"),function(e,n){t._logOutWith(n)})},_logOutWith:function(e){if(!this.isCurrent())return;n.isString(e)&&(e=t.User._authProviders[e]),e&&e.deauthenticate&&e.deauthenticate()},signUp:function(e,r){var i,s=e&&e.username||this.get("username");if(!s||s==="")return r&&r.error&&(i=new t.Error(t.Error.OTHER_CAUSE,"Cannot sign up user with an empty name."),r.error(this,i)),!1;var o=e&&e.password||this.get("password");if(!o||o==="")return r&&r.error&&(i=new t.Error(t.Error.OTHER_CAUSE,"Cannot sign up user with an empty password."),r.error(this,i)),!1;var u=n.clone(r);return u.success=function(e){e._handleSaveResult(!0),r.success&&r.success.apply(this,arguments)},this.save(e,u)},logIn:function(e){var r=this,i=n.clone(e);i.success=function(t,n,s){var o=r.parse(t,n,s);r._finishFetch(o),r._handleSaveResult(!0),e.success?e.success(r,t):r.trigger("sync",r,t,i)},i.error=t.Object._wrapError(e.error,r,i),t._request("login",null,null,"GET",this.toJSON(),i)},save:function(e,r,i){var s,o,u,a,f;n.isObject(e)||n.isNull(e)||n.isUndefined(e)?(o=e,a=r):(o={},o[e]=r,a=i);var l=n.clone(a);return l.success=function(e){e._handleSaveResult(!1),a.success&&a.success.apply(this,arguments)},t.Object.prototype.save.call(this,o,l)},fetch:function(e){var r=n.clone(e);return r.success=function(t){t._handleSaveResult(!1),e.success&&e.success.apply(this,arguments)},t.Object.prototype.fetch.call(this,r)},isCurrent:function(){return this._isCurrentUser},getUsername:function(){return this.get("username")},setUsername:function(e,t){return this.set("username",e,t)},setPassword:function(e,t){return this.set("password",e,t)},getEmail:function(){return this.get("email")},setEmail:function(e,t){return this.set("email",e,t)},authenticated:function(){return!!this._sessionToken&&t.User.current()&&t.User.current().id===this.id}},{_currentUser:null,_currentUserMatchesDisk:!1,_CURRENT_USER_KEY:"currentUser",_authProviders:{},signUp:function(e,n,r,i){r=r||{},r.username=e,r.password=n;var s=t.Object._create("_User");return s.signUp(r,i)},logIn:function(e,n,r){var i=t.Object._create("_User");i._finishFetch({username:e,password:n}),i.logIn(r)},logOut:function(){t.User._currentUser!==null&&(t.User._currentUser._logOutWithAll(),t.User._currentUser._isCurrentUser=!1),t.User._currentUserMatchesDisk=!0,t.User._currentUser=null,t.localStorage.removeItem(t._getParsePath(t.User._CURRENT_USER_KEY))},requestPasswordReset:function(e,n){var r={email:e};n.error=t.Query._wrapError(n.error,n),t._request("requestPasswordReset",null,null,"POST",r,n)},current:function(){if(t.User._currentUser)return t.User._currentUser;if(t.User._currentUserMatchesDisk)return t.User._currentUser;t.User._currentUserMatchesDisk=!0;var e=t.localStorage.getItem(t._getParsePath(t.User._CURRENT_USER_KEY));if(!e)return null;t.User._currentUser=new t.Object._create("_User"),t.User._currentUser._isCurrentUser=!0;var n=JSON.parse(e);return t.User._currentUser.id=n._id,delete n._id,t.User._currentUser._sessionToken=n._sessionToken,delete n._sessionToken,t.User._currentUser.set(n),t.User._currentUser._synchronizeAllAuthData(),t.User._currentUser._refreshCache(),t.User._currentUser._opSetQueue=[{}],t.User._currentUser},_saveCurrentUser:function(e){t.User._currentUser!==e&&t.User.logOut(),e._isCurrentUser=!0,t.User._currentUser=e,t.User._currentUserMatchesDisk=!0;var n=e.toJSON();n._id=e.id,n._sessionToken=e._sessionToken,t.localStorage.setItem(t._getParsePath(t.User._CURRENT_USER_KEY),JSON.stringify(n))},_registerAuthenticationProvider:function(e){t.User._authProviders[e.getAuthType()]=e,t.User.current()&&t.User.current()._synchronizeAuthData(e.getAuthType())},_logInWith:function(e,n){var r=new t.User;return r._linkWith(e,n)}})}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Query=function(e){n.isString(e)&&(e=t.Object._getSubclass(e)),this.objectClass=e,this.className=e.prototype.className,this._where={},this._include=[],this._limit=-1,this._skip=0},t.Query.or=function(){var e=n.toArray(arguments),r=null;n.each(e,function(e){n.isNull(r)&&(r=e.className);if(r!==e.className)throw"All queries must be for the same class"});var i=new t.Query(r);return i._orQuery(e),i},t.Query.prototype={get:function(e,n){var r=this,i=n.success||function(){},s=n.error||function(){},o={error:function(e){s(null,e)},success:function(e){e?i(e):s(null,new t.Error(t.Error.OBJECT_NOT_FOUND,"Object not found."))}};r.equalTo("objectId",e),r.first(o)},toJSON:function(){var e={where:this._where};return this._include.length>0&&(e.include=this._include.join(",")),this._limit>=0&&(e.limit=this._limit),this._skip>0&&(e.skip=this._skip),this._order!==undefined&&(e.order=this._order),e},find:function(e){var r=this,i=e.success||function(){},s={error:e.error,success:function(e){i(n.map(e.results,function(e){var t=new r.objectClass;return t._finishFetch(e,!0),t}))}},o=this.toJSON();s.error=t.Query._wrapError(e.error,s),t._request("classes",this.className,null,"GET",o,s)},count:function(e){var n=this,r=e.success||function(){},i={error:e.error,success:function(e){r(e.count)}},s=this.toJSON();s.limit=0,s.count=1,i.error=t.Query._wrapError(e.error,i),t._request("classes",this.className,null,"GET",s,i)},first:function(e){var r=this,i=e.success||function(){},s={error:e.error,success:function(e){i(n.map(e.results,function(e){var t=new r.objectClass;return t._finishFetch(e,!0),t})[0])}},o=this.toJSON();o.limit=1,s.error=t.Query._wrapError(e.error,s),t._request("classes",this.className,null,"GET",o,s)},collection:function(e,r){return r=r||{},new t.Collection(e,n.extend(r,{model:this.objectClass,query:this}))},skip:function(e){return this._skip=e,this},limit:function(e){return this._limit=e,this},equalTo:function(e,n){return this._where[e]=t._encode(n),this},_addCondition:function(e,n,r){return this._where[e]||(this._where[e]={}),this._where[e][n]=t._encode(r),this},notEqualTo:function(e,t){return this._addCondition(e,"$ne",t),this},lessThan:function(e,t){return this._addCondition(e,"$lt",t),this},greaterThan:function(e,t){return this._addCondition(e,"$gt",t),this},lessThanOrEqualTo:function(e,t){return this._addCondition(e,"$lte",t),this},greaterThanOrEqualTo:function(e,t){return this._addCondition(e,"$gte",t),this},containedIn:function(e,t){return this._addCondition(e,"$in",t),this},notContainedIn:function(e,t){return this._addCondition(e,"$nin",t),this},exists:function(e){return this._addCondition(e,"$exists",!0),this},doesNotExist:function(e){return this._addCondition(e,"$exists",!1),this},matches:function(e,t,n){return this._addCondition(e,"$regex",t),n||(n=""),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),n&&n.length&&this._addCondition(e,"$options",n),this},matchesQuery:function(e,t){var n=t.toJSON();return n.className=t.className,this._addCondition(e,"$inQuery",n),this},doesNotMatchQuery:function(e,t){var n=t.toJSON();return n.className=t.className,this._addCondition(e,"$notInQuery",n),this},matchesKeyInQuery:function(e,t,n){var r=n.toJSON();return r.className=n.className,this._addCondition(e,"$select",{key:t,query:r}),this},_orQuery:function(e){var t=n.map(e,function(e){return e.toJSON().where});return this._where.$or=t,this},_quote:function(e){return"\\Q"+e.replace("\\E","\\E\\\\E\\Q")+"\\E"},contains:function(e,t){return this._addCondition(e,"$regex",this._quote(t)),this},startsWith:function(e,t){return this._addCondition(e,"$regex","^"+this._quote(t)),this},endsWith:function(e,t){return this._addCondition(e,"$regex",this._quote(t)+"$"),this},ascending:function(e){return this._order=e,this},descending:function(e){return this._order="-"+e,this},near:function(e,n){return n instanceof t.GeoPoint||(n=new t.GeoPoint(n)),this._addCondition(e,"$nearSphere",n),this},withinRadians:function(e,t,n){return this.near(e,t),this._addCondition(e,"$maxDistance",n),this},withinMiles:function(e,t,n){return this.withinRadians(e,t,n/3958.8)},withinKilometers:function(e,t,n){return this.withinRadians(e,t,n/6371)},withinGeoBox:function(e,n,r){return n instanceof t.GeoPoint||(n=new t.GeoPoint(n)),r instanceof t.GeoPoint||(r=new t.GeoPoint(r)),this._addCondition(e,"$within",{$box:[n,r]}),this},include:function(e){return n.isArray(e)?this._include=this._include.concat(e):this._include.push(e),this}},t.Query._wrapError=function(e,n){return function(r){if(e){var i=new t.Error(-1,r.responseText);if(r.responseText){var s=JSON.parse(r.responseText);s&&(i=new t.Error(s.code,s.error))}e(i,n)}}}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._,r="*",i=!1,s,o={authenticate:function(e){var t=this;FB.login(function(n){n.authResponse?e.success&&e.success(t,{id:n.authResponse.userID,access_token:n.authResponse.accessToken,expiration_date:(new Date(n.authResponse.expiresIn*1e3+(new Date).getTime())).toJSON()}):e.error&&e.error(t,n)},{scope:s})},restoreAuthentication:function(e){if(e){var n={userID:e.id,accessToken:e.access_token,expiresIn:(t._parseDate(e.expiration_date).getTime()-(new Date).getTime())/1e3};FB.Auth.setAuthResponse(n,"connected")}else FB.Auth.setAuthResponse(null,"unknown");return!0},getAuthType:function(){return"facebook"},deauthenticate:function(){this.restoreAuthentication(null)}};t.FacebookUtils={init:function(e){if(typeof FB=="undefined")throw"The Javascript Facebook SDK must be loaded before calling init.";FB.init(e),t.User._registerAuthenticationProvider(o),i=!0},isLinked:function(e){return e._isLinked("facebook")},logIn:function(e,r){if(!e||n.isString(e)){if(!i)throw"You must initialize FacebookUtils before calling logIn.";return s=e,t.User._logInWith("facebook",r)}var o=n.clone(r);return o.authData=e,t.User._logInWith("facebook",o)},link:function(e,t,r){if(!t||n.isString(t)){if(!i)throw"You must initialize FacebookUtils before calling link.";return s=t,e._linkWith("facebook",r)}var o=n.clone(r);return o.authData=t,e._linkWith("facebook",o)},unlink:function(e,t){if(!i)throw"You must initialize FacebookUtils before calling unlink.";return e._unlinkFrom("facebook",t)}}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.History=function(){this.handlers=[],n.bindAll(this,"checkUrl")};var r=/^[#\/]/,i=/msie [\w.]+/;t.History.started=!1,n.extend(t.History.prototype,t.Events,{interval:50,getHash:function(e){var t=e?e.location:window.location,n=t.href.match(/#(.*)$/);return n?n[1]:""},getFragment:function(e,n){if(t._isNullOrUndefined(e))if(this._hasPushState||n){e=window.location.pathname;var i=window.location.search;i&&(e+=i)}else e=this.getHash();return e.indexOf(this.options.root)||(e=e.substr(this.options.root.length)),e.replace(r,"")},start:function(e){if(t.History.started)throw new Error("Parse.history has already been started");t.History.started=!0,this.options=n.extend({},{root:"/"},this.options,e),this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&window.history&&window.history.pushState);var s=this.getFragment(),o=document.documentMode,u=i.exec(navigator.userAgent.toLowerCase())&&(!o||o<=7);u&&(this.iframe=t.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(s)),this._hasPushState?t.$(window).bind("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!u?t.$(window).bind("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=window.setInterval(this.checkUrl,this.interval)),this.fragment=s;var a=window.location,f=a.pathname===this.options.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!f)return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;this._wantsPushState&&this._hasPushState&&f&&a.hash&&(this.fragment=this.getHash().replace(r,""),window.history.replaceState({},document.title,a.protocol+"//"+a.host+this.options.root+this.fragment));if(!this.options.silent)return this.loadUrl()},stop:function(){t.$(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl),window.clearInterval(this._checkUrlInterval),t.History.started=!1},route:function(e,t){this.handlers.unshift({route:e,callback:t})},checkUrl:function(e){var t=this.getFragment();t===this.fragment&&this.iframe&&(t=this.getFragment(this.getHash(this.iframe)));if(t===this.fragment)return!1;this.iframe&&this.navigate(t),this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(e){var t=this.fragment=this.getFragment(e),r=n.any(this.handlers,function(e){if(e.route.test(t))return e.callback(t),!0});return r},navigate:function(e,n){if(!t.History.started)return!1;if(!n||n===!0)n={trigger:n};var i=(e||"").replace(r,"");if(this.fragment===i)return;if(this._hasPushState){i.indexOf(this.options.root)!==0&&(i=this.options.root+i),this.fragment=i;var s=n.replace?"replaceState":"pushState";window.history[s]({},document.title,i)}else this._wantsHashChange?(this.fragment=i,this._updateHash(window.location,i,n.replace),this.iframe&&i!==this.getFragment(this.getHash(this.iframe))&&(n.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,i,n.replace))):window.location.assign(this.options.root+e);n.trigger&&this.loadUrl(e)},_updateHash:function(e,t,n){if(n){var r=e.toString().replace(/(javascript:|#).*$/,"");e.replace(r+"#"+t)}else e.hash=t}})}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Router=function(e){e=e||{},e.routes&&(this.routes=e.routes),this._bindRoutes(),this.initialize.apply(this,arguments)};var r=/:\w+/g,i=/\*\w+/g,s=/[\-\[\]{}()+?.,\\\^\$\|#\s]/g;n.extend(t.Router.prototype,t.Events,{initialize:function(){},route:function(e,r,i){return t.history=t.history||new t.History,n.isRegExp(e)||(e=this._routeToRegExp(e)),i||(i=this[r]),t.history.route(e,n.bind(function(n){var s=this._extractParameters(e,n);i&&i.apply(this,s),this.trigger.apply(this,["route:"+r].concat(s)),t.history.trigger("route",this,r,s)},this)),this},navigate:function(e,n){t.history.navigate(e,n)},_bindRoutes:function(){if(!this.routes)return;var e=[];for(var t in this.routes)this.routes.hasOwnProperty(t)&&e.unshift([t,this.routes[t]]);for(var n=0,r=e.length;n<r;n++)this.route(e[n][0],e[n][1],this[e[n][1]])},_routeToRegExp:function(e){return e=e.replace(s,"\\$&").replace(r,"([^/]+)").replace(i,"(.*?)"),new RegExp("^"+e+"$")},_extractParameters:function(e,t){return e.exec(t).slice(1)}}),t.Router.extend=t._extend}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse,n=t._;t.Cloud={run:function(e,r,i){var s=i,o=n.clone(i);o.success=function(e){var n=t._decode(null,e);s.success&&s.success(n.result)},o.error=t.Cloud._wrapError(s.error,i),t._request("functions",e,null,"POST",t._encode(r,null,!0),o)},_wrapError:function(e,n){return function(r){if(e){var i=new t.Error(-1,r.responseText);if(r.responseText){var s=JSON.parse(r.responseText);s&&(i=new t.Error(s.code,s.error))}e(i,n)}}}}}(this),function(e){e.Parse=e.Parse||{};var t=e.Parse;t.Installation=t.Object.extend("_Installation"),t.Push=t.Push||{},t.Push.send=function(e,n){e.where&&(e.where=e.where.toJSON().where),e.push_time&&(e.push_time=e.push_time.toJSON()),e.expiration_time&&(e.expiration_time=e.expiration_time.toJSON());if(e.expiration_time&&e.expiration_time_interval)throw"Both expiration_time and expiration_time_interval can't be set";var r={error:n.error,success:n.success};r.error=t.Query._wrapError(n.error,r),t._request("push",null,null,"POST",e,r)}}(this);;

/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(e){e(function(){"use strict";e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()},e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e(function(){e("body").on("click.alert.data-api",t,n.prototype.close)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")},e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e(function(){e("body").on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=n,this.options.slide&&this.slide(this.options.slide),this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},to:function(t){var n=this.$element.find(".item.active"),r=n.parent().children(),i=r.index(n),s=this;if(t>r.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){s.to(t)}):i==t?this.pause().cycle():this.slide(t>i?"next":"prev",e(r[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle()),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f=e.Event("slide",{relatedTarget:i[0]});this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u]();if(i.hasClass("active"))return;if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}},e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e(function(){e("body").on("click.carousel.data-api","[data-slide]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=!i.data("modal")&&e.extend({},i.data(),n.data());i.carousel(s),t.preventDefault()})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning)return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning)return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=typeof n=="object"&&n;i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e(function(){e("body").on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})})}(window.jQuery),!function(e){"use strict";function r(){i(e(t)).removeClass("open")}function i(t){var n=t.attr("data-target"),r;return n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=e(n),r.length||(r=t.parent()),r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||(s.toggleClass("open"),n.focus()),!1},keydown:function(t){var n,r,s,o,u,a;if(!/(38|40|27)/.test(t.keyCode))return;n=e(this),t.preventDefault(),t.stopPropagation();if(n.is(".disabled, :disabled"))return;o=i(n),u=o.hasClass("open");if(!u||u&&t.keyCode==27)return n.click();r=e("[role=menu] li:not(.divider) a",o);if(!r.length)return;a=r.index(r.filter(":focus")),t.keyCode==38&&a>0&&a--,t.keyCode==40&&a<r.length-1&&a++,~a||(a=0),r.eq(a).focus()}},e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e(function(){e("html").on("click.dropdown.data-api touchstart.dropdown.data-api",r),e("body").on("click.dropdown touchstart.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api touchstart.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;e("body").addClass("modal-open"),this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1).focus(),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.trigger("shown")}):t.$element.trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,e("body").removeClass("modal-open"),this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(e){this.$element.hide().trigger("hidden"),this.backdrop()},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,e.proxy(this.removeBackdrop,this)):this.removeBackdrop()):t&&t()}},e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e(function(){e("body").on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,this.options.trigger=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):this.options.trigger!="manual"&&(i=this.options.trigger=="hover"?"mouseenter":"focus",s=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this))),this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,t,this.$element.data()),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)return n.show();clearTimeout(this.timeout),n.hoverState="in",this.timeout=setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip(),this.setContent(),this.options.animation&&e.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,t=/in/.test(s),e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body),n=this.getPosition(t),r=e[0].offsetWidth,i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.remove()})}var t=this,n=this.tip();return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?r():n.remove(),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}},e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0,html:!0}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content > *")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}}),e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var t=e(this),n=t.data("target")||t.attr("href"),r=/^#\w/.test(n)&&e(n);return r&&r.length&&[[r.position().top,n]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}},e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active a").last()[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}},e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e(function(){e("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=e(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:t.top+t.height,left:t.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),(e.browser.chrome||e.browser.webkit||e.browser.msie)&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this))},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=!~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},blur:function(e){var t=this;setTimeout(function(){t.hide()},150)},click:function(e){e.stopPropagation(),e.preventDefault(),this.select()},mouseenter:function(t){this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")}},e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e(function(){e("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;t.preventDefault(),n.typeahead(n.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))},e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);;

(function(a,b){var c=a(b),d=false,e=false;var f='    <div class="ui-switch">                                 \n      <div class="ui-switch-mask">                          \n        <div class="ui-switch-master">                      \n          <div class="ui-switch-upper">                     \n            <span class="ui-switch-handle"></span>          \n          </div>                                            \n          <div class="ui-switch-lower">                     \n            <div class="ui-switch-labels">                  \n              <a href="#" class="ui-switch-on">{{on}}</a>   \n              <a href="#" class="ui-switch-off">{{off}}</a> \n            </div>                                          \n          </div>                                            \n        </div>                                              \n      </div>                                                \n      <div class="ui-switch-middle"></div>                  \n    </div>';c.bind("mousedown",function(a){if(a.which<=1&&!a.metaKey&&!a.shiftKey&&!a.altKey&&!a.ctrlKey){d=true}}).bind("mouseup",function(a){d=false});c.bind("mouseup touchend",function(){e=false;if(a(".ui-switch[data-dragging]").length>0){a(".ui-switch[data-dragging]").data("controls").snap();e=true}});var g={build:function(b,c){b.hide();b.attr("tabindex","-1");var g=b.find("option"),h=b.val(),i=!!b.attr("disabled");var j={on:c.on||g.first().val(),off:c.off||g.last().val()},k={on:g.filter("[value="+j.on+"]").text(),off:g.filter("[value="+j.off+"]").text()};var l=a(f.replace("{{on}}",k.on).replace("{{off}}",k.off));l.addClass(b.val()===j.on?"on":"off");if(i){l.addClass("disabled")}var m=l.find(".ui-switch-master"),n=l.find(".ui-switch-handle");l.insertAfter(b);var o=l.find("a").map(function(b,c){return a(c).width()}),p=Math.max(o[0],o[1]);l.find(".ui-switch-middle").width(p+43);l.find("a").width(p);var q="-"+(p+21)+"px",r="-2px";m.css({left:q});n.css({left:p+16+"px"});if(j.on===h){m.css({left:r})}b.data("switch",l);l.data("select",b);l.data("animating",false);l.data("offset",l.offset()).data("dimensions",{width:l.width(),height:l.height()}).data("center",{left:l.data("offset").left+l.data("dimensions").width/2,top:l.data("offset").top+l.data("dimensions").height/2});a.event.special["switch:slide"]={_default:function(b,c){var d=a(b.target);if(!c&&d.data("switchEvent")){c=d.data("switchEvent");d.removeData("switchEvent")}if(!(c==="on"||c==="off")){throw'jQuery/Switch: "switch:slide" event must be triggered with an additional parameter of "on" or "off"'}d.trigger("switch:slide"+c)}};var s=l.data("controls",{_to:function(a,b){if(!b){b={silent:false}}if(!i&&!b.silent){l.data("switchEvent",a);l.trigger("switch:slide",[a])}else if(!i){l.trigger("switch:slide"+a)}return l},on:function(a){return s._to("on",a)},off:function(a){return s._to("off",a)},toggle:function(a){return s._to(b.val()===j.on?"off":"on",a)},snap:function(a){if(!a){a={}}if(!l.data("animating")&&l.attr("data-dragging")){if(l.find(".ui-switch-handle").offset().left+15>l.data("center").left){a.silent=l.data("select").val()==j.on;return s.on(a)}else{a.silent=l.data("select").val()==j.off;return s.off(a)}}else{return l}}})&&l.data("controls");b.bind("change",function(){d=false;s[b.val()===j.on?"on":"off"]()});l.attr("tabindex","0").bind("keyup",function(a){if(a.which===13){s.toggle()}});l.find("a").attr("tabindex","-1");l.bind("mouseup touchend",function(a){a.preventDefault();if(!l.attr("data-dragging")){s.toggle()}});l.bind("mousedown touchstart",function(a){a.preventDefault();var b,c;if(a.type==="touchstart"){b=a.originalEvent.targetTouches[0].pageX;c=a.originalEvent.targetTouches[0].pageY}else{b=a.pageX;c=a.pageY}var d=parseInt(m.css("left")),e=l.data("offset").left+d,f=e-b;l.data("modifier",f)});l.bind("mouseleave touchcancel",function(a){if(!e){l.data("controls").snap()}else{e=false}});l.bind("mousemove touchmove",function(a){a.preventDefault();if(!i&&(a.type==="touchmove"||d)){l.attr("data-dragging","true");var b,c;if(a.type==="touchmove"){b=a.originalEvent.targetTouches[0].pageX;c=a.originalEvent.targetTouches[0].pageY}else{b=a.pageX;c=a.pageY}var e=l.data("offset"),f=l.data("dimensions"),g=l.data("center");var h=b+l.data("modifier"),j=e.left-(p+35);if(h>j+18&&h<=j-19+f.width){m.offset({left:h})}}});l.bind("switch:slideon",function(){l.data("animating",true).removeAttr("data-dragging");m.stop().animate({left:r},"fast",function(){l.data("animating",false).data("select").val(j.on);l.removeClass("off").addClass("on");d=false;e=false})});l.bind("switch:slideoff",function(){l.data("animating",true).removeAttr("data-dragging");m.stop().animate({left:q},"fast",function(){l.data("animating",false).data("select").val(j.off);l.removeClass("on").addClass("off");d=false;e=false})});return b},update:function(a){var b=a.data("switch");b.data("offset",b.offset()).data("dimensions",{width:b.width(),height:b.height()}).data("center",{left:b.data("offset").left+b.data("dimensions").width/2,top:b.data("offset").top+b.data("dimensions").height/2});return a}};a.fn.switchify=function(b){this.each(function(c,d){var e=a(d);if(b!=="update"&&e.data("switch")){return}g[b==="update"?"update":"build"](e,b||{})});return this}})(jQuery,window.document);

// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.6";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});
;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error;

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
;

/*
Chaplin 1.0.0-pre.

Chaplin may be freely distributed under the MIT license.
For all details and documentation:
http://github.com/chaplinjs/chaplin
*/

'use strict';

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

require.define({
  'jquery': function(require, exports, module) {
    return module.exports = $;
  },
  'underscore': function(require, exports, module) {
    return module.exports = _;
  },
  'backbone': function(require, exports, module) {
    return module.exports = Backbone;
  }
});

require.define({
  'chaplin/application': function(exports, require, module) {
    var Application, Backbone, Dispatcher, Layout, Router, mediator;
    Backbone = require('backbone');
    mediator = require('chaplin/mediator');
    Dispatcher = require('chaplin/dispatcher');
    Layout = require('chaplin/views/layout');
    Router = require('chaplin/lib/router');
    return module.exports = Application = (function() {

      function Application() {}

      Application.extend = Backbone.Model.extend;

      Application.prototype.title = '';

      Application.prototype.dispatcher = null;

      Application.prototype.layout = null;

      Application.prototype.router = null;

      Application.prototype.initialize = function() {};

      Application.prototype.initDispatcher = function(options) {
        return this.dispatcher = new Dispatcher(options);
      };

      Application.prototype.initLayout = function(options) {
        var _ref;
        if (options == null) {
          options = {};
        }
        if ((_ref = options.title) == null) {
          options.title = this.title;
        }
        return this.layout = new Layout(options);
      };

      Application.prototype.initRouter = function(routes, options) {
        this.router = new Router(options);
        if (typeof routes === "function") {
          routes(this.router.match);
        }
        return this.router.startHistory();
      };

      Application.prototype.disposed = false;

      Application.prototype.dispose = function() {
        var prop, properties, _i, _len;
        if (this.disposed) {
          return;
        }
        properties = ['dispatcher', 'layout', 'router'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          if (!(this[prop] != null)) {
            continue;
          }
          this[prop].dispose();
          delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Application;

    })();
  }
});

require.define({
  'chaplin/mediator': function(exports, require, module) {
    var Backbone, mediator, support, utils, _;
    _ = require('underscore');
    Backbone = require('backbone');
    support = require('chaplin/lib/support');
    utils = require('chaplin/lib/utils');
    mediator = {};
    mediator.subscribe = Backbone.Events.on;
    mediator.unsubscribe = Backbone.Events.off;
    mediator.publish = Backbone.Events.trigger;
    mediator.on = mediator.subscribe;
    mediator._callbacks = null;
    utils.readonly(mediator, 'subscribe', 'unsubscribe', 'publish', 'on');
    mediator.seal = function() {
      if (support.propertyDescriptors && Object.seal) {
        return Object.seal(mediator);
      }
    };
    utils.readonly(mediator, 'seal');
    return module.exports = mediator;
  }
});

require.define({
  'chaplin/dispatcher': function(exports, require, module) {
    var Backbone, Dispatcher, EventBroker, utils, _;
    _ = require('underscore');
    Backbone = require('backbone');
    utils = require('chaplin/lib/utils');
    EventBroker = require('chaplin/lib/event_broker');
    return module.exports = Dispatcher = (function() {

      Dispatcher.extend = Backbone.Model.extend;

      _(Dispatcher.prototype).extend(EventBroker);

      Dispatcher.prototype.previousControllerName = null;

      Dispatcher.prototype.currentControllerName = null;

      Dispatcher.prototype.currentController = null;

      Dispatcher.prototype.currentAction = null;

      Dispatcher.prototype.currentParams = null;

      Dispatcher.prototype.url = null;

      function Dispatcher() {
        this.initialize.apply(this, arguments);
      }

      Dispatcher.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.settings = _(options).defaults({
          controllerPath: 'controllers/',
          controllerSuffix: '_controller'
        });
        this.subscribeEvent('matchRoute', this.matchRoute);
        return this.subscribeEvent('!startupController', this.startupController);
      };

      Dispatcher.prototype.matchRoute = function(route, params) {
        return this.startupController(route.controller, route.action, params);
      };

      Dispatcher.prototype.startupController = function(controllerName, action, params) {
        var handler, isSameController;
        if (action == null) {
          action = 'index';
        }
        if (params == null) {
          params = {};
        }
        if (params.changeURL !== false) {
          params.changeURL = true;
        }
        if (params.forceStartup !== true) {
          params.forceStartup = false;
        }
        isSameController = !params.forceStartup && this.currentControllerName === controllerName && this.currentAction === action && (!this.currentParams || _(params).isEqual(this.currentParams));
        if (isSameController) {
          return;
        }
        handler = _(this.controllerLoaded).bind(this, controllerName, action, params);
        return this.loadController(controllerName, handler);
      };

      Dispatcher.prototype.loadController = function(controllerName, handler) {
        var controllerFileName, path;
        controllerFileName = utils.underscorize(controllerName) + this.settings.controllerSuffix;
        path = this.settings.controllerPath + controllerFileName;
        if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
          return require([path], handler);
        } else {
          return handler(require(path));
        }
      };

      Dispatcher.prototype.controllerLoaded = function(controllerName, action, params, ControllerConstructor) {
        var controller, currentController, currentControllerName;
        currentControllerName = this.currentControllerName || null;
        currentController = this.currentController || null;
        if (currentController) {
          this.publishEvent('beforeControllerDispose', currentController);
          currentController.dispose(params, controllerName);
        }
        controller = new ControllerConstructor(params, currentControllerName);
        controller[action](params, currentControllerName);
        if (controller.redirected) {
          return;
        }
        this.previousControllerName = currentControllerName;
        this.currentControllerName = controllerName;
        this.currentController = controller;
        this.currentAction = action;
        this.currentParams = params;
        this.adjustURL(controller, params);
        return this.publishEvent('startupController', {
          previousControllerName: this.previousControllerName,
          controller: this.currentController,
          controllerName: this.currentControllerName,
          params: this.currentParams
        });
      };

      Dispatcher.prototype.adjustURL = function(controller, params) {
        var url;
        if (params.path || params.path === '') {
          url = params.path;
        } else if (typeof controller.historyURL === 'function') {
          url = controller.historyURL(params);
        } else if (typeof controller.historyURL === 'string') {
          url = controller.historyURL;
        } else {
          throw new Error('Dispatcher#adjustURL: controller for ' + ("" + this.currentControllerName + " does not provide a historyURL"));
        }
        if (params.changeURL) {
          this.publishEvent('!router:changeURL', url);
        }
        return this.url = url;
      };

      Dispatcher.prototype.disposed = false;

      Dispatcher.prototype.dispose = function() {
        if (this.disposed) {
          return;
        }
        this.unsubscribeAllEvents();
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Dispatcher;

    })();
  }
});

require.define({
  'chaplin/controllers/controller': function(exports, require, module) {
    var Backbone, Controller, EventBroker, _;
    _ = require('underscore');
    Backbone = require('backbone');
    EventBroker = require('chaplin/lib/event_broker');
    return module.exports = Controller = (function() {

      Controller.extend = Backbone.Model.extend;

      _(Controller.prototype).extend(EventBroker);

      Controller.prototype.view = null;

      Controller.prototype.currentId = null;

      Controller.prototype.redirected = false;

      function Controller() {
        this.initialize.apply(this, arguments);
      }

      Controller.prototype.initialize = function() {};

      Controller.prototype.redirectTo = function(arg1, action, params) {
        this.redirected = true;
        if (arguments.length === 1) {
          return this.publishEvent('!router:route', arg1, function(routed) {
            if (!routed) {
              throw new Error('Controller#redirectTo: no route matched');
            }
          });
        } else {
          return this.publishEvent('!startupController', arg1, action, params);
        }
      };

      Controller.prototype.disposed = false;

      Controller.prototype.dispose = function() {
        var obj, prop, properties, _i, _len;
        if (this.disposed) {
          return;
        }
        for (prop in this) {
          if (!__hasProp.call(this, prop)) continue;
          obj = this[prop];
          if (obj && typeof obj.dispose === 'function') {
            obj.dispose();
            delete this[prop];
          }
        }
        this.unsubscribeAllEvents();
        properties = ['currentId', 'redirected'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Controller;

    })();
  }
});

require.define({
  'chaplin/models/collection': function(exports, require, module) {
    var Backbone, Collection, EventBroker, Model, _;
    _ = require('underscore');
    Backbone = require('backbone');
    EventBroker = require('chaplin/lib/event_broker');
    Model = require('chaplin/models/model');
    return module.exports = Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      _(Collection.prototype).extend(EventBroker);

      Collection.prototype.model = Model;

      Collection.prototype.initDeferred = function() {
        return _(this).extend($.Deferred());
      };

      Collection.prototype.addAtomic = function(models, options) {
        var direction, model;
        if (options == null) {
          options = {};
        }
        if (!models.length) {
          return;
        }
        options.silent = true;
        direction = typeof options.at === 'number' ? 'pop' : 'shift';
        while (model = models[direction]()) {
          this.add(model, options);
        }
        return this.trigger('reset');
      };

      Collection.prototype.update = function(models, options) {
        var fingerPrint, i, ids, model, newFingerPrint, preexistent, _i, _ids, _len;
        if (options == null) {
          options = {};
        }
        fingerPrint = this.pluck('id').join();
        ids = _(models).pluck('id');
        newFingerPrint = ids.join();
        if (newFingerPrint !== fingerPrint) {
          _ids = _(ids);
          i = this.models.length;
          while (i--) {
            model = this.models[i];
            if (!_ids.include(model.id)) {
              this.remove(model);
            }
          }
        }
        if (newFingerPrint !== fingerPrint || options.deep) {
          for (i = _i = 0, _len = models.length; _i < _len; i = ++_i) {
            model = models[i];
            preexistent = this.get(model.id);
            if (preexistent) {
              if (options.deep) {
                preexistent.set(model);
              }
            } else {
              this.add(model, {
                at: i
              });
            }
          }
        }
      };

      Collection.prototype.disposed = false;

      Collection.prototype.dispose = function() {
        var prop, properties, _i, _len;
        if (this.disposed) {
          return;
        }
        this.trigger('dispose', this);
        this.reset([], {
          silent: true
        });
        this.unsubscribeAllEvents();
        this.off();
        if (typeof this.reject === "function") {
          this.reject();
        }
        properties = ['model', 'models', '_byId', '_byCid', '_callbacks'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Collection;

    })(Backbone.Collection);
  }
});

require.define({
  'chaplin/models/model': function(exports, require, module) {
    var Backbone, EventBroker, Model, utils, _;
    _ = require('underscore');
    Backbone = require('backbone');
    utils = require('chaplin/lib/utils');
    EventBroker = require('chaplin/lib/event_broker');
    return module.exports = Model = (function(_super) {
      var serializeAttributes;

      __extends(Model, _super);

      function Model() {
        return Model.__super__.constructor.apply(this, arguments);
      }

      _(Model.prototype).extend(EventBroker);

      Model.prototype.initDeferred = function() {
        return _(this).extend($.Deferred());
      };

      Model.prototype.getAttributes = function() {
        return this.attributes;
      };

      serializeAttributes = function(model, attributes, modelStack) {
        var delegator, item, key, value;
        if (!modelStack) {
          delegator = utils.beget(attributes);
          modelStack = [model];
        } else {
          modelStack.push(model);
        }
        for (key in attributes) {
          value = attributes[key];
          if (value instanceof Backbone.Model) {
            if (delegator == null) {
              delegator = utils.beget(attributes);
            }
            delegator[key] = value === model || __indexOf.call(modelStack, value) >= 0 ? null : serializeAttributes(value, value.getAttributes(), modelStack);
          } else if (value instanceof Backbone.Collection) {
            if (delegator == null) {
              delegator = utils.beget(attributes);
            }
            delegator[key] = (function() {
              var _i, _len, _ref, _results;
              _ref = value.models;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _results.push(serializeAttributes(item, item.getAttributes(), modelStack));
              }
              return _results;
            })();
          }
        }
        modelStack.pop();
        return delegator || attributes;
      };

      Model.prototype.serialize = function() {
        return serializeAttributes(this, this.getAttributes());
      };

      Model.prototype.disposed = false;

      Model.prototype.dispose = function() {
        var prop, properties, _i, _len;
        if (this.disposed) {
          return;
        }
        this.trigger('dispose', this);
        this.unsubscribeAllEvents();
        this.off();
        if (typeof this.reject === "function") {
          this.reject();
        }
        properties = ['collection', 'attributes', 'changed', '_escapedAttributes', '_previousAttributes', '_silent', '_pending', '_callbacks'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Model;

    })(Backbone.Model);
  }
});

require.define({
  'chaplin/views/layout': function(exports, require, module) {
    var $, Backbone, EventBroker, Layout, utils, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    utils = require('chaplin/lib/utils');
    EventBroker = require('chaplin/lib/event_broker');
    return module.exports = Layout = (function() {

      Layout.extend = Backbone.Model.extend;

      _(Layout.prototype).extend(EventBroker);

      Layout.prototype.title = '';

      Layout.prototype.events = {};

      Layout.prototype.el = document;

      Layout.prototype.$el = $(document);

      Layout.prototype.cid = 'chaplin-layout';

      function Layout() {
        this.openLink = __bind(this.openLink, this);
        this.initialize.apply(this, arguments);
      }

      Layout.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.title = options.title;
        this.settings = _(options).defaults({
          titleTemplate: _.template("<%= subtitle %> \u2013 <%= title %>"),
          openExternalToBlank: false,
          routeLinks: 'a, .go-to',
          skipRouting: '.noscript',
          scrollTo: [0, 0]
        });
        this.subscribeEvent('beforeControllerDispose', this.hideOldView);
        this.subscribeEvent('startupController', this.showNewView);
        this.subscribeEvent('startupController', this.adjustTitle);
        if (this.settings.routeLinks) {
          this.startLinkRouting();
        }
        return this.delegateEvents();
      };

      Layout.prototype.delegateEvents = Backbone.View.prototype.delegateEvents;

      Layout.prototype.undelegateEvents = Backbone.View.prototype.undelegateEvents;

      Layout.prototype.hideOldView = function(controller) {
        var scrollTo, view;
        scrollTo = this.settings.scrollTo;
        if (scrollTo) {
          window.scrollTo(scrollTo[0], scrollTo[1]);
        }
        view = controller.view;
        if (view) {
          return view.$el.css('display', 'none');
        }
      };

      Layout.prototype.showNewView = function(context) {
        var view;
        view = context.controller.view;
        if (view) {
          return view.$el.css({
            display: 'block',
            opacity: 1,
            visibility: 'visible'
          });
        }
      };

      Layout.prototype.adjustTitle = function(context) {
        var subtitle, title;
        title = this.title || '';
        subtitle = context.controller.title || '';
        title = this.settings.titleTemplate({
          title: title,
          subtitle: subtitle
        });
        return setTimeout((function() {
          return document.title = title;
        }), 50);
      };

      Layout.prototype.startLinkRouting = function() {
        if (this.settings.routeLinks) {
          return $(document).on('click', this.settings.routeLinks, this.openLink);
        }
      };

      Layout.prototype.stopLinkRouting = function() {
        if (this.settings.routeLinks) {
          return $(document).off('click', this.settings.routeLinks);
        }
      };

      Layout.prototype.openLink = function(event) {
        var $el, el, href, internal, isAnchor, path, skipRouting, type, _ref, _ref1;
        if (utils.modifierKeyPressed(event)) {
          return;
        }
        el = event.currentTarget;
        $el = $(el);
        isAnchor = el.nodeName === 'A';
        href = $el.attr('href') || $el.data('href') || null;
        if (href === null || href === void 0 || href === '' || href.charAt(0) === '#') {
          return;
        }
        if (isAnchor && ($el.attr('target') === '_blank' || $el.attr('rel') === 'external' || ((_ref = el.protocol) !== 'http:' && _ref !== 'https:' && _ref !== 'file:'))) {
          return;
        }
        skipRouting = this.settings.skipRouting;
        type = typeof skipRouting;
        if (type === 'function' && !skipRouting(href, el) || type === 'string' && $el.is(skipRouting)) {
          return;
        }
        internal = !isAnchor || ((_ref1 = el.hostname) === location.hostname || _ref1 === '');
        if (!internal) {
          if (this.settings.openExternalToBlank) {
            event.preventDefault();
            window.open(el.href);
          }
          return;
        }
        if (isAnchor) {
          path = el.pathname + el.search;
          if (path.charAt(0) !== '/') {
            path = "/" + path;
          }
        } else {
          path = href;
        }
        this.publishEvent('!router:route', path, function(routed) {
          if (routed) {
            event.preventDefault();
          } else if (!isAnchor) {
            location.href = path;
          }
        });
      };

      Layout.prototype.disposed = false;

      Layout.prototype.dispose = function() {
        if (this.disposed) {
          return;
        }
        this.stopLinkRouting();
        this.unsubscribeAllEvents();
        this.undelegateEvents();
        delete this.title;
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Layout;

    })();
  }
});

require.define({
  'chaplin/views/view': function(exports, require, module) {
    var $, Backbone, EventBroker, Model, View, utils, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    utils = require('chaplin/lib/utils');
    EventBroker = require('chaplin/lib/event_broker');
    Model = require('chaplin/models/model');
    return module.exports = View = (function(_super) {

      __extends(View, _super);

      _(View.prototype).extend(EventBroker);

      View.prototype.autoRender = false;

      View.prototype.container = null;

      View.prototype.containerMethod = 'append';

      View.prototype.subviews = null;

      View.prototype.subviewsByName = null;

      View.prototype.wrapMethod = function(name) {
        var func, instance;
        instance = this;
        func = instance[name];
        instance["" + name + "IsWrapped"] = true;
        return instance[name] = function() {
          if (this.disposed) {
            return false;
          }
          func.apply(instance, arguments);
          instance["after" + (utils.upcase(name))].apply(instance, arguments);
          return instance;
        };
      };

      function View() {
        if (this.initialize !== View.prototype.initialize) {
          this.wrapMethod('initialize');
        }
        if (this.render !== View.prototype.render) {
          this.wrapMethod('render');
        } else {
          this.render = _(this.render).bind(this);
        }
        View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.initialize = function(options) {
        var prop, _i, _len, _ref;
        if (options) {
          _ref = ['autoRender', 'container', 'containerMethod'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            if (options[prop] != null) {
              this[prop] = options[prop];
            }
          }
        }
        this.subviews = [];
        this.subviewsByName = {};
        if (this.model || this.collection) {
          this.modelBind('dispose', this.dispose);
        }
        if (!this.initializeIsWrapped) {
          return this.afterInitialize();
        }
      };

      View.prototype.afterInitialize = function() {
        if (this.autoRender) {
          return this.render();
        }
      };

      View.prototype.delegate = function(eventType, second, third) {
        var handler, selector;
        if (typeof eventType !== 'string') {
          throw new TypeError('View#delegate: first argument must be a string');
        }
        if (arguments.length === 2) {
          handler = second;
        } else if (arguments.length === 3) {
          selector = second;
          if (typeof selector !== 'string') {
            throw new TypeError('View#delegate: ' + 'second argument must be a string');
          }
          handler = third;
        } else {
          throw new TypeError('View#delegate: ' + 'only two or three arguments are allowed');
        }
        if (typeof handler !== 'function') {
          throw new TypeError('View#delegate: ' + 'handler argument must be function');
        }
        eventType += ".delegate" + this.cid;
        handler = _(handler).bind(this);
        if (selector) {
          this.$el.on(eventType, selector, handler);
        } else {
          this.$el.on(eventType, handler);
        }
        return handler;
      };

      View.prototype.undelegate = function() {
        return this.$el.unbind(".delegate" + this.cid);
      };

      View.prototype.modelBind = function(type, handler) {
        var modelOrCollection;
        if (typeof type !== 'string') {
          throw new TypeError('View#modelBind: ' + 'type must be a string');
        }
        if (typeof handler !== 'function') {
          throw new TypeError('View#modelBind: ' + 'handler argument must be function');
        }
        modelOrCollection = this.model || this.collection;
        if (!modelOrCollection) {
          throw new TypeError('View#modelBind: no model or collection set');
        }
        modelOrCollection.off(type, handler, this);
        return modelOrCollection.on(type, handler, this);
      };

      View.prototype.modelUnbind = function(type, handler) {
        var modelOrCollection;
        if (typeof type !== 'string') {
          throw new TypeError('View#modelUnbind: ' + 'type argument must be a string');
        }
        if (typeof handler !== 'function') {
          throw new TypeError('View#modelUnbind: ' + 'handler argument must be a function');
        }
        modelOrCollection = this.model || this.collection;
        if (!modelOrCollection) {
          return;
        }
        return modelOrCollection.off(type, handler);
      };

      View.prototype.modelUnbindAll = function() {
        var modelOrCollection;
        modelOrCollection = this.model || this.collection;
        if (!modelOrCollection) {
          return;
        }
        return modelOrCollection.off(null, null, this);
      };

      View.prototype.pass = function(attribute, selector) {
        var _this = this;
        return this.modelBind("change:" + attribute, function(model, value) {
          var $el;
          $el = _this.$(selector);
          if ($el.is('input, textarea, select, button')) {
            return $el.val(value);
          } else {
            return $el.text(value);
          }
        });
      };

      View.prototype.subview = function(name, view) {
        if (name && view) {
          this.removeSubview(name);
          this.subviews.push(view);
          this.subviewsByName[name] = view;
          return view;
        } else if (name) {
          return this.subviewsByName[name];
        }
      };

      View.prototype.removeSubview = function(nameOrView) {
        var index, name, otherName, otherView, view, _ref;
        if (!nameOrView) {
          return;
        }
        if (typeof nameOrView === 'string') {
          name = nameOrView;
          view = this.subviewsByName[name];
        } else {
          view = nameOrView;
          _ref = this.subviewsByName;
          for (otherName in _ref) {
            otherView = _ref[otherName];
            if (view === otherView) {
              name = otherName;
              break;
            }
          }
        }
        if (!(name && view && view.dispose)) {
          return;
        }
        view.dispose();
        index = _(this.subviews).indexOf(view);
        if (index > -1) {
          this.subviews.splice(index, 1);
        }
        return delete this.subviewsByName[name];
      };

      View.prototype.getTemplateData = function() {
        var items, model, modelOrCollection, templateData, _i, _len, _ref;
        if (this.model) {
          templateData = this.model.serialize();
        } else if (this.collection) {
          items = [];
          _ref = this.collection.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            model = _ref[_i];
            items.push(model.serialize());
          }
          templateData = {
            items: items
          };
        } else {
          templateData = {};
        }
        modelOrCollection = this.model || this.collection;
        if (modelOrCollection) {
          if (typeof modelOrCollection.state === 'function' && !('resolved' in templateData)) {
            templateData.resolved = modelOrCollection.state() === 'resolved';
          }
          if (typeof modelOrCollection.isSynced === 'function' && !('synced' in templateData)) {
            templateData.synced = modelOrCollection.isSynced();
          }
        }
        return templateData;
      };

      View.prototype.getTemplateFunction = function() {
        throw new Error('View#getTemplateFunction must be overridden');
      };

      View.prototype.render = function() {
        var html, templateFunc;
        if (this.disposed) {
          return false;
        }
        templateFunc = this.getTemplateFunction();
        if (typeof templateFunc === 'function') {
          html = templateFunc(this.getTemplateData());
          this.$el.empty().append(html);
        }
        if (!this.renderIsWrapped) {
          this.afterRender();
        }
        return this;
      };

      View.prototype.afterRender = function() {
        if (this.container) {
          $(this.container)[this.containerMethod](this.el);
          return this.trigger('addedToDOM');
        }
      };

      View.prototype.disposed = false;

      View.prototype.dispose = function() {
        var prop, properties, subview, _i, _j, _len, _len1, _ref;
        if (this.disposed) {
          return;
        }
        _ref = this.subviews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subview = _ref[_i];
          subview.dispose();
        }
        this.unsubscribeAllEvents();
        this.modelUnbindAll();
        this.off();
        this.$el.remove();
        properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
        for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
          prop = properties[_j];
          delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return View;

    })(Backbone.View);
  }
});

require.define({
  'chaplin/views/collection_view': function(exports, require, module) {
    var $, CollectionView, View, _;
    $ = require('jquery');
    _ = require('underscore');
    View = require('chaplin/views/view');
    return module.exports = CollectionView = (function(_super) {

      __extends(CollectionView, _super);

      function CollectionView() {
        this.renderAllItems = __bind(this.renderAllItems, this);

        this.showHideFallback = __bind(this.showHideFallback, this);

        this.itemsResetted = __bind(this.itemsResetted, this);

        this.itemRemoved = __bind(this.itemRemoved, this);

        this.itemAdded = __bind(this.itemAdded, this);
        return CollectionView.__super__.constructor.apply(this, arguments);
      }

      CollectionView.prototype.animationDuration = 500;

      CollectionView.prototype.useCssAnimation = false;

      CollectionView.prototype.listSelector = null;

      CollectionView.prototype.$list = null;

      CollectionView.prototype.fallbackSelector = null;

      CollectionView.prototype.$fallback = null;

      CollectionView.prototype.loadingSelector = null;

      CollectionView.prototype.$loading = null;

      CollectionView.prototype.itemSelector = null;

      CollectionView.prototype.itemView = null;

      CollectionView.prototype.filterer = null;

      CollectionView.prototype.viewsByCid = null;

      CollectionView.prototype.visibleItems = null;

      CollectionView.prototype.getView = function(model) {
        if (this.itemView != null) {
          return new this.itemView({
            model: model
          });
        } else {
          throw new Error('The CollectionView#itemView property must be\
defined (or the getView() must be overridden)');
        }
      };

      CollectionView.prototype.getTemplateFunction = function() {};

      CollectionView.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        CollectionView.__super__.initialize.apply(this, arguments);
        _(options).defaults({
          render: true,
          renderItems: true,
          filterer: null
        });
        if (options.itemView != null) {
          this.itemView = options.itemView;
        }
        this.viewsByCid = {};
        this.visibleItems = [];
        this.addCollectionListeners();
        if (options.filterer) {
          this.filter(options.filterer);
        }
        if (options.render) {
          this.render();
        }
        if (options.renderItems) {
          return this.renderAllItems();
        }
      };

      CollectionView.prototype.addCollectionListeners = function() {
        this.modelBind('add', this.itemAdded);
        this.modelBind('remove', this.itemRemoved);
        return this.modelBind('reset', this.itemsResetted);
      };

      CollectionView.prototype.itemAdded = function(item, collection, options) {
        if (options == null) {
          options = {};
        }
        return this.renderAndInsertItem(item, options.index);
      };

      CollectionView.prototype.itemRemoved = function(item) {
        return this.removeViewForItem(item);
      };

      CollectionView.prototype.itemsResetted = function() {
        return this.renderAllItems();
      };

      CollectionView.prototype.render = function() {
        CollectionView.__super__.render.apply(this, arguments);
        this.$list = this.listSelector ? this.$(this.listSelector) : this.$el;
        this.initFallback();
        return this.initLoadingIndicator();
      };

      CollectionView.prototype.initFallback = function() {
        if (!this.fallbackSelector) {
          return;
        }
        this.$fallback = this.$(this.fallbackSelector);
        this.bind('visibilityChange', this.showHideFallback);
        return this.modelBind('syncStateChange', this.showHideFallback);
      };

      CollectionView.prototype.showHideFallback = function() {
        var visible;
        visible = this.visibleItems.length === 0 && (typeof this.collection.isSynced === 'function' ? this.collection.isSynced() : true);
        return this.$fallback.css('display', visible ? 'block' : 'none');
      };

      CollectionView.prototype.initLoadingIndicator = function() {
        if (!(this.loadingSelector && typeof this.collection.isSyncing === 'function')) {
          return;
        }
        this.$loading = this.$(this.loadingSelector);
        this.modelBind('syncStateChange', this.showHideLoadingIndicator);
        return this.showHideLoadingIndicator();
      };

      CollectionView.prototype.showHideLoadingIndicator = function() {
        var visible;
        visible = this.collection.length === 0 && this.collection.isSyncing();
        return this.$loading.css('display', visible ? 'block' : 'none');
      };

      CollectionView.prototype.filter = function(filterer, callback) {
        var included, index, item, view, _i, _len, _ref,
          _this = this;
        this.filterer = filterer;
        if (callback == null) {
          callback = function(view, included) {
            var display;
            display = included ? '' : 'none';
            view.$el.stop(true, true).css('display', display);
            return _this.updateVisibleItems(view.model, included, false);
          };
        }
        if (!_(this.viewsByCid).isEmpty()) {
          _ref = this.collection.models;
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            item = _ref[index];
            included = typeof filterer === 'function' ? filterer(item, index) : true;
            view = this.viewsByCid[item.cid];
            if (!view) {
              throw new Error('CollectionView#filter: ' + ("no view found for " + item.cid));
            }
            callback(view, included);
          }
        }
        return this.trigger('visibilityChange', this.visibleItems);
      };

      CollectionView.prototype.renderAllItems = function() {
        var cid, index, item, items, remainingViewsByCid, view, _i, _j, _len, _len1, _ref;
        items = this.collection.models;
        this.visibleItems = [];
        remainingViewsByCid = {};
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          view = this.viewsByCid[item.cid];
          if (view) {
            remainingViewsByCid[item.cid] = view;
          }
        }
        _ref = this.viewsByCid;
        for (cid in _ref) {
          if (!__hasProp.call(_ref, cid)) continue;
          view = _ref[cid];
          if (!(cid in remainingViewsByCid)) {
            this.removeView(cid, view);
          }
        }
        for (index = _j = 0, _len1 = items.length; _j < _len1; index = ++_j) {
          item = items[index];
          view = this.viewsByCid[item.cid];
          if (view) {
            this.insertView(item, view, index, false);
          } else {
            this.renderAndInsertItem(item, index);
          }
        }
        if (!items.length) {
          return this.trigger('visibilityChange', this.visibleItems);
        }
      };

      CollectionView.prototype.renderAndInsertItem = function(item, index) {
        var view;
        view = this.renderItem(item);
        return this.insertView(item, view, index);
      };

      CollectionView.prototype.renderItem = function(item) {
        var view;
        view = this.viewsByCid[item.cid];
        if (!view) {
          view = this.getView(item);
          this.viewsByCid[item.cid] = view;
        }
        view.render();
        return view;
      };

      CollectionView.prototype.insertView = function(item, view, index, enableAnimation) {
        var $list, $next, $previous, $viewEl, children, included, length, position, viewEl,
          _this = this;
        if (index == null) {
          index = null;
        }
        if (enableAnimation == null) {
          enableAnimation = true;
        }
        position = typeof index === 'number' ? index : this.collection.indexOf(item);
        included = typeof this.filterer === 'function' ? this.filterer(item, position) : true;
        viewEl = view.el;
        $viewEl = view.$el;
        if (included) {
          if (enableAnimation) {
            if (this.useCssAnimation) {
              $viewEl.addClass('animated-item-view');
            } else {
              $viewEl.css('opacity', 0);
            }
          }
        } else {
          $viewEl.css('display', 'none');
        }
        $list = this.$list;
        children = this.itemSelector ? $list.children(this.itemSelector) : $list.children();
        if (children.get(position) !== viewEl) {
          length = children.length;
          if (length === 0 || position === length) {
            $list.append(viewEl);
          } else {
            if (position === 0) {
              $next = children.eq(position);
              $next.before(viewEl);
            } else {
              $previous = children.eq(position - 1);
              $previous.after(viewEl);
            }
          }
        }
        view.trigger('addedToDOM');
        this.updateVisibleItems(item, included);
        if (enableAnimation && included) {
          if (this.useCssAnimation) {
            setTimeout(function() {
              return $viewEl.addClass('animated-item-view-end');
            }, 0);
          } else {
            $viewEl.animate({
              opacity: 1
            }, this.animationDuration);
          }
        }
      };

      CollectionView.prototype.removeViewForItem = function(item) {
        var view;
        this.updateVisibleItems(item, false);
        view = this.viewsByCid[item.cid];
        return this.removeView(item.cid, view);
      };

      CollectionView.prototype.removeView = function(cid, view) {
        view.dispose();
        return delete this.viewsByCid[cid];
      };

      CollectionView.prototype.updateVisibleItems = function(item, includedInFilter, triggerEvent) {
        var includedInVisibleItems, visibilityChanged, visibleItemsIndex;
        if (triggerEvent == null) {
          triggerEvent = true;
        }
        visibilityChanged = false;
        visibleItemsIndex = _(this.visibleItems).indexOf(item);
        includedInVisibleItems = visibleItemsIndex > -1;
        if (includedInFilter && !includedInVisibleItems) {
          this.visibleItems.push(item);
          visibilityChanged = true;
        } else if (!includedInFilter && includedInVisibleItems) {
          this.visibleItems.splice(visibleItemsIndex, 1);
          visibilityChanged = true;
        }
        if (visibilityChanged && triggerEvent) {
          this.trigger('visibilityChange', this.visibleItems);
        }
        return visibilityChanged;
      };

      CollectionView.prototype.dispose = function() {
        var cid, prop, properties, view, _i, _len, _ref;
        if (this.disposed) {
          return;
        }
        _ref = this.viewsByCid;
        for (cid in _ref) {
          if (!__hasProp.call(_ref, cid)) continue;
          view = _ref[cid];
          view.dispose();
        }
        properties = ['$list', '$fallback', '$loading', 'viewsByCid', 'visibleItems'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          delete this[prop];
        }
        return CollectionView.__super__.dispose.apply(this, arguments);
      };

      return CollectionView;

    })(View);
  }
});

require.define({
  'chaplin/lib/route': function(exports, require, module) {
    var Backbone, Controller, EventBroker, Route, _;
    _ = require('underscore');
    Backbone = require('backbone');
    EventBroker = require('chaplin/lib/event_broker');
    Controller = require('chaplin/controllers/controller');
    return module.exports = Route = (function() {
      var escapeRegExp, queryStringFieldSeparator, queryStringValueSeparator, reservedParams;

      Route.extend = Backbone.Model.extend;

      _(Route.prototype).extend(EventBroker);

      reservedParams = ['path', 'changeURL'];

      escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

      queryStringFieldSeparator = '&';

      queryStringValueSeparator = '=';

      function Route(pattern, target, options) {
        var _ref;
        this.options = options != null ? options : {};
        this.handler = __bind(this.handler, this);

        this.addParamName = __bind(this.addParamName, this);

        this.pattern = pattern;
        _ref = target.split('#'), this.controller = _ref[0], this.action = _ref[1];
        if (_(Controller.prototype).has(this.action)) {
          throw new Error('Route: You should not use existing controller properties as action names');
        }
        this.createRegExp();
      }

      Route.prototype.createRegExp = function() {
        var pattern;
        if (_.isRegExp(this.pattern)) {
          this.regExp = this.pattern;
          return;
        }
        pattern = this.pattern.replace(escapeRegExp, '\\$&').replace(/(?::|\*)(\w+)/g, this.addParamName);
        return this.regExp = RegExp("^" + pattern + "(?=\\?|$)");
      };

      Route.prototype.addParamName = function(match, paramName) {
        var _ref;
        if ((_ref = this.paramNames) == null) {
          this.paramNames = [];
        }
        if (_(reservedParams).include(paramName)) {
          throw new Error("Route#addParamName: parameter name " + paramName + " is reserved");
        }
        this.paramNames.push(paramName);
        if (match.charAt(0) === ':') {
          return '([^\/\?]+)';
        } else {
          return '(.*?)';
        }
      };

      Route.prototype.test = function(path) {
        var constraint, constraints, matched, name, params;
        matched = this.regExp.test(path);
        if (!matched) {
          return false;
        }
        constraints = this.options.constraints;
        if (constraints) {
          params = this.extractParams(path);
          for (name in constraints) {
            if (!__hasProp.call(constraints, name)) continue;
            constraint = constraints[name];
            if (!constraint.test(params[name])) {
              return false;
            }
          }
        }
        return true;
      };

      Route.prototype.handler = function(path, options) {
        var params;
        params = this.buildParams(path, options);
        return this.publishEvent('matchRoute', this, params);
      };

      Route.prototype.buildParams = function(path, options) {
        var params, patternParams, queryParams;
        params = {};
        queryParams = this.extractQueryParams(path);
        _(params).extend(queryParams);
        patternParams = this.extractParams(path);
        _(params).extend(patternParams);
        _(params).extend(this.options.params);
        params.changeURL = Boolean(options && options.changeURL);
        params.path = path;
        return params;
      };

      Route.prototype.extractParams = function(path) {
        var index, match, matches, paramName, params, _i, _len, _ref;
        params = {};
        matches = this.regExp.exec(path);
        _ref = matches.slice(1);
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          match = _ref[index];
          paramName = this.paramNames ? this.paramNames[index] : index;
          params[paramName] = match;
        }
        return params;
      };

      Route.prototype.extractQueryParams = function(path) {
        var current, field, matches, pair, pairs, params, queryString, regExp, value, _i, _len, _ref;
        params = {};
        regExp = /\?(.+?)(?=#|$)/;
        matches = regExp.exec(path);
        if (!matches) {
          return params;
        }
        queryString = matches[1];
        pairs = queryString.split(queryStringFieldSeparator);
        for (_i = 0, _len = pairs.length; _i < _len; _i++) {
          pair = pairs[_i];
          if (!pair.length) {
            continue;
          }
          _ref = pair.split(queryStringValueSeparator), field = _ref[0], value = _ref[1];
          if (!field.length) {
            continue;
          }
          field = decodeURIComponent(field);
          value = decodeURIComponent(value);
          current = params[field];
          if (current) {
            if (current.push) {
              current.push(value);
            } else {
              params[field] = [current, value];
            }
          } else {
            params[field] = value;
          }
        }
        return params;
      };

      return Route;

    })();
  }
});

require.define({
  'chaplin/lib/router': function(exports, require, module) {
    var Backbone, EventBroker, Route, Router, mediator, _;
    _ = require('underscore');
    Backbone = require('backbone');
    mediator = require('chaplin/mediator');
    EventBroker = require('chaplin/lib/event_broker');
    Route = require('chaplin/lib/route');
    return module.exports = Router = (function() {

      Router.extend = Backbone.Model.extend;

      _(Router.prototype).extend(EventBroker);

      function Router(options) {
        this.options = options != null ? options : {};
        this.route = __bind(this.route, this);

        this.match = __bind(this.match, this);

        _(this.options).defaults({
          pushState: true
        });
        this.subscribeEvent('!router:route', this.routeHandler);
        this.subscribeEvent('!router:changeURL', this.changeURLHandler);
        this.createHistory();
      }

      Router.prototype.createHistory = function() {
        return Backbone.history || (Backbone.history = new Backbone.History());
      };

      Router.prototype.startHistory = function() {
        return Backbone.history.start(this.options);
      };

      Router.prototype.stopHistory = function() {
        if (Backbone.History.started) {
          return Backbone.history.stop();
        }
      };

      Router.prototype.match = function(pattern, target, options) {
        var route;
        if (options == null) {
          options = {};
        }
        route = new Route(pattern, target, options);
        Backbone.history.handlers.push({
          route: route,
          callback: route.handler
        });
        return route;
      };

      Router.prototype.route = function(path) {
        var handler, _i, _len, _ref;
        path = path.replace(/^(\/#|\/)/, '');
        _ref = Backbone.history.handlers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          if (handler.route.test(path)) {
            handler.callback(path, {
              changeURL: true
            });
            return true;
          }
        }
        return false;
      };

      Router.prototype.routeHandler = function(path, callback) {
        var routed;
        routed = this.route(path);
        return typeof callback === "function" ? callback(routed) : void 0;
      };

      Router.prototype.changeURL = function(url) {
        return Backbone.history.navigate(url, {
          trigger: false
        });
      };

      Router.prototype.changeURLHandler = function(url) {
        return this.changeURL(url);
      };

      Router.prototype.disposed = false;

      Router.prototype.dispose = function() {
        if (this.disposed) {
          return;
        }
        this.stopHistory();
        delete Backbone.history;
        this.unsubscribeAllEvents();
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Router;

    })();
  }
});

require.define({
  'chaplin/lib/event_broker': function(exports, require, module) {
    var EventBroker, mediator;
    mediator = require('chaplin/mediator');
    EventBroker = {
      subscribeEvent: function(type, handler) {
        if (typeof type !== 'string') {
          throw new TypeError('EventBroker#subscribeEvent: ' + 'type argument must be a string');
        }
        if (typeof handler !== 'function') {
          throw new TypeError('EventBroker#subscribeEvent: ' + 'handler argument must be a function');
        }
        mediator.unsubscribe(type, handler, this);
        return mediator.subscribe(type, handler, this);
      },
      unsubscribeEvent: function(type, handler) {
        if (typeof type !== 'string') {
          throw new TypeError('EventBroker#unsubscribeEvent: ' + 'type argument must be a string');
        }
        if (typeof handler !== 'function') {
          throw new TypeError('EventBroker#unsubscribeEvent: ' + 'handler argument must be a function');
        }
        return mediator.unsubscribe(type, handler);
      },
      unsubscribeAllEvents: function() {
        return mediator.unsubscribe(null, null, this);
      },
      publishEvent: function() {
        var args, type;
        type = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (typeof type !== 'string') {
          throw new TypeError('EventBroker#publishEvent: ' + 'type argument must be a string');
        }
        return mediator.publish.apply(mediator, [type].concat(__slice.call(args)));
      }
    };
    if (typeof Object.freeze === "function") {
      Object.freeze(EventBroker);
    }
    return module.exports = EventBroker;
  }
});

require.define({
  'chaplin/lib/support': function(exports, require, module) {
    var support;
    support = {
      propertyDescriptors: (function() {
        var o;
        if (!(typeof Object.defineProperty === 'function' && typeof Object.defineProperties === 'function')) {
          return false;
        }
        try {
          o = {};
          Object.defineProperty(o, 'foo', {
            value: 'bar'
          });
          return o.foo === 'bar';
        } catch (error) {
          return false;
        }
      })()
    };
    return module.exports = support;
  }
});

require.define({
  'chaplin/lib/sync_machine': function(exports, require, module) {
    var STATE_CHANGE, SYNCED, SYNCING, SyncMachine, UNSYNCED, event, _fn, _i, _len, _ref;
    UNSYNCED = 'unsynced';
    SYNCING = 'syncing';
    SYNCED = 'synced';
    STATE_CHANGE = 'syncStateChange';
    SyncMachine = {
      _syncState: UNSYNCED,
      _previousSyncState: null,
      syncState: function() {
        return this._syncState;
      },
      isUnsynced: function() {
        return this._syncState === UNSYNCED;
      },
      isSynced: function() {
        return this._syncState === SYNCED;
      },
      isSyncing: function() {
        return this._syncState === SYNCING;
      },
      unsync: function() {
        var _ref;
        if ((_ref = this._syncState) === SYNCING || _ref === SYNCED) {
          this._previousSync = this._syncState;
          this._syncState = UNSYNCED;
          this.trigger(this._syncState, this, this._syncState);
          this.trigger(STATE_CHANGE, this, this._syncState);
        }
      },
      beginSync: function() {
        var _ref;
        if ((_ref = this._syncState) === UNSYNCED || _ref === SYNCED) {
          this._previousSync = this._syncState;
          this._syncState = SYNCING;
          this.trigger(this._syncState, this, this._syncState);
          this.trigger(STATE_CHANGE, this, this._syncState);
        }
      },
      finishSync: function() {
        if (this._syncState === SYNCING) {
          this._previousSync = this._syncState;
          this._syncState = SYNCED;
          this.trigger(this._syncState, this, this._syncState);
          this.trigger(STATE_CHANGE, this, this._syncState);
        }
      },
      abortSync: function() {
        if (this._syncState === SYNCING) {
          this._syncState = this._previousSync;
          this._previousSync = this._syncState;
          this.trigger(this._syncState, this, this._syncState);
          this.trigger(STATE_CHANGE, this, this._syncState);
        }
      }
    };
    _ref = [UNSYNCED, SYNCING, SYNCED, STATE_CHANGE];
    _fn = function(event) {
      return SyncMachine[event] = function(callback, context) {
        if (context == null) {
          context = this;
        }
        this.on(event, callback, context);
        if (this._syncState === event) {
          return callback.call(context);
        }
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      _fn(event);
    }
    if (typeof Object.freeze === "function") {
      Object.freeze(SyncMachine);
    }
    return module.exports = SyncMachine;
  }
});

require.define({
  'chaplin/lib/utils': function(exports, require, module) {
    var support, utils;
    support = require('chaplin/lib/support');
    utils = {
      beget: (function() {
        var ctor;
        if (typeof Object.create === 'function') {
          return Object.create;
        } else {
          ctor = function() {};
          return function(obj) {
            ctor.prototype = obj;
            return new ctor;
          };
        }
      })(),
      readonly: (function() {
        var readonlyDescriptor;
        if (support.propertyDescriptors) {
          readonlyDescriptor = {
            writable: false,
            enumerable: true,
            configurable: false
          };
          return function() {
            var obj, prop, properties, _i, _len;
            obj = arguments[0], properties = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            for (_i = 0, _len = properties.length; _i < _len; _i++) {
              prop = properties[_i];
              readonlyDescriptor.value = obj[prop];
              Object.defineProperty(obj, prop, readonlyDescriptor);
            }
            return true;
          };
        } else {
          return function() {
            return false;
          };
        }
      })(),
      upcase: function(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      },
      underscorize: function(string) {
        return string.replace(/[A-Z]/g, function(char, index) {
          return (index !== 0 ? '_' : '') + char.toLowerCase();
        });
      },
      modifierKeyPressed: function(event) {
        return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
      }
    };
    if (typeof Object.seal === "function") {
      Object.seal(utils);
    }
    return module.exports = utils;
  }
});

require.define({
  'chaplin': function(exports, require, module) {
    var Application, Collection, CollectionView, Controller, Dispatcher, EventBroker, Layout, Model, Route, Router, SyncMachine, View, mediator, support, utils;
    Application = require('chaplin/application');
    mediator = require('chaplin/mediator');
    Dispatcher = require('chaplin/dispatcher');
    Controller = require('chaplin/controllers/controller');
    Collection = require('chaplin/models/collection');
    Model = require('chaplin/models/model');
    Layout = require('chaplin/views/layout');
    View = require('chaplin/views/view');
    CollectionView = require('chaplin/views/collection_view');
    Route = require('chaplin/lib/route');
    Router = require('chaplin/lib/router');
    EventBroker = require('chaplin/lib/event_broker');
    support = require('chaplin/lib/support');
    SyncMachine = require('chaplin/lib/sync_machine');
    utils = require('chaplin/lib/utils');
    return module.exports = {
      Application: Application,
      mediator: mediator,
      Dispatcher: Dispatcher,
      Controller: Controller,
      Collection: Collection,
      Model: Model,
      Layout: Layout,
      View: View,
      CollectionView: CollectionView,
      Route: Route,
      Router: Router,
      EventBroker: EventBroker,
      support: support,
      SyncMachine: SyncMachine,
      utils: utils
    };
  }
});
;

