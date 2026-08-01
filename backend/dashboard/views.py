"""
Dashboard Views - Daily score, quotes, and dashboard data aggregation
"""
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import date, timedelta
from .models import DailyScore, MotivationalQuote
from .serializers import DailyScoreSerializer, MotivationalQuoteSerializer
from planner.models import Todo
from study.models import StudySession
from habits.models import HabitLog
from fitness.models import FitnessLog


class DailyScoreViewSet(viewsets.ModelViewSet):
    """CRUD for daily scores"""
    serializer_class = DailyScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyScore.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MotivationalQuoteViewSet(viewsets.ReadOnlyModelViewSet):
    """View today's motivational quote"""
    queryset = MotivationalQuote.objects.filter(is_active=True)
    serializer_class = MotivationalQuoteSerializer
    permission_classes = [permissions.AllowAny]


class DashboardView(APIView):
    """Aggregated dashboard data for the authenticated user"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()
        week_ago = today - timedelta(days=7)

        # Today's stats
        today_todos = Todo.objects.filter(user=user, date=today)
        todos_completed = today_todos.filter(completed=True).count()
        todos_total = today_todos.count()

        today_study = StudySession.objects.filter(user=user, date=today)
        study_hours = sum(s.duration_minutes for s in today_study) / 60

        today_habits = HabitLog.objects.filter(user=user, date=today)
        habits_completed = today_habits.filter(completed=True).count()
        habits_total = today_habits.count()

        # Weekly stats
        weekly_study = StudySession.objects.filter(
            user=user, date__gte=week_ago
        )
        weekly_study_hours = sum(s.duration_minutes for s in weekly_study) / 60

        # Get today's quote
        quote = MotivationalQuote.objects.filter(is_active=True).order_by('?').first()

        # Today's score calculation
        score = 0
        if todos_total > 0:
            score += int((todos_completed / todos_total) * 40)
        if habits_total > 0:
            score += int((habits_completed / habits_total) * 30)
        score += min(int(study_hours * 10), 30)

        return Response({
            'greeting': f"Good {'Morning' if timezone.localtime().hour < 12 else 'Afternoon' if timezone.localtime().hour < 17 else 'Evening'} {user.username}",
            'date': today,
            'time': timezone.localtime().strftime('%I:%M %p'),
            'streak': user.current_streak,
            'today_score': score,
            'quote': {
                'text': quote.quote if quote else 'The only way to do great work is to love what you do.',
                'author': quote.author if quote else 'Steve Jobs'
            } if quote else None,
            'today_stats': {
                'todos': {'completed': todos_completed, 'total': todos_total},
                'study_hours': round(study_hours, 1),
                'habits': {'completed': habits_completed, 'total': habits_total},
            },
            'weekly_stats': {
                'study_hours': round(weekly_study_hours, 1),
            },
            'user': {
                'xp': user.xp,
                'coins': user.coins,
                'level': user.level,
            }
        })