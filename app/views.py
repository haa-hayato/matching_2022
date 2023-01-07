from django.shortcuts import render
from rest_framework import generics, permissions, viewsets, status
from .serializers import TagSerializer
from .models import Tag

# Create your views here.
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
