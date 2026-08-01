"""
Fitness Views - CRUD for fitness logs
"""
from rest_framework import viewsets, permissions
from .models import FitnessLog
from .serializers import FitnessLogSerializer


class FitnessLogViewSet(viewsets.ModelViewSet):
    """CRUD for daily fitness logs"""
    serializer_class = FitnessLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FitnessLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)