from django_react.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import testFunc, ListRecommendedUsers, getRecommendUserList

router = DefaultRouter()
router.register('tags', views.TagViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('test/<slug:userId>/', testFunc),
    # path('aaa/<slug:userId>/', ListRecommendedUsers.as_view())
    path('aaa/', ListRecommendedUsers.as_view()),
    path("recommend/<int:userId>/", getRecommendUserList, name="おすすめユーザー取得")
]
