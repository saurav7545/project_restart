"""
Recovery Views - CRUD for recovery logs and milestones
"""
from rest_framework import viewsets, permissions
from .models import RecoveryLog, RecoveryMilestone
from .serializers import RecoveryLogSerializer, RecoveryMilestoneSerializer


class RecoveryLogViewSet(viewsets.ModelViewSet):
    """CRUD for daily recovery logs"""
    serializer_class = RecoveryLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecoveryLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecoveryMilestoneViewSet(viewsets.ModelViewSet):
    """CRUD for recovery milestones"""
    serializer_class = RecoveryMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecoveryMilestone.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)