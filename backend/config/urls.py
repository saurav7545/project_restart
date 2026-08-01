"""
Main URL Configuration for Project Restart
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/planner/', include('planner.urls')),
    path('api/study/', include('study.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/expenses/', include('expenses.urls')),
    path('api/fitness/', include('fitness.urls')),
    path('api/habits/', include('habits.urls')),
    path('api/recovery/', include('recovery.urls')),
    path('api/goals/', include('goals.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/ai/', include('ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)