"""
Core Pagination — Paginação padrão do projeto.
"""
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """
    Paginação padrão: 20 itens por página.
    Parâmetros: ?page=<n>&page_size=<n>
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
