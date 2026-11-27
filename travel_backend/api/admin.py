from django.contrib import admin

from .models import Booking, ContactRequest, Destination, Review, Tour


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "country")
	search_fields = ("name", "country")


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "slug", "owner", "price", "popular", "is_published")
	list_filter = ("popular", "is_published", "region_key", "season_key")
	search_fields = ("title", "slug", "owner__email", "owner__username")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "tour", "travel_date", "travelers", "status", "total_price")
	list_filter = ("status", "travel_date")
	search_fields = ("user__email", "user__username", "tour__title", "full_name")


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "email", "topic", "created_at")
	list_filter = ("topic",)
	search_fields = ("name", "email", "message")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
	list_display = ("id", "tour", "user", "rating", "created_at")
	list_filter = ("rating",)
	search_fields = ("tour__title", "user__email", "user__username")
