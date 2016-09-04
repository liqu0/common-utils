# Python3 only!
import sys
if sys.version_info[0] == 2:
    print("LiquoEncrypt only runs in Python 3.")
    exit();

lencrypt_options = {
    "ranges": [[34, 127], [161, 768], [910, 930], [931, 1154], [1162, 1328], [1329, 1366], [1377, 1416], [1488, 1515], [1566, 1611]],
    "split_size": 3,
    "binary_length": 11,
    "chars": []
}
for rang3 in lencrypt_options["ranges"]:
    lencrypt_options["chars"] += [chr(x) for x in range(*rang3)]

def encrypt(expr):
    splitted_strings = []
    _c = 0
    while _c < len(expr):
        splitted_strings.append(expr[_c:_c+lencrypt_options["split_size"] if _c+lencrypt_options["split_size"] <= len(expr) else len(expr)])
        _c += lencrypt_options["split_size"]
    _c = 0
    while _c < len(splitted_strings):
        binary_string = ""
        for char in splitted_strings[_c]:
            binary_string += ("{:0>" + str(lencrypt_options["binary_length"]) + "}").format(bin(ord(char))[2:])
        repr_integer = int(binary_string, 2)
        del binary_string
        output = ""
        while repr_integer > 1:
            output = lencrypt_options["chars"][repr_integer % len(lencrypt_options["chars"])] + output
            repr_integer //= len(lencrypt_options["chars"])
        splitted_strings[_c] = output
        _c += 1
    return "!".join(splitted_strings)
