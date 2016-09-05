// Convert a string to LiquoEncryption encoding.
const LiquoEncrypt = (function() {
  var defaultOptions = {
    unicodeCharacterRanges: [[34, 127], [161, 768], [910, 930], [931, 1154], [1162, 1328], [1329, 1366], [1377, 1416], [1488, 1515], [1566, 1611]],
    splitSize: 3,
    charsFunction: function() {
      var output = [];
      for(var range of defaultOptions.unicodeCharacterRanges){
        for(var i = range[0]; i < range[1]; i++){
          output += String.fromCharCode(i);
        }
      }
      return output;
    }
  };
  defaultOptions.chars = defaultOptions.charsFunction();
  defaultOptions.binaryLength = defaultOptions.chars.length.toString(2).length;

  var SessionOptions = function(charLength, binarySplitLength, splitSizes){
    this.chars = defaultOptions.chars.substring(0, charLength) || defaultOptions.chars;
    this.binarySplitLength = binarySplitLength || defaultOptions.binaryLength;
    this.splitSizes = splitSizes || [];
  }

  SessionOptions.randomOptions = function() {
    function randInt(min, max){
      return Math.floor(Math.random() * (max - min)) + min;
    }
    return new SessionOptions(
      randInt(Math.floor(defaultOptions.chars.length / 2), defaultOptions.chars.length + 1),
      randInt(defaultOptions.binaryLength - 2, defaultOptions.binaryLength + 4)
    );
  }

  SessionOptions.prototype.createKey = function() {
    var output = defaultOptions.chars[this.chars.length % defaultOptions.chars.length];
    output += defaultOptions.chars[this.binarySplitLength];
    for(var splitSize of this.splitSizes){
      output += defaultOptions.chars[splitSize];
    }
    return output;
  }

  SessionOptions.fromKey = function(key){
    var charLength = defaultOptions.chars.indexOf(key[0]) === 0 ? defaultOptions.chars.length : defaultOptions.chars.indexOf(key[0]);
    var binarySplitLength = defaultOptions.chars.indexOf(key[1]);
    var splitSizes = [];
    for(var char of key.substring(2).split("")){
      splitSizes.push(defaultOptions.chars.indexOf(char))
    }
    return new SessionOptions(charLength, binarySplitLength, splitSizes);
  }

  function $c(str, opts){
    var binString = "";
    for(var char of str){
      var charBinary = char.charCodeAt(0).toString(2);
      while(charBinary.length < opts.binarySplitLength){
        charBinary = "0" + charBinary;
      }
      binString += charBinary;
    }
    return parseInt(binString, 2);
  }

  function $d(int, opts){
    var binString = int.toString(2);
    var target = opts.binarySplitLength - (binString.length % opts.binarySplitLength) + binString.length;
    while(binString.length < target){
      binString = "0" + binString;
    }
    var output = "";
    for(var i = 0; i < binString.length; i += opts.binarySplitLength){
      output += String.fromCharCode(parseInt(binString.substring(i, i + opts.binarySplitLength), 2));
    }
    return output;
  }

  function $a(num, opts){
    var output = "";
    while(num >= 1){
      output = opts.chars[num % opts.chars.length] + output;
      num = Math.floor(num / opts.chars.length);
    }
    return output;
  }

  function $b(expr, opts){
    var output = 0;
    for(var i = expr.length-1; i >= 0; i--){
      output += opts.chars.indexOf(expr[i]) * Math.pow(opts.chars.length, expr.length-1-i);
    }
    return output;
  }

  function $e(str, opts){
    var output = [];
    for(var i = 0; i < str.length; i+=defaultOptions.splitSize){
      output.push(str.substring(i, (i+defaultOptions.splitSize >= str.length ? str.length : i+defaultOptions.splitSize)));
    }
    return output;
  }

  function $f(str, opts){
    var output = [];
    var cursor = 0;
    for(var splitLength of opts.splitSizes){
      output.push(str.substring(cursor, cursor+splitLength));
      cursor += splitLength;
    }
    delete cursor;
    return output;
  }

  return {
    encrypt: function(item, needKey) {
      var options = needKey ? SessionOptions.randomOptions() : new SessionOptions();
      var unjoinedStrings = $e(item.toString())
          .map(function(item){return $c(item, options)})
          .map(function(item){return $a(item, options)});
      if(!needKey){
        return {encrypted: unjoinedStrings.join("!"), key: null};
      }else{
        for(var string of unjoinedStrings){
          options.splitSizes.push(string.length);
        }
        return {encrypted: unjoinedStrings.join(""), key: options.createKey()};
      }
    },
    decrypt: function(expression, key){
      var options = key ? SessionOptions.fromKey(key) : new SessionOptions();
      return (key ? $f(expression, options) : expression.split("!"))
          .map(function(item){return $b(item, options)})
          .map(function(item){return $d(item, options)})
          .join("");
    }
  };
})();
