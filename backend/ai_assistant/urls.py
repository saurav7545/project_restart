"""
AI Assistant URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'chat', views.ChatMessageViewSet, basename='chat-messages')

urlpatterns = [
    path('', include(router.urls)),
    path('insights/', views.AIInsightsView.as_view(), name='ai_insights'),
]