from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'todos', views.TodoViewSet, basename='todos')
router.register(r'categories', views.TodoCategoryViewSet, basename='todo-categories')

urlpatterns = [
    path('', include(router.urls)),
]