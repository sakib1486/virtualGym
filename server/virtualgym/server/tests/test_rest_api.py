import json
import datetime
import pytz

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from ..models import Session as SessionModel, User as UserModel

class ApiTest(TestCase):
    """
    Tests for the REST API endpoints.
    """

    maxDiff = None

    def setUp(self):
        self.client = APIClient()
        # Placeholder for time values
        self.time = str(datetime.datetime.now(pytz.timezone('America/Edmonton')).isoformat("T"))
        # Create mock user
        self.user = UserModel.objects.create(
            id = 1,
            firstName = "Test",
            lastName = "User",
            email = "test@gmail.com",
            password = "password",
            role = "user",
            username = "username"
        )
        # Create mock session, which is associated with the mock user we created above
        self.session = SessionModel.objects.create(
            id = 1,
            hits = 1,
            misses = 1,
            deviceId = '1',
            avgHitSpeed = 1.0,
            startTime = self.time,
            endTime = self.time,
            version = "1",
            gameType = "Balloons",
            user = self.user,
            targetHitSpeedList = {},
            leftArmSpeedList = {},
            rightArmSpeedList = {},
            headSpeedList = {}, 
            leftArmAvgSpeed = 1.0,
            rightArmAvgSpeed = 1.0,
            headAvgSpeed = 1.0, 
            leftArmSpaceCoverage = {},
            rightArmSpaceCoverage = {}
            )

    def test_get_user(self):
        # Get our mock user
        user = UserModel.objects.get(id=1)
        # What the endpoint should return
        expected_response = {
            "id" : 1,
            "firstName" : "Test",
            "lastName" : "User",
            "email" : "test@gmail.com",
            "username": "username",
            "approved": False,
            "role" : "user"
            }
        # Make a request to our endpoint, using the ID of our mock user
        response = self.client.get(reverse('server:user', kwargs={'user_id': user.id}))

        self.assertEqual(response.status_code, 200)
        # Endpoint response should equal our expected response
        self.assertJSONEqual(response.content.decode('utf-8'), expected_response)

    def test_get_user_list(self):
        # Create 2 new users, which should now be returned by the endpoint
        UserModel.objects.create(
            id = 2,
            firstName = "Test",
            lastName = "User",
            email = "test1@gmail.com",
            username = "username1"
            )
        UserModel.objects.create(
            id = 3,
            firstName = "Test",
            lastName = "User",
            email = "test2@gmail.com",
            username = "username2"
            )
        # Make a request to the user list endpoint
        response = self.client.get(reverse('server:user_list'))
        
        self.assertEqual(response.status_code, 200)
        # Assert that there are now 3 users returned by the endpoint
        self.assertEqual(len(json.loads((response.content.decode('utf-8')))), 3)


    def test_get_session(self):
        # Get our mock user and mock session
        user = UserModel.objects.get(id=1)
        session = SessionModel.objects.get(id=1)
        # What the endpoint should return
        expected_response = {
            "id" : 1,
            "deviceId": '1',
            "userFirstName": user.firstName,
            "userLastName": user.lastName,
            "hits": 1,
            "misses": 1,
            "avgHitSpeed": 1.0,
            "startTime": self.time.replace("+00:00", "Z"), 
            "endTime": self.time.replace("+00:00", "Z"), 
            "version": '1',
            "gameType": "Balloons",
            "targetHitSpeedList" : {},
            "leftArmSpeedList" : {},
            "rightArmSpeedList" : {},
            "headSpeedList" : {}, 
            "leftArmAvgSpeed" : 1.0,
            "rightArmAvgSpeed" : 1.0,
            "headAvgSpeed" : 1.0, 
            "leftArmSpaceCoverage" : {},
            "rightArmSpaceCoverage" : {},
            "user": user.username,
            }
        # Make a request to our endpoint, using the ID of our mock session
        response = self.client.get(reverse('server:session', kwargs={'session_id': session.id}))

        self.assertEqual(response.status_code, 200)
        # Endpoint response should equal our expected response
        self.assertJSONEqual(response.content.decode('utf-8'), expected_response)

    def test_get_session_list(self):
        # Create 2 new sessions, which should now be returned by the endpoint
        SessionModel.objects.create(
            id = 2,
            deviceId = '1',
            hits = 1,
            misses = 1,
            avgHitSpeed = 1.0,
            startTime = self.time,
            endTime = self.time,
            version = '1',
            gameType = "Balloons",
            user = UserModel.objects.get(id=1),
            targetHitSpeedList = {},
            leftArmSpeedList = {},
            rightArmSpeedList = {},
            headSpeedList = {}, 
            leftArmAvgSpeed = 1.0,
            rightArmAvgSpeed = 1.0,
            headAvgSpeed = 1.0, 
            leftArmSpaceCoverage = {},
            rightArmSpaceCoverage = {}
            )
        SessionModel.objects.create(
            id = 3,
            deviceId = '1',
            hits = 1,
            misses = 1,
            avgHitSpeed = 1.0,
            startTime = self.time,
            endTime = self.time,
            version = '1',
            gameType = "Balloons",
            user = UserModel.objects.get(id=1),
            targetHitSpeedList = {},
            leftArmSpeedList = {},
            rightArmSpeedList = {},
            headSpeedList = {}, 
            leftArmAvgSpeed = 1.0,
            rightArmAvgSpeed = 1.0,
            headAvgSpeed = 1.0, 
            leftArmSpaceCoverage = {},
            rightArmSpaceCoverage = {}
            )
        # Make a request to the session list endpoint
        response = self.client.get(reverse('server:session_list'))
        
        self.assertEqual(response.status_code, 200)
        # Assert that there are now 3 sessions returned by the endpoint
        self.assertEqual(len(json.loads((response.content.decode('utf-8')))), 3)

    def test_get_404(self):
         # No session currently exists with id 404
        response = self.client.get(reverse('server:session', kwargs={'session_id': 404}))
        self.assertEqual(response.status_code, 404)
        # No user currently exists with id 404
        response = self.client.get(reverse('server:user', kwargs={'user_id': 404}))
        self.assertEqual(response.status_code, 404)

    def test_signup_login(self):
        # Posting a new user to the signup endpoint should give us a 201 and am user created message
        response = self.client.post(reverse('server:signupStandard'), {"email": "signup@gmail.com", "firstName": "Sign", "lastName": "Up", "username": "signUp", "password": "signup"}, content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads((response.content.decode('utf-8'))), {"message": "User created"})

        # We should now be able to login with the same user
        response = self.client.post(reverse('server:loginStandard'), {"email": "signup@gmail.com", "password": "signup"}, content_type="application/json")
        self.assertEqual(response.status_code, 200)


    def test_signup_same_user(self):
        # Posting a new user to the signup endpoint should give us a 201 and an user created message
        response = self.client.post(reverse('server:signupStandard'), {"email": "signup@gmail.com", "firstName": "Sign", "lastName": "Up", "username": "signUp", "password": "signup"}, content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads((response.content.decode('utf-8'))), {"message": "User created"})

        # Posting the same user again should give us a 200 and an user already exists message
        response = self.client.post(reverse('server:signupStandard'), {"email": "signup@gmail.com", "firstName": "Sign", "lastName": "Up", "username": "signUp", "password": "signup"}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads((response.content.decode('utf-8'))), {"message": "This account (email) is already registered in the system"})

    def test_invalid_login(self):
        # Posting a new user to the signup endpoint should give us a 201 and an user created message
        response = self.client.post(reverse('server:signupStandard'), {"email": "signup@gmail.com", "firstName": "Sign", "lastName": "Up", "username": "signUp", "password": "signup"}, content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads((response.content.decode('utf-8'))), {"message": "User created"})

        # Logging in with the incorrect password should give us 401 Unauthorized
        response = self.client.post(reverse('server:loginStandard'), {"email": "signup@gmail.com", "password": "incorrectPassword"}, content_type="application/json")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode('utf-8'), "Unauthorized")

        # Logging in with credentials that don't exist should give us 401 Unauthorized
        response = self.client.post(reverse('server:loginStandard'), {"email": "fake@notexist.com", "password": "notexist"}, content_type="application/json")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode('utf-8'), "Unauthorized")






