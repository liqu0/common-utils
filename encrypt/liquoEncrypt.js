// Convert a string to LiquoEncryption encoding.
const LiquoEncrypt = (function() {
  var options = {
    unicodeCharacterRanges: [[34, 127], [161, 768], [910, 930], [931, 1154], [1162, 1328], [1329, 1366], [1377, 1416], [1488, 1515], [1566, 1611]],
    splitSize: 3,
    charsFunction: function() {
      var output = [];
      for(var range of options.unicodeCharacterRanges){
        for(var i = range[0]; i < range[1]; i++){
          output += String.fromCharCode(i);
        }
      }
      return output;
    }
  };
  options.chars = options.charsFunction();
  options.binaryLength = options.chars.length.toString(2).length;

  function $c(str){
    var binString = "";
    for(var char of str){
      var charBinary = char.charCodeAt(0).toString(2);
      while(charBinary.length < options.binaryLength){
        charBinary = "0" + charBinary;
      }
      binString += charBinary;
    }
    return parseInt(binString, 2);
  }

  function $d(int){
    var binString = int.toString(2);
    var target = options.binaryLength - (binString.length % options.binaryLength) + binString.length;
    while(binString.length < target){
      binString = "0" + binString;
    }
    var output = "";
    for(var i = 0; i < binString.length; i += options.binaryLength){
      output += String.fromCharCode(parseInt(binString.substring(i, i + options.binaryLength), 2));
    }
    return output;
  }

  function $a(num){
    var output = "";
    while(num >= 1){
      output = options.chars[num % options.chars.length] + output;
      num = Math.floor(num / options.chars.length);
    }
    return output;
  }

  function $b(expr){
    var output = 0;
    for(var i = expr.length-1; i >= 0; i--){
      output += options.chars.indexOf(expr[i]) * Math.pow(options.chars.length, expr.length-1-i);
    }
    return output;
  }

  function $e(str){
    var output = [];
    for(var i = 0; i < str.length; i+=options.splitSize){
      output.push(str.substring(i, (i+options.splitSize >= str.length ? str.length : i+options.splitSize)));
    }
    return output;
  }

  return {
    encrypt: function(item) {
      return $e(item.toString()).map($c).map($a).join("!");
    },
    decrypt: function(expression){
      return expression.split("!").map($b).map($d).join("");
    }
  };
})();
