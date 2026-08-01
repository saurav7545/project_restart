"""
Recovery Serializers
"""
from rest_framework import serializers
from .models import RecoveryLog, RecoveryMilestone


class RecoveryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryLog
        fields = '__all__'
        read_only_fields = ['user']


class RecoveryMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryMilestone
        fields = '__all__'
        read_only_fields = ['user']