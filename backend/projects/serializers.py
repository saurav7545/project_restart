from rest_framework import serializers
from .models import Project, ProjectChecklist


class ProjectChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectChecklist
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    checklist = ProjectChecklistSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['user']