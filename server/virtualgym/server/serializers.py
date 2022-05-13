from . import models
from rest_framework import serializers


class SessionSerializer(serializers.ModelSerializer):
    userFirstName = serializers.CharField(source='user.firstName')
    userLastName = serializers.CharField(source='user.lastName')
    user = serializers.SlugRelatedField(slug_field='username', read_only=True)
    class Meta:
        model = models.Session
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        exclude = ['password']