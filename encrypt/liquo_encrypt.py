# Python3 only!
import sys
if sys.version_info[0] == 2:
    print("LiquoEncrypt only runs in Python 3.")
    exit();



def new_liquoEncryptor():
    default_options = {
        "ranges": [[34, 127], [161, 768], [910, 930], [931, 1154], [1162, 1328], [1329, 1366], [1377, 1416], [1488, 1515], [1566, 1611]],
        "split_size": 3,
        "binary_length": 11,
        "chars": []
    }
    for rang3 in default_options["ranges"]:
        default_options["chars"] += [chr(x) for x in range(*rang3)]

    class EncryptOptions:
        def __init__(self, sps, blength, chars):
            self.split_sizes = sps
            self.binary_length = blength
            self.chars = chars

        @staticmethod
        def random_options():
            import random
            return EncryptOptions(
                [], random.randint(10, 15), default_options["chars"][:random.randint(
                    len(default_options["chars"]) // 2,
                    len(default_options["chars"])
            )])

        @staticmethod
        def default_options():
            return EncryptOptions([], default_options["binary_length"], default_options["chars"])

    def parse_key(key):
        if key == None:
            return EncryptOptions.default_options()
        else:
            charlen = len(default_options["chars"]) if default_options["chars"].index(key[0]) == 0 else default_options["chars"].index(key[0])
            blen = default_options["chars"].index(key[1])
            ss = [default_options["chars"].index(i) for i in key[2:]]
            return EncryptOptions(ss, blen, default_options["chars"][:charlen])

    def create_key(options):
        output = default_options["chars"][0 if len(options.chars) == len(default_options["chars"]) else len(options.chars)]
        output += default_options["chars"][options.binary_length]
        for size in options.split_sizes:
            output += default_options["chars"][size]
        return output

    class LiquoEncryptor:
        def __init__(self, encr, decr):
            self.encrypt = encr
            self.decrypt = decr

    def encrypt(expr, need_key=False):
        opts = EncryptOptions.default_options() if not need_key else EncryptOptions.random_options()
        splitted_strings = []
        _c = 0
        while _c < len(expr):
            splitted_strings.append(expr[_c:_c+default_options["split_size"] if _c+default_options["split_size"] <= len(expr) else len(expr)])
            _c += default_options["split_size"]
        _c = 0
        while _c < len(splitted_strings):
            binary_string = ""
            for char in splitted_strings[_c]:
                binary_string += ("{:0>" + str(opts.binary_length) + "}").format(bin(ord(char))[2:])
            repr_integer = int(binary_string, 2)
            del binary_string
            output = ""
            while repr_integer > 1:
                output = opts.chars[repr_integer % len(opts.chars)] + output
                repr_integer //= len(opts.chars)
            splitted_strings[_c] = output
            _c += 1
        opts.split_sizes = [len(i) for i in splitted_strings]
        return "!".join(splitted_strings) if not need_key else ("".join(splitted_strings), create_key(opts))

    def decrypt(expr, key=None):
        opts = parse_key(key)
        if key == None:
            segments = expr.split("!")
        else:
            cursor = 0
            segments = []
            for length in opts.split_sizes:
                segments.append(expr[cursor:cursor+length])
                cursor += length
        output = ""
        for part in segments:
            int_repr = 0
            for i in range(len(part)):
                int_repr += opts.chars.index(part[i]) * (len(opts.chars) ** (len(part) - 1 - i))
            int_repr = bin(int_repr)[2:]
            while len(int_repr) % opts.binary_length != 0:
                int_repr = "0" + int_repr
            for i in range(0, len(int_repr), opts.binary_length):
                output += chr(int(int_repr[i:i+opts.binary_length], 2))
        return output

    return LiquoEncryptor(encrypt, decrypt)
