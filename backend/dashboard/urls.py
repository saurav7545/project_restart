"""
Dashboard URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'scores', views.DailyScoreViewSet, basename='daily-scores')
router.register(r'quotes', views.MotivationalQuoteViewSet, basename='quotes')

urlpatterns = [
    path('', include(router.urls)),
    path('overview/', views.DashboardView.as_view(), name='dashboard_overview'),
]