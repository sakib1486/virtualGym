import requests

from typing import Dict, Any

from django.conf import settings
from django.http import HttpResponse
from django.core.exceptions import ValidationError

import random


GOOGLE_ID_TOKEN_INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo'

# TODO: Can remove these 2 below (later)
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'


def google_validate_id_token(*, id_token):
    # Reference: https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
    response = requests.get(
        GOOGLE_ID_TOKEN_INFO_URL,
        params={'id_token': id_token}
    )

    decoded_response = response.json()

    if not response.ok:
        return False

    # TODO: uncomment this if we need to check for aud too. aud is the client_id
    # audience = response.json()['aud']
    # if audience != settings.GOOGLE_OAUTH2_CLIENT_ID:
    #     raise ValidationError('Invalid audience.')

    return True


def generate_random_id():
    return random.randint(0, 1000000000)
