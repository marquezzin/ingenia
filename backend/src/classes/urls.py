"""Classes app — URLs."""

from rest_framework.routers import DefaultRouter

from .views import ClassGroupAdminViewSet

router = DefaultRouter()
router.register("admin/classes", ClassGroupAdminViewSet, basename="admin-classes")

urlpatterns = router.urls
