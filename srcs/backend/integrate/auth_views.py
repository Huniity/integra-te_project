from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings


class LoginThrottle(AnonRateThrottle):
    """
    Custom throttle class for login attempts, allowing a maximum of 5 attempts per hour from the same IP address.
    """

    rate = "5/hour"


COOKIE_CONFIG = {
    "httponly": True,
    "secure": not settings.DEBUG,
    "samesite": "None" if not settings.DEBUG else "Lax",
}


class LoginView(APIView):
    """
    View for logging in a user and returning access and refresh tokens.
    """

    permission_classes = [AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        """
        Authenticate the user and return access and refresh tokens in cookies if successful.
        """
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"detail": "Credenciais inválidas"}, status=401)

        refresh = RefreshToken.for_user(user)
        response = Response({"detail": "Login bem-sucedido"})

        response.set_cookie(
            "access_token",
            str(refresh.access_token),
            max_age=15 * 60,
            path="/",
            **COOKIE_CONFIG,
        )

        response.set_cookie(
            "refresh_token",
            str(refresh),
            max_age=24 * 60 * 60,
            path="/",
            **COOKIE_CONFIG,
        )
        return response


class RefreshTokenView(APIView):
    """
    View for refreshing the access token using a valid refresh token.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Refresh the access token using the refresh token from cookies and return a new access token in the response cookies.
        """
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Sem token de renovação"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            response = Response({"detail": "Token renovado com sucesso"})

            response.set_cookie(
                "access_token",
                str(refresh.access_token),
                max_age=15 * 60,
                path="/",
                **COOKIE_CONFIG,
            )
            return response
        except Exception:
            return Response(
                {"detail": "Token de renovação expirado ou inválido"}, status=401
            )


class LogoutView(APIView):
    """
    View for logging out a user by blacklisting their refresh token.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Log out the user by blacklisting the refresh token from cookies and deleting the access and refresh tokens from cookies.
        """
        response = Response({"detail": "Logged out com sucesso."}, status=200)

        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response.delete_cookie(
            "access_token", path="/", samesite=COOKIE_CONFIG["samesite"]
        )
        response.delete_cookie(
            "refresh_token", path="/", samesite=COOKIE_CONFIG["samesite"]
        )
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "username": request.user.username,
                "is_staff": request.user.is_staff,
            }
        )
