from django.urls import path

from .views import (
    AdminToursOverviewAPIView,
    AdminUsersOverviewAPIView,
    BookingListCreateAPIView,
    CancelBookingAPIView,
    ContactsCreateAPIView,
    DestinationListAPIView,
    MyBookingsAPIView,
    PopularToursAPIView,
    TourDetailAPIView,
    TourListCreateAPIView,
    login_view,
    me_view,
    logout_view,
    register_view,
)

urlpatterns = [
    path("auth/login", login_view, name="login"),
    path("auth/register", register_view, name="register"),
    path("auth/logout", logout_view, name="logout"),
    path("auth/me", me_view, name="me"),
    path("destinations", DestinationListAPIView.as_view(), name="destination-list"),
    path("tours", TourListCreateAPIView.as_view(), name="tour-list-create"),
    path("tours/popular", PopularToursAPIView.as_view(), name="tour-popular"),
    path("tours/<int:pk>", TourDetailAPIView.as_view(), name="tour-detail"),
    path("bookings", BookingListCreateAPIView.as_view(), name="booking-list-create"),
    path("bookings/my", MyBookingsAPIView.as_view(), name="booking-my"),
    path("bookings/<int:pk>/cancel", CancelBookingAPIView.as_view(), name="booking-cancel"),
    path("contacts", ContactsCreateAPIView.as_view(), name="contacts-create"),
    path("admin/users-overview", AdminUsersOverviewAPIView.as_view(), name="admin-users-overview"),
    path("admin/tours-overview", AdminToursOverviewAPIView.as_view(), name="admin-tours-overview"),
]
