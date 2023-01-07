from rest_framework import serializers
from .models import User, Tag, UserTagRelation, LikeRelation

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name',)
        read_only_fields=('id',)

