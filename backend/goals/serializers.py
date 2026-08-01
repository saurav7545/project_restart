"""
Goals Serializers
"""
from rest_framework import serializers
from .models import Goal, GoalProgress


class GoalProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalProgress
        fields = '__all__'


class GoalSerializer(serializers.ModelSerializer):
    progress_updates = GoalProgressSerializer(many=True, read_only=True)

    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['user']