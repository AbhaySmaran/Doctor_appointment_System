from django.conf import settings
from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin

class StaticFileAccessMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Check if the request is for a static file
        if request.path.startswith(settings.STATIC_URL):
            # Check if the user is authenticated
            if not request.user.is_authenticated:
                return HttpResponseForbidden("You must be logged in to access this file.")
