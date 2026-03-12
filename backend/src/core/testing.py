"""
Core Testing — Helpers e classes base para testes.
"""
from rest_framework.test import APIClient, APITestCase as DRFAPITestCase


class APITestCase(DRFAPITestCase):
    """
    Classe base para testes de API.
    Fornece helpers comuns para autenticação e requisições.
    """

    client_class = APIClient

    def authenticate(self, user):
        """Autentica o cliente com o usuário fornecido."""
        self.client.force_authenticate(user=user)

    def deauthenticate(self):
        """Remove a autenticação do cliente."""
        self.client.force_authenticate(user=None)
