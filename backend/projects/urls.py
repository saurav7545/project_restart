from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='projects')
router.register(r'checklist', views.ProjectChecklistViewSet, basename='project-checklist')

urlpatterns = [
    path('', include(router.urls)),
]