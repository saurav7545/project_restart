"""
Analytics Views - Aggregated analytics and chart data
"""
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import date, timedelta
from django.db import models
from .models import AnalyticsSnapshot
from .serializers import AnalyticsSnapshotSerializer
from study.models import StudySession
from habits.models import HabitLog
from expenses.models import Expense, Income
from recovery.models import RecoveryLog
from fitness.models import FitnessLog
from dashboard.models import DailyScore


class AnalyticsSnapshotViewSet(viewsets.ModelViewSet):
    """CRUD for analytics snapshots"""
    serializer_class = AnalyticsSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AnalyticsSnapshot.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AnalyticsDataView(APIView):
    """Generate analytics data for charts"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()
        month_ago = today - timedelta(days=30)
        week_ago = today - timedelta(days=7)

        # Study data (last 30 days)
        study_data = StudySession.objects.filter(
            user=user, date__gte=month_ago
        ).values('date').annotate(
            hours=models.Sum('duration_minutes')
        ).order_by('date')

        # Habit data
        habit_data = HabitLog.objects.filter(
            user=user, date__gte=week_ago
        )
        habit_completion = {
            'completed': habit_data.filter(completed=True).count(),
            'total': habit_data.count()
        }

        # Expense data
        expense_data = Expense.objects.filter(
            user=user, date__gte=month_ago
        ).values('date').annotate(
            total=models.Sum('amount')
        ).order_by('date')

        # Recovery data
        recovery_data = RecoveryLog.objects.filter(
            user=user, date__gte=month_ago
        ).values('date', 'clean_day').order_by('date')

        # Score data
        score_data = DailyScore.objects.filter(
            user=user, date__gte=week_ago
        ).values('date', 'score').order_by('date')

        return Response({
            'study': list(study_data),
            'habits': habit_completion,
            'expenses': list(expense_data),
            'recovery': list(recovery_data),
            'scores': list(score_data),
            'period': {
                'start': month_ago,
                'end': today
            }
        })