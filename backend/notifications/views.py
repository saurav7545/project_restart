"""
Notifications Views - CRUD for notifications and preferences
"""
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """CRUD for notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'message': 'All notifications marked as read'})


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """CRUD for notification preferences"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Every user has exactly one persistent preferences record."""
        preferences, _ = NotificationPreference.objects.get_or_create(user=request.user)
        return Response(self.get_serializer(preferences).data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['patch'])
    def settings(self, request):
        preferences, _ = NotificationPreference.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(preferences, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
