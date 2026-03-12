"""Config URLs"""
from django.apps import apps
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth (core — sempre ativo)
    path("api/auth/", include("src.accounts.urls")),
    # API Schema
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

# ─── URLs de módulos opcionais ────────────────────────────────────────────────
# Só inclui se o app estiver instalado (controlado por MODULE_*_ENABLED env vars)
if apps.is_installed("src.ai"):
    urlpatterns.append(path("api/ai/", include("src.ai.urls")))

# Adicione novos módulos aqui:
# if apps.is_installed("src.dashboard"):
#     urlpatterns.append(path("api/dashboard/", include("src.dashboard.urls")))
# if apps.is_installed("src.notifications"):
#     urlpatterns.append(path("api/notifications/", include("src.notifications.urls")))
