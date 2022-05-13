from django.db import models
from django.db.models import JSONField
from django.db.models.deletion import CASCADE
from django.contrib.postgres.fields import ArrayField


class Session(models.Model):
    id = models.AutoField(unique=True, null=False,
                          blank=False, primary_key=True)
    # deviceId is an Id of OculusQuest
    deviceId = models.CharField(max_length=255, null=False, default='')
    hits = models.IntegerField()
    misses = models.IntegerField()
    avgHitSpeed = models.FloatField(max_length=255)
    startTime = models.DateTimeField(null=False)
    endTime = models.DateTimeField(null=False)
    version = models.CharField(max_length=255)
    gameType = models.CharField(max_length=255)
    user = models.ForeignKey("User", on_delete=CASCADE, default=1)
    targetHitSpeedList = JSONField(default=dict)
    leftArmSpeedList = JSONField(default=dict)
    rightArmSpeedList = JSONField(default=dict)
    headSpeedList = JSONField(default=dict)
    leftArmAvgSpeed = models.FloatField(max_length=32, null=True)
    rightArmAvgSpeed = models.FloatField(max_length=32, null=True)
    headAvgSpeed = models.FloatField(max_length=32, null=True)
    leftArmSpaceCoverage = models.JSONField(default=dict)
    rightArmSpaceCoverage = models.JSONField(default=dict)
    objects = models.Manager()


class User(models.Model):
    id = models.AutoField(unique=True, null=False,
                          blank=False, primary_key=True)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    # role is either "admin" or "user"
    # signed up account will be set default to "user"
    role = models.CharField(max_length=255, default='user')
    username = models.CharField(
        max_length=255, null=False, unique=True, default="")
    approved = models.BooleanField(default=False)
    objects = models.Manager()

    def __str__(self):
        return self.username
