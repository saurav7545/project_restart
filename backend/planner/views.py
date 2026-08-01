"""
Planner Views - Todo List CRUD
"""

from rest_framework import viewsets, permissions
from .models import Todo, TodoCategory
from .serializers import TodoSerializer, TodoCategorySerializer


class TodoCategoryViewSet(viewsets.ModelViewSet):
    """CRUD for todo categories"""
    serializer_class = TodoCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TodoCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TodoViewSet(viewsets.ModelViewSet):
    """CRUD for todos"""
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)