/////////////////////////////////////
// Pure Javascript form validation //
// Written by Ryan Taylor          //
// ryantaylodev.ca                 //
/////////////////////////////////////

// Polyfills
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

// Begin implementation

var VAL_SELECTOR = 'jsval-';
var VAL_SELECTOR_MSG = VAL_SELECTOR + 'message';

document.addEventListener( 'DOMContentLoaded', function () {
  
  var el = document.getElementById( 'send' );
  el.addEventListener( 'click', function ( e ) {
    //e.preventDefault();
  });
  
  var valType;
  
  // Loop through all forms on the page
  Array.prototype.forEach.call( document.forms, function ( form, idx, arr ) {
    
    // Loop through all elements in the form
    Array.prototype.forEach.call( form.elements, function ( element, idx, arr ) {
      
      // If the element is tagged for validation, handle it
      if ( element.className.indexOf( VAL_SELECTOR ) != -1 ) {
        
        // Loop through all classes on element to find the validation indicators
        Array.prototype.forEach.call( element.classList, function ( elClass, idx, arr ) {
          
          // Make sure it contains the selector so we don't waste time checking
          // a bunch of conditionals if we don't have to
          if ( elClass.indexOf( VAL_SELECTOR ) != -1 ) {
            
            // Remove selector to get validation type
            valType = elClass.replace( VAL_SELECTOR, '' );
            
            switch ( valType ) {
              case 'text-required':
                valTextRequired( element );
                break;
              case 'email':
                valEmail( element, false );
                break;
              case 'email-required':
                valEmail( element, true );
                break;
              default:
                break;
            }
          }
        });
      }
    });
  });
});

function valTextRequired( element ) {
  
  var messageElement = getMessageElement( element );
  
  // Listener for when input changes. If input is empty after a change we
  // want to show the user a validity message.
  element.addEventListener( 'input', function ( e ) {
    if ( element.value == '' || element.value == null )
      messageElement.style.opacity = 100;
    else
      messageElement.style.opacity = 0;
  });
  
  // Listener for when input loses focus. This is mainly for when a user
  // tabs out of an input without entering any text.
  element.addEventListener( 'blur', function ( e ) {
    if ( element.value == '' || element.value == null )
      messageElement.style.opacity = 100;
    else
      messageElement.style.opacity = 0;
  });
}

function valEmail( element, required ) {
  
  var messageElement = getMessageElement( element );
  // Taken from HTML5 spec
  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  element.addEventListener( 'input', function ( e ) {
    if ( required ) {
      // If required, just check regex, since it will fail on empty string
      if ( element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
    else {
      // If not required, let user leave input empty.
      if ( element.value == '' ||
           element.value == null ||
           element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
  });
  
  element.addEventListener( 'blur', function ( e ) {
    if ( required ) {
      // If required, just check regex, since it will fail on empty string
      if ( element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
    else {
      // If not required, let user leave input empty.
      if ( element.value == '' ||
           element.value == null ||
           element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
  });
}

// Message element is selected as the first sibling element of the form element's
// parent node that's found when the parent's child nodes are iterated through.
function getMessageElement( formElement ) {
  for ( var i = 0; i < formElement.parentNode.childNodes.length; i ++ ) {
    var node = formElement.parentNode.childNodes[i];
    if ( node.className != undefined && node.className.indexOf( VAL_SELECTOR_MSG ) != -1 ) {
      return node;
    }
  }
  
  return undefined;
}