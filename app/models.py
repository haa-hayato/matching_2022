

# Create your models here.

from unicodedata import category, name
from django.db import models

class User(models.Model):
    name = models.CharField(verbose_name='ユーザー名', max_length=32)
    email = models.EmailField(verbose_name='メールアドレス', unique=True)
    password = models.CharField(verbose_name='パスワード', max_length=32)

class Tag(models.Model):
    name = models.CharField(verbose_name='タグ名', max_length=32, unique=True)

    def __str__(self):
        return self.name

class UserTagRelation(models.Model):
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    tag_id = models.ForeignKey(
        Tag,
        on_delete=models.CASCADE
    )

class LikeRelation(models.Model):
    like_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='like_user'

    )
    liked_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='liked_user'

    )

class ShowRelation(models.Model):
    show_user = models.ForeignKey( #表示したユーザー
        User,
        on_delete=models.CASCADE,
        related_name='show_user'

    )
    showed_user = models.ForeignKey( #表示されたユーザー
        User,
        on_delete=models.CASCADE,
        related_name='showed_user'

    )





