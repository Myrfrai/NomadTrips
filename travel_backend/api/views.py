from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Booking, ContactRequest, Tour
from .serializers import (
    AdminTourOverviewSerializer,
    AdminUserOverviewSerializer,
	BookingCreateSerializer,
	BookingSerializer,
	ContactRequestSerializer,
	LoginSerializer,
	LogoutSerializer,
	TourSerializer,
	TourWriteSerializer,
	user_to_profile,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
	serializer = LoginSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	user = serializer.validated_data["user"]

	refresh = RefreshToken.for_user(user)
	return Response(
		{
			"access": str(refresh.access_token),
			"refresh": str(refresh),
			"user": user_to_profile(user),
		},
		status=status.HTTP_200_OK,
	)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
	serializer = LogoutSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	refresh_value = serializer.validated_data.get("refresh")

	if refresh_value:
		try:
			token = RefreshToken(refresh_value)
			token.blacklist()
		except Exception:
			return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)

	return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
	return Response(user_to_profile(request.user), status=status.HTTP_200_OK)


class TourListCreateAPIView(APIView):
	permission_classes = [IsAuthenticatedOrReadOnly]

	def get(self, request):
		tours = Tour.objects.select_related("destination", "owner").filter(is_published=True).order_by("-created_at")

		search = (request.query_params.get("search") or "").strip().lower()
		region = (request.query_params.get("region") or "").strip().lower()
		season = (request.query_params.get("season") or "").strip().lower()
		max_price = request.query_params.get("maxPrice")

		if search:
			tours = tours.filter(title__icontains=search)
		if region:
			tours = tours.filter(region_key=region)
		if season:
			tours = tours.filter(season_key=season)
		if max_price:
			try:
				tours = tours.filter(price__lte=float(max_price))
			except ValueError:
				pass

		serializer = TourSerializer(tours, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		if not request.user.is_staff:
			return Response({"detail": "Only admins can create tours"}, status=status.HTTP_403_FORBIDDEN)
		serializer = TourWriteSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		tour = serializer.save(owner=request.user)
		return Response(TourSerializer(tour).data, status=status.HTTP_201_CREATED)


class PopularToursAPIView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		tours = Tour.objects.select_related("destination", "owner").filter(is_published=True, popular=True).order_by("-created_at")
		serializer = TourSerializer(tours, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


class TourDetailAPIView(APIView):
	permission_classes = [IsAuthenticatedOrReadOnly]

	def get_object(self, pk):
		try:
			return Tour.objects.get(pk=pk)
		except Tour.DoesNotExist:
			return None

	def get(self, request, pk):
		tour = self.get_object(pk)
		if tour is None:
			return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
		serializer = TourSerializer(tour)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def put(self, request, pk):
		tour = self.get_object(pk)
		if tour is None:
			return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
		if not request.user.is_staff:
			return Response({"detail": "Only admins can update tours"}, status=status.HTTP_403_FORBIDDEN)
		serializer = TourWriteSerializer(tour, data=request.data)
		serializer.is_valid(raise_exception=True)
		updated = serializer.save(owner=request.user)
		return Response(TourSerializer(updated).data, status=status.HTTP_200_OK)

	def delete(self, request, pk):
		tour = self.get_object(pk)
		if tour is None:
			return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
		if not request.user.is_staff:
			return Response({"detail": "Only admins can delete tours"}, status=status.HTTP_403_FORBIDDEN)
		tour.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)


class BookingListCreateAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		bookings = Booking.objects.select_related("tour", "user").filter(user=request.user).order_by("-created_at")
		serializer = BookingSerializer(bookings, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		serializer = BookingCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		tour = Tour.objects.filter(pk=serializer.validated_data["tourId"], is_published=True).first()
		if not tour:
			return Response({"message": "Tour not found", "messageKey": "errors.tourNotFound"}, status=status.HTTP_404_NOT_FOUND)

		travelers = serializer.validated_data["travelers"]
		booking = Booking.objects.create(
			tour=tour,
			user=request.user,
			full_name=serializer.validated_data["fullName"],
			phone=serializer.validated_data["phone"],
			travelers=travelers,
			travel_date=serializer.validated_data["travelDate"],
			comment=serializer.validated_data.get("comment", ""),
			total_price=tour.price * travelers,
		)
		return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


class MyBookingsAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		bookings = Booking.objects.select_related("tour", "user").filter(user=request.user).order_by("-created_at")
		return Response(BookingSerializer(bookings, many=True).data, status=status.HTTP_200_OK)


class CancelBookingAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, pk):
		booking = Booking.objects.select_related("tour", "user").filter(pk=pk).first()
		if not booking:
			return Response({"message": "Booking not found", "messageKey": "errors.bookingNotFound"}, status=status.HTTP_404_NOT_FOUND)
		if booking.user_id != request.user.id:
			return Response({"message": "Forbidden", "messageKey": "errors.bookingForbidden"}, status=status.HTTP_403_FORBIDDEN)
		booking.status = Booking.STATUS_CANCELLED
		booking.save(update_fields=["status"])
		return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class ContactsCreateAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = ContactRequestSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		inquiry = ContactRequest.objects.create(**serializer.validated_data)
		return Response(
			{"id": inquiry.id, "message": "Спасибо! Мы получили сообщение и скоро ответим."},
			status=status.HTTP_201_CREATED,
		)


class AdminUsersOverviewAPIView(APIView):
	permission_classes = [IsAdminUser]

	def get(self, request):
		data = []
		users = request.user.__class__.objects.prefetch_related("owned_tours", "bookings__tour").all().order_by("id")
		for user in users:
			owned_tours = [
				{"id": tour.id, "title": tour.title, "slug": tour.slug}
				for tour in user.owned_tours.all().order_by("id")
			]
			booked_tours = [
				{
					"bookingId": booking.id,
					"tourId": booking.tour_id,
					"tourTitle": booking.tour.title,
					"status": booking.status,
				}
				for booking in user.bookings.all().order_by("id")
			]
			data.append(
				{
					"id": user.id,
					"email": user.email,
					"username": user.username,
					"role": "manager" if user.is_staff else "traveler",
					"ownedTours": owned_tours,
					"bookedTours": booked_tours,
				}
			)
		serializer = AdminUserOverviewSerializer(data, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


class AdminToursOverviewAPIView(APIView):
	permission_classes = [IsAdminUser]

	def get(self, request):
		tours = Tour.objects.select_related("owner", "destination").prefetch_related("bookings").all().order_by("id")
		data = [
			{
				"id": tour.id,
				"title": tour.title,
				"slug": tour.slug,
				"owner": {
					"id": tour.owner.id,
					"email": tour.owner.email,
					"username": tour.owner.username,
				},
				"destination": {
					"id": tour.destination.id,
					"name": tour.destination.name,
					"country": tour.destination.country,
				},
				"bookingsCount": tour.bookings.count(),
				"price": float(tour.price),
				"isPublished": tour.is_published,
			}
			for tour in tours
		]
		serializer = AdminTourOverviewSerializer(data, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
