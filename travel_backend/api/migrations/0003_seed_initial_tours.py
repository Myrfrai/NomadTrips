from decimal import Decimal

from django.db import migrations


def seed_initial_tours(apps, schema_editor):
    Destination = apps.get_model("api", "Destination")
    Tour = apps.get_model("api", "Tour")
    User = apps.get_model("auth", "User")

    owner = User.objects.filter(is_staff=True).order_by("id").first() or User.objects.order_by("id").first()
    if owner is None:
        return

    destinations = {
        "almaty": Destination.objects.get_or_create(
            name="Charyn Canyon",
            country="Kazakhstan",
            defaults={"description": "Canyon routes and scenic viewpoints near Almaty."},
        )[0],
        "akmola": Destination.objects.get_or_create(
            name="Burabay National Park",
            country="Kazakhstan",
            defaults={"description": "Lakes, pine forests, and easy weekend escapes."},
        )[0],
        "mangystau": Destination.objects.get_or_create(
            name="Bozzhyra Valley",
            country="Kazakhstan",
            defaults={"description": "Plateau views, desert drives, and remote camps."},
        )[0],
        "turkestan": Destination.objects.get_or_create(
            name="Turkestan",
            country="Kazakhstan",
            defaults={"description": "Historic monuments, local crafts, and culture."},
        )[0],
    }

    tours = [
        {
            "slug": "charyn-canyon-classic",
            "title": "Charyn Canyon Classic",
            "summary": "Weekend route to the canyon, the Valley of Castles, and sunset viewpoints near Almaty.",
            "region_key": "almaty",
            "season_key": "mid",
            "duration_text": "2 days / 1 night",
            "departure_city": "Almaty",
            "price": Decimal("42000.00"),
            "rating": 4.9,
            "popular": True,
            "hero_label": "Canyon Escape",
            "image_url": "/images/tours/charyn-canyon.jpg",
            "destination": destinations["almaty"],
        },
        {
            "slug": "burabay-lakes-weekend",
            "title": "Burabay Lakes Weekend",
            "summary": "A light trip from Astana with lakeside walks, forest air, and family-friendly pacing.",
            "region_key": "akmola",
            "season_key": "all",
            "duration_text": "1 day",
            "departure_city": "Astana",
            "price": Decimal("28000.00"),
            "rating": 4.7,
            "popular": True,
            "hero_label": "Lake Weekend",
            "image_url": "/images/tours/burabay-lake.jpg",
            "destination": destinations["akmola"],
        },
        {
            "slug": "bozzhyra-expedition",
            "title": "Bozzhyra Expedition",
            "summary": "Remote jeep route through Mangystau with cliff panoramas, stargazing, and overnight camp.",
            "region_key": "mangystau",
            "season_key": "mid",
            "duration_text": "3 days / 2 nights",
            "departure_city": "Aktau",
            "price": Decimal("88000.00"),
            "rating": 5,
            "popular": True,
            "hero_label": "Desert Drive",
            "image_url": "/images/tours/bozzhyra-valley.jpg",
            "destination": destinations["mangystau"],
        },
        {
            "slug": "turkestan-heritage-route",
            "title": "Turkestan Heritage Route",
            "summary": "Cultural itinerary around the Yasawi mausoleum, artisan quarters, and old city atmosphere.",
            "region_key": "turkestan",
            "season_key": "mid",
            "duration_text": "2 days / 1 night",
            "departure_city": "Shymkent",
            "price": Decimal("51000.00"),
            "rating": 4.8,
            "popular": False,
            "hero_label": "Heritage Route",
            "image_url": "/images/tours/turkestan-yasawi.jpg",
            "destination": destinations["turkestan"],
        },
    ]

    for payload in tours:
        Tour.objects.get_or_create(
            slug=payload["slug"],
            defaults={
                **payload,
                "owner": owner,
                "is_published": True,
            },
        )


def remove_seeded_tours(apps, schema_editor):
    Tour = apps.get_model("api", "Tour")
    Tour.objects.filter(
        slug__in=[
            "charyn-canyon-classic",
            "burabay-lakes-weekend",
            "bozzhyra-expedition",
            "turkestan-heritage-route",
        ]
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_contactrequest_booking_comment_booking_full_name_and_more"),
    ]

    operations = [
        migrations.RunPython(seed_initial_tours, remove_seeded_tours),
    ]
