from rest_framework import serializers
from .models import Subject, Topic, StudySession


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ['user']


class StudySessionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = StudySession
        fields = '__all__'
        read_only_fields = ['user']
        # The app can omit this field; the server records the current time.
        extra_kwargs = {'start_time': {'required': False}}
