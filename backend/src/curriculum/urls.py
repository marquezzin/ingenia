"""Curriculum app — URL configuration."""

from rest_framework.routers import DefaultRouter

from .views import ModuleViewSet

router = DefaultRouter()
router.register(r"modules", ModuleViewSet, basename="module")

urlpatterns = router.urls
