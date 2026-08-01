from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'subjects', views.SubjectViewSet, basename='subjects')
router.register(r'sessions', views.StudySessionViewSet, basename='study-sessions')

urlpatterns = [
    path('', include(router.urls)),
]