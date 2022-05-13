
from django.test import TestCase
from django.utils import timezone
import datetime

from ..models import Session as SessionModel, User as UserModel

class ModelTest(TestCase):
    """
    Tests for the database models.
    """

    def setUp(self):
        # Placeholder for time values
        self.time = str(datetime.datetime.now(tz=timezone.utc).isoformat("T"))
        # Create mock user
        self.user = UserModel.objects.create(
            firstName = "Test",
            lastName = "User",
            email = "test@gmail.com",
            password = 'password',
            role = 'user',
            username = "username"
        )
        # Create mock session, which is associated with the mock user we created above
        self.session = SessionModel.objects.create(
            hits = 1,
            misses = 1,
            deviceId = '1',
            avgHitSpeed = 1.0,
            startTime = self.time,
            endTime = self.time,
            version = '1',
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

    def test_initializes_with_primary_key(self):
        # Model instances must have their primary key
        self.assertIsNotNone(self.user.id)
        self.assertIsNotNone(self.session.id)
    
    def test_user_initalizes_as_unapproved(self):
        # Users should be unapproved by default
        self.assertFalse(self.user.approved)

    def test_session_delete_cascade(self):
        # There should initally be one session in the database
        self.assertEqual(len(SessionModel.objects.all()), 1)
        self.user.delete()
        # Session should now be gone, since the associated user was deleted
        self.assertEqual(len(SessionModel.objects.all()), 0)

