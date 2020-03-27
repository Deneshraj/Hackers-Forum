import random

separators = [",", "!", "@", "#", "$", "&", "."]

def generate_token(id):
    id_list = id.split("-")
    token = ""
    token += id_list[0]
    for part in id_list[1:]:
        token += separators[random.randint(0, 6)] + part

    return token

def fetch_token(token):
    separated_list = [token[:8], token[9:13], token[14:18], token[19:23], token[24:]]
    return "-" .join(separated_list)