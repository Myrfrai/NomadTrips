from django.conf import settings
from django.db import models


class TourManager(models.Manager):
	def published(self):
		return self.filter(is_published=True)


class Destination(models.Model):
	name = models.CharField(max_length=120)
	country = models.CharField(max_length=120)
	description = models.TextField(blank=True)

	def __str__(self):
		return f"{self.name}, {self.country}"


class Tour(models.Model):
	destination = models.ForeignKey(
		Destination,
		on_delete=models.CASCADE,
		related_name="tours",
	)
	owner = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="owned_tours",
	)
	slug = models.SlugField(max_length=180, unique=True)
	title = models.CharField(max_length=180)
	summary = models.TextField(blank=True)
	region_key = models.CharField(max_length=60, default="almaty")
	season_key = models.CharField(max_length=60, default="all")
	duration_text = models.CharField(max_length=120, default="1 day")
	departure_city = models.CharField(max_length=120, default="Almaty")
	price = models.DecimalField(max_digits=10, decimal_places=2)
	rating = models.FloatField(default=4.8)
	popular = models.BooleanField(default=False)
	hero_label = models.CharField(max_length=120, default="Nomad Route")
	image_url = models.CharField(max_length=255, blank=True)
	is_published = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	objects = TourManager()

	def __str__(self):
		return self.title


class Booking(models.Model):
	STATUS_PENDING = "pending"
	STATUS_CONFIRMED = "confirmed"
	STATUS_CANCELLED = "cancelled"
	STATUS_CHOICES = [
		(STATUS_PENDING, "Pending"),
		(STATUS_CONFIRMED, "Confirmed"),
		(STATUS_CANCELLED, "Cancelled"),
	]

	tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="bookings")
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="bookings",
	)
	full_name = models.CharField(max_length=120)
	phone = models.CharField(max_length=30)
	travelers = models.PositiveIntegerField(default=1)
	travel_date = models.DateField()
	comment = models.TextField(blank=True)
	total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
	status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=STATUS_PENDING)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Booking #{self.pk} - {self.tour.title}"


class Review(models.Model):
	tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="reviews")
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="reviews",
	)
	rating = models.PositiveSmallIntegerField()
	comment = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Review #{self.pk} ({self.rating}/5)"


class ContactRequest(models.Model):
	name = models.CharField(max_length=120)
	email = models.EmailField()
	topic = models.CharField(max_length=60)
	message = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Contact #{self.pk} - {self.email}"
