from rest_framework.routers import DefaultRouter

from .views import AIJobViewSet

router = DefaultRouter()
router.register(r"jobs", AIJobViewSet, basename="ai-jobs")

urlpatterns = router.urls
