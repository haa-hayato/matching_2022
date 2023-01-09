from django.contrib import admin
from .models import User, Tag, UserTagRelation, LikeRelation

# Register your models here.
admin.site.register(User)
admin.site.register(Tag)
admin.site.register(UserTagRelation)
admin.site.register(LikeRelation)

