from rest_framework import viewsets, permissions
from django.utils import timezone
from django.db.models import Sum
from rest_framework.exceptions import PermissionDenied
from .models import Subject, StudySession
from .serializers import SubjectSerializer, StudySessionSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudySessionViewSet(viewsets.ModelViewSet):
    serializer_class = StudySessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        subject = serializer.validated_data['subject']
        if subject.user_id != self.request.user.id:
            raise PermissionDenied('You cannot log time for another user’s subject.')
        session = serializer.save(
            user=self.request.user,
            start_time=serializer.validated_data.get('start_time') or timezone.localtime().time(),
        )
        total_minutes = StudySession.objects.filter(subject=session.subject).aggregate(total=Sum('duration_minutes'))['total'] or 0
        session.subject.total_hours = round(total_minutes / 60, 2)
        session.subject.save(update_fields=['total_hours'])
