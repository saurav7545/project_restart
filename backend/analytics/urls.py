"""
Analytics URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'snapshots', views.AnalyticsSnapshotViewSet, basename='analytics-snapshots')

urlpatterns = [
    path('', include(router.urls)),
    path('data/', views.AnalyticsDataView.as_view(), name='analytics_data'),
]