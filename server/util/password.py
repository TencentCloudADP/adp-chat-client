import binascii
import hashlib


def hash(password: str, salt: str) -> str:
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), binascii.unhexlify(salt), 10240)
    return binascii.hexlify(dk).decode()


def compare(password: str, password_hashed: str, salt: str):
    # compare password
    return hash(password, salt) == password_hashed
