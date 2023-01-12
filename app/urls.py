from django_react.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import testFunc, ListRecommendedUsers, getRecommendUserList, signIn, validateEmail, signUp, getUserTagList, createTagWithUserId, deleteTag
router = DefaultRouter()
router.register('tags', views.TagViewSet)
router.register('users', views.UserViewSet)
router.register('user-tag-relation', views.UserTagRelationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('test/<slug:userId>/', testFunc),
    # path('aaa/<slug:userId>/', ListRecommendedUsers.as_view())
    path('aaa/', ListRecommendedUsers.as_view()),
    path("recommend/<int:userId>/", getRecommendUserList, name="おすすめユーザー取得"),
    path('signin/', signIn, name='サインイン' ),
    path('validate-email/', validateEmail, name="メールアドレス重複確認"),
    path('signup/', signUp, name='サインアップ'),
    path("user-tags/<int:userId>/", getUserTagList, name="ユーザータグ取得"),
    path('create-tag-with-user/', createTagWithUserId, name='タグ新規作成(要ユーザーid)'),
    path('delete-user-tag/<int:userId>/<int:tagId>/', deleteTag, name='ユーザー登録タグ削除')
]
