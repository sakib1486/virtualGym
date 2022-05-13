from re import M
from unittest.mock import patch
from server.utils import invalid_user, user_not_found
from .models import Session as SessionModel, User as UserModel
from .serializers import SessionSerializer, UserSerializer
from .mobility_parser import analyzeMetrics
import numpy
import traceback
import os
from json import JSONDecodeError
import hashlib
import bcrypt
import json
from django.http import HttpResponse
import ast
from .services import *
from django.shortcuts import render, get_object_or_404

from django.core.files.storage import default_storage
from django.core.exceptions import ObjectDoesNotExist


from rest_framework import status, viewsets, permissions
from rest_framework.authentication import BasicAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_jwt.settings import api_settings


from django.http import HttpResponse
import json
import bcrypt
import hashlib
from json import JSONDecodeError
import os
import traceback
import numpy
from .mobility_parser import analyzeMetrics


from .serializers import SessionSerializer, UserSerializer
from .models import Session as SessionModel, User as UserModel
from server.utils import invalid_user, user_not_found
# For sending email
from virtualgym.settings import EMAIL_HOST_USER
import string
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template


class User(APIView):
    """
    Endpoint returns a single user matching the provided user id

    """

    def get_user(self, user_id):
        return get_object_or_404(UserModel, pk=user_id)

    def get(self, request, user_id):
        user = self.get_user(user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserList(APIView):
    """
    Endpoint returns all users

    """

    def get_users(self):
        return UserModel.objects.all()

    def get(self, request):
        users = self.get_users()
        serializer = UserSerializer(users, many=True)
        data = serializer.data
        return Response(data)

    def put(self, request):
        user_list = request.data["users"]
        UserModel.objects.filter(email__in=user_list).update(approved=True)
        return HttpResponse("Users approved", 200)


class Session(APIView):
    """
    Endpoint returns a single session matching the provided session id

    """

    def get_session(self, session_id):
        return get_object_or_404(SessionModel, pk=session_id)

    def get(self, request, session_id):
        session = self.get_session(session_id)
        serializer = SessionSerializer(session)
        return Response(serializer.data)


class SessionList(APIView):
    """
    Endpoint returns all sessions

    """

    def get_sessions(self):
        return SessionModel.objects.all().order_by("-startTime")

    def get(self, request):
        if "email" in request.GET:
            email = request.GET["email"]
            try:
                # Have to join table here
                user = UserModel.objects.get(email__exact=email)
                id = user.id

                sessions = SessionModel.objects.filter(user=id)

                serializer = SessionSerializer(sessions, many=True)
                data = serializer.data
                return Response(data)
            except:
                return HttpResponse("Not Found", status=404)

        sessions = self.get_sessions()
        serializer = SessionSerializer(sessions, many=True)
        data = serializer.data
        return Response(data)

    # The post method for receiving json files and analyze metrics.
    def post(self, request):
        ### OPEN FILES ###
        # Open and load json data to dictionary
        # data.vg = VikSkywalker-Island-2022-02-18T02.18.54-Session.vg
        # Saving POSTed template and data files to storage
        try:
            template_file = request.FILES["template"]
            data_file = request.FILES["data"]
        except KeyError:
            # User did not provide correct files
            traceback.print_exc()
            return HttpResponse("Please provide both a template and data file in your request", status=400)
        try:
            # Reading files from storage
            template_file_name = default_storage.save(
                "template.tvg", template_file)
            data_file_name = default_storage.save("data.vg", data_file)
            opened_data_file = default_storage.open(data_file_name)
            opened_template_file = default_storage.open(template_file_name)
            data = opened_data_file.read()
            template = opened_template_file.read()

            template_dict = json.loads(template)
            targets_list = template_dict["TargetsSequence"]
            json_dict = json.loads(data)
            opened_data_file.close()
            opened_template_file.close()

            # Remove files from storage now that we don't need them
            os.remove(os.getcwd() + "/template.tvg")
            os.remove(os.getcwd() + "/data.vg")
        except UnicodeDecodeError:
            # User tried to post a incorrect file type
            if os.path.exists(os.getcwd() + "/template.tvg"):
                os.remove(os.getcwd() + "/template.tvg")
            if os.path.exists(os.getcwd() + "/data.vg"):
                os.remove(os.getcwd() + "/data.vg")
            traceback.print_exc()
            return HttpResponse("Please make sure your files are of the correct file type.", status=400)
        except JSONDecodeError:
            # User did not provide properly formatted JSON files
            if os.path.exists(os.getcwd() + "/template.tvg"):
                os.remove(os.getcwd() + "/template.tvg")
            if os.path.exists(os.getcwd() + "/data.vg"):
                os.remove(os.getcwd() + "/data.vg")
            traceback.print_exc()
            return HttpResponse("Your JSON files are incorrectly formatted.", status=400)
        except Exception:
            # Fallback to make sure we are always deleting the upload files regardless of exception
            if os.path.exists(os.getcwd() + "/template.tvg"):
                os.remove(os.getcwd() + "/template.tvg")
            if os.path.exists(os.getcwd() + "/data.vg"):
                os.remove(os.getcwd() + "/data.vg")
            traceback.print_exc()
            return HttpResponse("Something went wrong during the upload.", status=500)

        try:
            # Delegate analysis to mobility_parser.py
            response = analyzeMetrics(targets_list, json_dict)
            # Look for the correct user
            current_user = UserModel.objects.all().filter(
                username=response["username"]).get()

            # Create session from the result of analyze metrics
            session = SessionModel(
                deviceId=response['deviceId'],
                hits=response['hits'],
                misses=response['misses'],
                avgHitSpeed=response['averageHitSpeed'],
                startTime=response['startTime'],
                endTime=response['endTime'],
                version=response['version'],
                gameType=template_dict['Game'][0]['PrefabName'].lower(),
                targetHitSpeedList=response['targetHitSpeedList'],
                leftArmSpeedList=response['leftArmSpeedList'],
                rightArmSpeedList=response['rightArmSpeedList'],
                headSpeedList=response['headSpeedList'],
                leftArmAvgSpeed=response['leftArmAvgSpeed'],
                rightArmAvgSpeed=response['rightArmAvgSpeed'],
                headAvgSpeed=response['headAvgSpeed'],
                leftArmSpaceCoverage=response['leftArmSpaceCoverage'],
                rightArmSpaceCoverage=response['rightArmSpaceCoverage'],
                user=current_user)
            session.save()
        except KeyError as e:
            # User did not provide all the relevant fields in their JSON
            print(e)
            return HttpResponse("Your provided JSON file does not contain all the required fields.", status=400)
        except ObjectDoesNotExist:
            # User tried to post a session for a invalid username
            return HttpResponse("User provided in your session data does not exist.", status=400)
        except Exception:
            # Fallback
            traceback.print_exc()
            return HttpResponse("Something went wrong during the analysis.", status=500)
        return Response(response)


class LoginGoogle(APIView):
    def post(self, request):
        decoded_request = ast.literal_eval(request.body.decode('utf-8'))

        id_token = decoded_request["id_token"]
        email = decoded_request["email"]
        googleResponse = google_validate_id_token(id_token=id_token)

        if not googleResponse:
            return HttpResponse("Unauthorized", status=401)

        # Create JWT (JSON Web Token)
        try:
            user = UserModel.objects.get(email__exact=email)
        except:
            # User does not exist
            return HttpResponse("Unauthorized", status=401)

        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = {
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "role": user.role,
            "username": user.username,
        }

        if not user.approved:
            response = {"message": "user not approved"}
            return Response(response)

        token = jwt_encode_handler(payload)
        response = {"token": token, "email": email,
                    "message": "succesfully logged in"}
        return Response(response)


class SignupGoogle(APIView):
    def post(self, request):
        decoded_request = ast.literal_eval(request.body.decode('utf-8'))

        id_token = decoded_request["id_token"]
        email = decoded_request["email"]
        lastName = decoded_request["familyName"]
        firstName = decoded_request["givenName"]
        username = decoded_request["username"]

        googleResponse = google_validate_id_token(id_token=id_token)
        if not googleResponse:
            data = {
                "message": "Unauthorized"
            }
            return HttpResponse(json.dumps(data), status=401)

        try:
            created = UserModel.objects.create(
                email=email, lastName=lastName, firstName=firstName, username=username)
        except:
            # Account is already registered in the system
            data = {
                "message": "This Google account is already registered in the system"
            }
            return HttpResponse(json.dumps(data), status=200)\

        data = {
            "message": "User created"
        }

        # Account is successfully created
        return HttpResponse(json.dumps(data), status=201)


class LoginStandard(APIView):
    def post(self, request):
        decoded_request = ast.literal_eval(request.body.decode('utf-8'))

        email = decoded_request["email"]
        password = decoded_request["password"]

        try:
            user = UserModel.objects.get(email__exact=email)
        except:
            # User does not exist
            return HttpResponse("Unauthorized", status=401)

        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = {
                "email": user.email,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "role": user.role,
                "username": user.username
            }
            if not user.approved:
                response = {"message": "user not approved"}
                return Response(response)

            token = jwt_encode_handler(payload)
            response = {"token": token, "email": email,
                        "message": "succesfully logged in"}
            return Response(response)
        else:
            # Wrong Credentials
            return HttpResponse("Unauthorized", status=401)


class SignupStandard(APIView):
    def post(self, request):
        decoded_request = ast.literal_eval(request.body.decode('utf-8'))

        email = decoded_request["email"]
        lastName = decoded_request["lastName"]
        firstName = decoded_request["firstName"]
        password = decoded_request["password"]
        username = decoded_request["username"]

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        try:
            created = UserModel.objects.create(
                email=email, lastName=lastName, firstName=firstName, password=hashed_password.decode('utf-8'), username=username)
        except:
            # Account is already registered in the system
            data = {
                "message": "This account (email) is already registered in the system"
            }
            return HttpResponse(json.dumps(data), status=200)\

        data = {
            "message": "User created"
        }

        return HttpResponse(json.dumps(data), status=201)


class ForgotPassword(APIView):
    # This api route handle forgot password functioanlity
    def post(self, request):
        decoded_request = ast.literal_eval(request.body.decode('utf-8'))
        email = decoded_request["email"]

        data = {}

        try:
            # Generate password for user
            user = UserModel.objects.get(email__exact=email)
            letters = string.ascii_lowercase
            token = ''.join(random.choice(letters) for i in range(8))

            # Send email with Token to reset password
            subject = 'Virtual Gym - Reset Your Password'
            message = '''Hi {}. This is your token for resetting password: \n{}
                    '''.format(user.email, token)
            recepient = email
            send_mail(subject,
                      message, EMAIL_HOST_USER, [recepient], fail_silently=False)

            data = {
                "message": "OK",
                "token": token
            }
        except:
            # User does not exist
            return HttpResponse("Not Found", status=404)

        return HttpResponse(json.dumps(data), status=200)

    def patch(self, request):
        decoded_request = ast.literal_eval(request.body.decode('utf-8'))
        email = decoded_request["email"]
        password = decoded_request["password"]

        try:
            # Get the user by email
            user = UserModel.objects.get(email__exact=email)
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
            user.password = hashed_password.decode('utf-8')
            user.save()

        except:
            # User does not exist
            return HttpResponse("Not Found", status=404)

        data = {
            "message": "OK",
        }
        return HttpResponse(json.dumps(data), status=200)
