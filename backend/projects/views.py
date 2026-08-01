from rest_framework import viewsets, permissions
from .models import Project, ProjectChecklist
from .serializers import ProjectSerializer, ProjectChecklistSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectChecklistViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectChecklistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectChecklist.objects.filter(project__user=self.request.user)