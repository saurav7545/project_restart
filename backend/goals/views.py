"""
Goals Views - CRUD for goals and progress tracking
"""
from rest_framework import viewsets, permissions
from .models import Goal, GoalProgress
from .serializers import GoalSerializer, GoalProgressSerializer


class GoalViewSet(viewsets.ModelViewSet):
    """CRUD for goals"""
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GoalProgressViewSet(viewsets.ModelViewSet):
    """CRUD for goal progress updates"""
    serializer_class = GoalProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GoalProgress.objects.filter(goal__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()