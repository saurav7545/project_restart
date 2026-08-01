"""
Habits URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'habits', views.HabitViewSet, basename='habits')
router.register(r'logs', views.HabitLogViewSet, basename='habit-logs')

urlpatterns = [
    path('', include(router.urls)),
]