"""
Dashboard Serializers
"""
from rest_framework import serializers
from .models import DailyScore, MotivationalQuote


class DailyScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyScore
        fields = '__all__'
        read_only_fields = ['user']


class MotivationalQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivationalQuote
        fields = '__all__'