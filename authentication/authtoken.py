import os
import binascii
from users.models import User

def generate_token():
    unique_token = False
    token = ""

    while not unique_token:
        token += binascii.hexlify(os.urandom(64)).decode()
        users = User.objects.filter(token=token)

        if len(users) > 0:
            continue
        else:
            unique_token = True

    return token