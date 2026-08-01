"""
Habits Views - CRUD for habits and daily logs
"""
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitLogSerializer


class HabitViewSet(viewsets.ModelViewSet):
    """CRUD for habits"""
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        habit = serializer.validated_data['habit']
        if habit.user_id != self.request.user.id:
            raise PermissionDenied('You cannot update another user’s habit.')
        log = serializer.save(user=self.request.user)
        self._refresh_habit_totals(log.habit)

    def perform_update(self, serializer):
        log = serializer.save()
        self._refresh_habit_totals(log.habit)

    @staticmethod
    def _refresh_habit_totals(habit):
        habit.total_completions = HabitLog.objects.filter(habit=habit, completed=True).count()
        habit.save(update_fields=['total_completions'])


class HabitLogViewSet(viewsets.ModelViewSet):
    """CRUD for daily habit logs"""
    serializer_class = HabitLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HabitLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
