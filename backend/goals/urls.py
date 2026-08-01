"""
Goals URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'goals', views.GoalViewSet, basename='goals')
router.register(r'progress', views.GoalProgressViewSet, basename='goal-progress')

urlpatterns = [
    path('', include(router.urls)),
]