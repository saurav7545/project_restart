"""
URL configuration for Project Restart.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return JsonResponse({
        "status": "success",
        "message": "Project Restart Backend is Running 🚀",
        "version": "1.0.0"
    })


urlpatterns = [
    # Home Route (Render Health Check)
    path("", home),

    # Django Admin
    path("admin/", admin.site.urls),

    # Authentication
    path("api/auth/", include("accounts.urls")),

    # Modules
    path("api/dashboard/", include("dashboard.urls")),
    path("api/planner/", include("planner.urls")),
    path("api/study/", include("study.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/expenses/", include("expenses.urls")),
    path("api/fitness/", include("fitness.urls")),
    path("api/habits/", include("habits.urls")),
    path("api/recovery/", include("recovery.urls")),
    path("api/goals/", include("goals.urls")),
    path("api/analytics/", include("analytics.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/ai/", include("ai_assistant.urls")),
]

# Static & Media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)