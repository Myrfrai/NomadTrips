from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import Booking, ContactRequest, Destination, Tour


User = get_user_model()


def localize(value: str):
    return {"ru": value, "kz": value, "en": value}


def user_to_profile(user):
    full_name = (user.get_full_name() or user.username).strip()
    role = "manager" if user.is_staff else "traveler"
    return {
        "id": user.id,
        "name": full_name,
        "email": user.email,
        "role": role,
    }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user_obj = User.objects.filter(email__iexact=attrs["email"].strip()).first()
        if not user_obj:
            raise serializers.ValidationError("Invalid email or password")

        user = authenticate(username=user_obj.username, password=attrs["password"])
        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        attrs["user"] = user
        return attrs


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return email

    def create(self, validated_data):
        name = validated_data["name"].strip()
        base_username = (
            validated_data["email"].split("@", 1)[0].strip().replace(" ", "-").replace("_", "-") or "traveler"
        )
        username = base_username
        suffix = 1

        while User.objects.filter(username__iexact=username).exists():
            suffix += 1
            username = f"{base_username}-{suffix}"

        first_name, _, last_name = name.partition(" ")
        user = User.objects.create_user(
            username=username,
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first_name.strip(),
            last_name=last_name.strip(),
        )
        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=False, allow_blank=True)


class TourSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    summaryLocalized = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    season = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    departure = serializers.SerializerMethodField()
    imageAlt = serializers.SerializerMethodField()
    photoAttribution = serializers.SerializerMethodField()
    highlights = serializers.SerializerMethodField()
    includes = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "id",
            "slug",
            "name",
            "summaryLocalized",
            "region",
            "region_key",
            "season",
            "season_key",
            "duration",
            "departure",
            "rating",
            "popular",
            "hero_label",
            "image_url",
            "imageAlt",
            "photoAttribution",
            "highlights",
            "includes",
            "destination",
            "price",
            "is_published",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {
            "id": data["id"],
            "slug": data["slug"],
            "name": data["name"],
            "summary": data["summaryLocalized"],
            "region": data["region"],
            "regionKey": data["region_key"],
            "season": data["season"],
            "seasonKey": data["season_key"],
            "duration": data["duration"],
            "departure": data["departure"],
            "price": float(data["price"]),
            "rating": data["rating"],
            "popular": data["popular"],
            "heroLabel": data["hero_label"],
            "imageUrl": data["image_url"],
            "imageAlt": data["imageAlt"],
            "photoAttribution": data["photoAttribution"],
            "highlights": data["highlights"],
            "includes": data["includes"],
        }

    def get_name(self, obj):
        return localize(obj.title)

    def get_summaryLocalized(self, obj):
        return localize(obj.summary or obj.title)

    def get_region(self, obj):
        region_name = obj.destination.country if obj.destination_id else obj.region_key
        return localize(region_name)

    def get_season(self, obj):
        return localize(obj.season_key)

    def get_duration(self, obj):
        return localize(obj.duration_text)

    def get_departure(self, obj):
        return localize(obj.departure_city)

    def get_imageAlt(self, obj):
        return localize(obj.title)

    def get_photoAttribution(self, obj):
        return {
            "author": "NomadTrips",
            "sourceLabel": "NomadTrips",
            "sourceUrl": "https://nomadtrips.local",
            "licenseLabel": "Demo",
            "licenseUrl": "https://nomadtrips.local",
        }

    def get_highlights(self, obj):
        return [localize(obj.summary or obj.title)]

    def get_includes(self, obj):
        return [localize("Transfer"), localize("Guide service")]


class TourWriteSerializer(serializers.ModelSerializer):
    destination = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(),
        required=False,
        allow_null=True,
    )
    destination_name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=120)
    destination_description = serializers.CharField(write_only=True, required=False, allow_blank=True)
    slug = serializers.SlugField(min_length=3, max_length=180)
    title = serializers.CharField(min_length=3, max_length=180)
    summary = serializers.CharField(required=False, allow_blank=True, max_length=1200)
    region_key = serializers.CharField(min_length=2, max_length=60)
    season_key = serializers.CharField(min_length=2, max_length=60)
    duration_text = serializers.CharField(min_length=2, max_length=120)
    departure_city = serializers.CharField(min_length=2, max_length=120)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    rating = serializers.FloatField(min_value=0, max_value=5)
    hero_label = serializers.CharField(min_length=2, max_length=120)
    image_url = serializers.CharField(required=False, allow_blank=True, max_length=255)

    class Meta:
        model = Tour
        fields = [
            "destination",
            "destination_name",
            "destination_description",
            "slug",
            "title",
            "summary",
            "region_key",
            "season_key",
            "duration_text",
            "departure_city",
            "price",
            "rating",
            "popular",
            "hero_label",
            "image_url",
            "is_published",
        ]

    def validate(self, attrs):
        destination = attrs.get("destination")
        destination_name = attrs.get("destination_name", "").strip()

        if destination is None and not destination_name:
            raise serializers.ValidationError(
                {
                    "destination": "Provide destination id or fill destination name."
                }
            )

        return attrs

    def _resolve_destination(self, validated_data):
        destination = validated_data.pop("destination", None)
        destination_name = validated_data.pop("destination_name", "").strip()
        destination_description = validated_data.pop("destination_description", "").strip()

        if destination is not None:
            return destination

        destination, created = Destination.objects.get_or_create(
            name=destination_name,
            country="Kazakhstan",
            defaults={"description": destination_description},
        )

        if destination_description and not destination.description:
            destination.description = destination_description
            destination.save(update_fields=["description"])

        return destination

    def create(self, validated_data):
        validated_data["destination"] = self._resolve_destination(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if (
            "destination" in validated_data
            or "destination_name" in validated_data
            or "destination_description" in validated_data
        ):
            validated_data["destination"] = self._resolve_destination(validated_data)
        return super().update(instance, validated_data)


class BookingSerializer(serializers.ModelSerializer):
    tourId = serializers.IntegerField(source="tour.id", read_only=True)
    userId = serializers.IntegerField(source="user.id", read_only=True)
    tourName = serializers.SerializerMethodField()
    travelDate = serializers.DateField(source="travel_date")
    totalPrice = serializers.DecimalField(source="total_price", max_digits=12, decimal_places=2, read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "userId",
            "tourId",
            "tourName",
            "travelers",
            "travelDate",
            "totalPrice",
            "status",
            "createdAt",
        ]

    def get_tourName(self, obj):
        return localize(obj.tour.title)


class BookingCreateSerializer(serializers.Serializer):
    tourId = serializers.IntegerField()
    fullName = serializers.CharField(min_length=2, max_length=120)
    phone = serializers.CharField(min_length=6, max_length=30)
    travelers = serializers.IntegerField(min_value=1, max_value=50)
    travelDate = serializers.DateField()
    comment = serializers.CharField(required=False, allow_blank=True, max_length=300)

    def validate_phone(self, value):
        phone = value.strip()
        if not phone.startswith("+") and not phone.isdigit():
            raise serializers.ValidationError("Phone must contain digits and may start with +")
        if phone.startswith("+") and not phone[1:].isdigit():
            raise serializers.ValidationError("Phone must contain only digits after +")
        return phone


class ContactRequestSerializer(serializers.ModelSerializer):
    name = serializers.CharField(min_length=2, max_length=60)
    topic = serializers.ChoiceField(choices=["general", "booking", "partnership"])
    message = serializers.CharField(min_length=10, max_length=300)

    class Meta:
        model = ContactRequest
        fields = ["name", "email", "topic", "message"]


class ContactResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    message = serializers.CharField()


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "name", "country", "description"]


class AdminUserOverviewSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField(allow_blank=True)
    username = serializers.CharField()
    role = serializers.CharField()
    ownedTours = serializers.ListField(child=serializers.DictField())
    bookedTours = serializers.ListField(child=serializers.DictField())


class AdminTourOverviewSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.CharField()
    summary = serializers.CharField(allow_blank=True)
    owner = serializers.DictField()
    destination = serializers.DictField()
    destinationId = serializers.IntegerField()
    bookingsCount = serializers.IntegerField()
    price = serializers.FloatField()
    regionKey = serializers.CharField()
    seasonKey = serializers.CharField()
    durationText = serializers.CharField()
    departureCity = serializers.CharField()
    rating = serializers.FloatField()
    popular = serializers.BooleanField()
    heroLabel = serializers.CharField()
    imageUrl = serializers.CharField(allow_blank=True)
    isPublished = serializers.BooleanField()
