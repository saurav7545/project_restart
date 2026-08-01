"""
Planner Serializers
"""

from rest_framework import serializers
from .models import Todo, TodoCategory


class TodoCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoCategory
        fields = '__all__'
        read_only_fields = ['user']


class TodoSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Todo
        fields = '__all__'
        read_only_fields = ['user']