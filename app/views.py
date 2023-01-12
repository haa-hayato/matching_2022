from django.shortcuts import render
from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TagSerializer, UserTagRelationSerializer, UserSerializer, ShowRelationSerializer, UserTagRelationSerializer2
from .models import Tag, User, LikeRelation, UserTagRelation, ShowRelation
from pymagnitude import Magnitude


# Create your views here.
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserTagRelationViewSet(viewsets.ModelViewSet):
    queryset = UserTagRelation.objects.all()
    serializer_class = UserTagRelationSerializer2

class ListRecommendedUsers(APIView):
    def get(self, request, format=None):
        hoge = Tag.objects.all()
        # userId = request.query_params.get('userId')
        return Response(hoge)

@api_view(["DELETE"])
def deleteTag(request, tagId, userId):
    if request.method == "DELETE":
        targetUserTagRelation = UserTagRelation.objects.filter(tag_id=tagId, user_id=userId)
        targetUserTagRelation.delete()
        return Response("user-tag deleted")

@api_view(["POST"])
def createTagWithUserId(request):
    if request.method == "POST":
        body = request.data #{name: string, userId: number}
        Tag.objects.create(name=body["name"])
        createdTag = TagSerializer(Tag.objects.filter(name=body["name"]), many = True).data
        tag = TagSerializer(Tag.objects.get(pk=createdTag[0]["id"])).instance
        user = UserSerializer(User.objects.get(pk=body["userId"])).instance
        UserTagRelation.objects.create(user_id=user, tag_id=tag)
        return Response({"sucsess": True})

@api_view(["POST"])
def signIn(request):
    if request.method == "POST":
        body = request.data #{email: string, password: string}
        userInfo = UserSerializer(User.objects.filter(email=body['email']), many=True).data
        if len(userInfo) > 0 and body["password"] == userInfo[0]['password']:
            return Response({"isLogin": True, "userId": userInfo[0]['id']})
        else:
            return Response({"isLogin": False, "userId": None})

@api_view(["POST"])
def signUp(request):
    if request.method == "POST":
        body = request.data #{email: string, password: string, name: string}
        User.objects.create(name=body["name"], email=body["email"], password=body["password"])
        userInfo = UserSerializer(User.objects.filter(email=body['email']), many=True).data
        return Response({"userId": userInfo[0]["id"]})

@api_view(["POST"])
def validateEmail(request):
    if request.method == "POST":
        body = request.data #{email: string}
        userInfo = UserSerializer(User.objects.filter(email=body['email']), many=True).data
        if len(userInfo) < 1:
            return Response({"result": True})
        else:
            return Response({"result": False})

@api_view(["GET"])
def getUserTagList(request, userId):
    if request.method == "GET":
        userTags =  UserTagRelationSerializer2(UserTagRelation.objects.filter(user_id=userId), many=True).data
        userTagIdList = [] 
        for tag in userTags:
            userTagIdList.append(tag["tag_id"])
        

        userTagList = TagSerializer(Tag.objects.filter(id__in = userTagIdList), many=True).data

        #userTags = UserTagRelationSerializer(UserTagRelation.objects.select_related("tag_id").filter(user_id=userId), many=True).data

        return Response(userTagList)

        
        
    

@api_view(["GET"])
def getRecommendUserList(request, userId):
    if request.method == "GET":

        #おすすめユーザー情報のリスト(返り値)、{id: number, name: string, tags: {name: string, similar: boolean}[], similarCount: number}[]
        recommendUserInfoList = [] 

        #最低表示数
        minShowNumber = 10

         # chiVeデータのPATH
        model_path = "django_react/downloads/chive-1.2-mc90.magnitude"
        # モデルの読み込み
        wv = Magnitude(model_path)

        # 表示済みユーザ情報
        showUsers = ShowRelationSerializer(ShowRelation.objects.filter(showed_user = userId), many=True).data
        showUsersIdList =  []
        for users in showUsers:
            showUsersIdList.append(users['show_user'])
        showUsersIdList.append(userId) #検索者自身を追加する

        allTags = TagSerializer(Tag.objects.all(), many=True).data
        allTagList = []
        for tag in allTags:
            allTagList.append(tag['name'])
        
        userTags = UserTagRelationSerializer(UserTagRelation.objects.filter(user_id=userId), many=True).data
        userTagList = [] 
        for tag in userTags:
            userTagList.append(tag['tag_id'])

        similarTagList = [] #類似かつ存在するタグ名のリスト
        for tag in userTagList:
            similarWords = wv.most_similar(tag, topn=7)
            similarTagList.append(tag) #検索しているユーザーが持つタグも追加
            for word in similarWords:
                if word[0] in allTagList:
                    similarTagList.append(word[0])
        similarTagList = list(set(similarTagList)) #重複を削除

        def getUserInfo(userId, similarTagNameList): #フロントに渡す形式でユーザー情報を生成(userId: 情報を得たいユーザーのid、similarTagNameList: タグ名のリスト。この中のタグ名とuserIdのユーザーの持つタグが一致するとsimilarがTrueになる)
            userInfo = UserSerializer(User.objects.get(pk=userId)).data
            userTagInfo = UserTagRelationSerializer(UserTagRelation.objects.filter(user_id=userId), many=True).data
            resultTags = [] #{name: string, similar: boolean}[]
            similarCount = 0 #一致または類似タグの個数(similar:Trueのタグの個数)
            for tagInfo in userTagInfo:
                if tagInfo['tag_id'] in similarTagNameList:
                    resultTags.append({'name': tagInfo['tag_id'], 'similar': True})
                    similarCount += 1
                else:
                    resultTags.append({'name': tagInfo['tag_id'], 'similar': False})
                
            resultUserInfo = {'id': userInfo['id'], 'name': userInfo['name'], 'tags': resultTags, 'similarCount': similarCount}
            return resultUserInfo #{id: number, name: string, tags: {name: string, similar: boolean}[], similarCount: number}
        
        if similarTagList:

            similarTagIdList = [] #類似かつ存在するタグidのリスト
            similarTagIds = TagSerializer(Tag.objects.filter(name__in=similarTagList), many=True).data
            for tagId in similarTagIds:
                similarTagIdList.append(tagId['id'])

            recommendUserIdList = [] #similarTagIdListのいずれかのタグを持つユーザーidのリスト
            similarUserTagRelations = UserTagRelationSerializer(UserTagRelation.objects.filter(tag_id__in=similarTagIdList), many=True).data
            for relation in similarUserTagRelations:
                if relation['user_id'] != userId: #検索しているユーザー自身は候補に入れない
                    recommendUserIdList.append(relation['user_id'])
            recommendUserIdList = list(set(recommendUserIdList))#重複を削除
            recommendUserIdList = list(set(recommendUserIdList) - set(showUsersIdList)) #表示済みのユーザを削除

            for recommendUserId in recommendUserIdList:
                userInfo = getUserInfo(recommendUserId, similarTagList)
                recommendUserInfoList.append(userInfo)
            recommendUserInfoList = sorted(recommendUserInfoList, key=lambda x: x['similarCount'], reverse=True) #similarCountが多い順にソート

            if len(recommendUserInfoList) - minShowNumber < 0: #10人に満たない分を追加する
                excludeUserIdList = []
                excludeUserIdList.extend(showUsersIdList)
                excludeUserIdList.extend(recommendUserIdList)
                excludeUserIdList = list(set(excludeUserIdList)) #重複を削除
                additionalUsers = UserSerializer(User.objects.exclude(id__in=excludeUserIdList)[:minShowNumber-len(recommendUserInfoList)], many=True).data
                
                for user in additionalUsers:
                    recommendUserInfoList.append(getUserInfo(user['id'], []))
        else:
            randomUsers = UserSerializer(User.objects.exclude(id__in=excludeUserIdList)[:10], many=True).data

            for rUser in randomUsers:
                rUserInfo = getUserInfo(rUser['id'], [])
                recommendUserInfoList.append(rUserInfo)
            

        def postShowRelation(showedUserId, showUserInfoList): #表示したユーザー、表示されたユーザーの関係をshowRelationテーブルに反映
            for userInfo in showUserInfoList:
                showUser = UserSerializer(User.objects.get(pk=userInfo['id'])).instance
                showedUser = UserSerializer(User.objects.get(pk=showedUserId)).instance 
                ShowRelation.objects.create(show_user=showUser, showed_user=showedUser)

        postShowRelation(userId, recommendUserInfoList)

        return Response(recommendUserInfoList)

        

        

def testFunc(request, userId):
    return Response({id: userId})