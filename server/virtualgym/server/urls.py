from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

from . import views

schema_view = get_schema_view(
    openapi.Info(
        title="Virtual Gym API",
        default_version='v1',
        description="API documentation Virtual Gym's dashboard backend",
    ),
    public=True,
)
app_name = "server"
urlpatterns = [
    path('sessions/<str:session_id>/', views.Session.as_view(), name='session'),
    path('sessions/', views.SessionList.as_view(), name='session_list'),
    path('users/<str:user_id>/', views.User.as_view(), name='user'),
    path('users/', views.UserList.as_view(), name='user_list'),
    path("login/google/", views.LoginGoogle.as_view(), name="loginGoogle"),
    path("signup/google/", views.SignupGoogle.as_view(), name="signupGoogle"),
    path("login/standard/", views.LoginStandard.as_view(), name="loginStandard"),
    path("signup/standard/", views.SignupStandard.as_view(), name="signupStandard"),
    path("reset-password/", views.ForgotPassword.as_view(), name="ForgotPassword"),
    path('docs/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
]
