"""
Habits Serializers
"""
from rest_framework import serializers
from .models import Habit, HabitLog


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'
        read_only_fields = ['user']


class HabitLogSerializer(serializers.ModelSerializer):
    habit_name = serializers.CharField(source='habit.name', read_only=True)
    habit_emoji = serializers.CharField(source='habit.emoji', read_only=True)

    class Meta:
        model = HabitLog
        fields = '__all__'
        read_only_fields = ['user']