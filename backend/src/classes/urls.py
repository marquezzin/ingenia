"""Classes app — URLs."""

from rest_framework.routers import DefaultRouter

from .views import ClassGroupAdminViewSet, ClassGroupTeacherViewSet

router = DefaultRouter()
router.register("admin/classes", ClassGroupAdminViewSet, basename="admin-classes")
router.register("teacher/classes", ClassGroupTeacherViewSet, basename="teacher-classes")

urlpatterns = router.urls
