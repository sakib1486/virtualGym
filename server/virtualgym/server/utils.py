from server.models import User

from django.shortcuts import get_object_or_404


def invalid_user(request):
    """ check the user is authenticated or not """
    try:
        if request.user.is_authenticated and request.user.is_active:
            return False
    except:
        return True

    return True


def user_not_found(user_id):
    """ check existence of a user """
    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return False
