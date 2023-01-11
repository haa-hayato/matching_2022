from rest_framework import serializers, validators
from .models import User, Tag, UserTagRelation, LikeRelation, ShowRelation

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'id',)
        

class UserTagRelationSerializer(serializers.ModelSerializer):
    tag_id = serializers.StringRelatedField()
    class Meta:
        model = UserTagRelation
        fields = ('tag_id', 'user_id',)
        read_only_fields=('id',)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[validators.UniqueValidator(queryset=User.objects.all(), message='登録済みのメールアドレスです')])

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password',)
        

class ShowRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowRelation
        fields = ('show_user',)
        read_only_fields=('showed_user',)
        



