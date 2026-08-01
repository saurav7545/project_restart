"""
AI Assistant Views - Chat with AI and get insights
"""
import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from decouple import config
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import date, timedelta
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from planner.models import Todo
from study.models import StudySession
from habits.models import HabitLog
from recovery.models import RecoveryLog
from expenses.models import Expense


class ChatMessageViewSet(viewsets.ModelViewSet):
    """CRUD for chat messages"""
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Store a user message, get Gemini's reply, and store that reply."""
        message = str(request.data.get('message', '')).strip()
        if not message:
            return Response({'message': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(message) > 4000:
            return Response({'message': 'Please keep a message under 4,000 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = config('GEMINI_API_KEY', default='').strip()
        if not api_key:
            return Response(
                {'message': 'Gemini is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        user_message = ChatMessage.objects.create(user=request.user, role='user', message=message)
        history = ChatMessage.objects.filter(user=request.user).order_by('-created_at')[:12]
        contents = [
            {
                'role': 'user' if chat.role == 'user' else 'model',
                'parts': [{'text': chat.message}],
            }
            for chat in reversed(history)
        ]
        system_instruction = (
            'You are Project Restart, a warm and practical personal productivity coach. '
            'Reply in the same language as the user: Hindi (Devanagari or Hinglish) for Hindi/Hinglish, '
            'and English for English. If the user mixes both, use clear Hinglish. Keep answers concise, '
            'actionable, and supportive. Use the user\'s chat context when helpful. Do not claim to be a doctor '
            'or therapist; for urgent health or safety issues, encourage professional or emergency help.'
        )
        # The alias tracks a currently available Flash model. It avoids hard-coding
        # a version that may have been retired for an otherwise valid API key.
        model = config('GEMINI_MODEL', default='gemini-flash-latest')
        payload = json.dumps({
            'system_instruction': {'parts': [{'text': system_instruction}]},
            'contents': contents,
            'generationConfig': {'temperature': 0.7, 'maxOutputTokens': 700},
        }).encode('utf-8')
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'

        try:
            gemini_request = Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
            with urlopen(gemini_request, timeout=25) as gemini_response:
                gemini_data = json.loads(gemini_response.read().decode('utf-8'))
            reply = gemini_data['candidates'][0]['content']['parts'][0]['text'].strip()
            if not reply:
                raise ValueError('Gemini returned an empty response.')
        except (HTTPError, URLError, TimeoutError, KeyError, IndexError, ValueError) as error:
            # Do not persist a broken half-conversation when the provider is unavailable.
            user_message.delete()
            detail = 'Gemini is temporarily unavailable. Please try again in a moment.'
            if isinstance(error, HTTPError) and error.code in (400, 401, 403):
                detail = 'Gemini configuration could not be verified. Check GEMINI_API_KEY and GEMINI_MODEL.'
            return Response({'message': detail}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        assistant_message = ChatMessage.objects.create(
            user=request.user,
            role='assistant',
            message=reply,
        )
        return Response(self.get_serializer(assistant_message).data, status=status.HTTP_201_CREATED)


class AIInsightsView(APIView):
    """Generate AI insights based on user data"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        # Gather user data for insights
        recent_study = StudySession.objects.filter(
            user=user, date__gte=week_ago
        )
        total_study_hours = sum(s.duration_minutes for s in recent_study) / 60

        recent_habits = HabitLog.objects.filter(
            user=user, date__gte=week_ago
        )
        habit_completion_rate = 0
        if recent_habits.count() > 0:
            habit_completion_rate = int(
                recent_habits.filter(completed=True).count() / recent_habits.count() * 100
            )

        recent_recovery = RecoveryLog.objects.filter(
            user=user, date__gte=week_ago
        )
        clean_days = recent_recovery.filter(clean_day=True).count()
        total_days = recent_recovery.count()

        recent_expenses = Expense.objects.filter(
            user=user, date__gte=week_ago
        )
        total_expense = sum(e.amount for e in recent_expenses)

        # Generate insights
        insights = []
        recommendations = []

        if total_study_hours < 10:
            insights.append(f"You studied only {total_study_hours:.1f} hours this week.")
            recommendations.append("Try to study at least 2 hours daily.")
        else:
            insights.append(f"Great! You studied {total_study_hours:.1f} hours this week.")
            recommendations.append("Keep up the good study habit!")

        if habit_completion_rate < 50:
            insights.append(f"Your habit completion rate is only {habit_completion_rate}%.")
            recommendations.append("Start with small habits and build consistency.")
        else:
            insights.append(f"Good habit consistency at {habit_completion_rate}%!")

        if total_days > 0:
            recovery_rate = int(clean_days / total_days * 100)
            insights.append(f"Recovery clean rate: {recovery_rate}% this week.")
            if recovery_rate < 70:
                recommendations.append("Identify your triggers and avoid them.")

        return Response({
            'insights': insights,
            'recommendations': recommendations,
            'stats': {
                'study_hours': round(total_study_hours, 1),
                'habit_completion': habit_completion_rate,
                'clean_days': clean_days,
                'total_expense': float(total_expense),
                'streak': user.current_streak,
                'level': user.level,
            }
        })
