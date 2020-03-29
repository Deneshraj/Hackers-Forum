import os
import binascii
from users.models import User, AuthToken

def generate_token():
    unique_token = False
    token = ""

    while not unique_token:
        token += binascii.hexlify(os.urandom(64)).decode()
        tokens = AuthToken.objects.filter(token=token)

        if len(tokens) > 0:
            continue
        else:
            unique_token = True

    return token