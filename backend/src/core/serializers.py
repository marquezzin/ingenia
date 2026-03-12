"""
Core Serializers — Serializers base do projeto.
"""
from rest_framework import serializers


class BaseModelSerializer(serializers.ModelSerializer):
    """
    Serializer base para todos os models do projeto.
    Adiciona campos padrão e comportamentos comuns.
    """

    pass
