from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from api.models import Destination, Tour


TOURS = [
    {
        "slug": "charyn-canyon-classic",
        "title": "Charyn Canyon Classic",
        "summary": "Weekend route through the Valley of Castles and canyon viewpoints near Almaty.",
        "destination": "Charyn Canyon",
        "region_key": "almaty",
        "season_key": "mid",
        "duration_text": "2 days / 1 night",
        "departure_city": "Almaty",
        "price": Decimal("42000.00"),
        "rating": 4.9,
        "popular": True,
        "hero_label": "Canyon Escape",
        "image_url": "/images/tours/charyn-canyon.jpg",
    },
    {
        "slug": "burabay-lakes-weekend",
        "title": "Burabay Lakes Weekend",
        "summary": "A relaxed day trip from Astana with forest walks and lake views.",
        "destination": "Burabay National Park",
        "region_key": "akmola",
        "season_key": "all",
        "duration_text": "1 day",
        "departure_city": "Astana",
        "price": Decimal("28000.00"),
        "rating": 4.7,
        "popular": True,
        "hero_label": "Lake Weekend",
        "image_url": "/images/tours/burabay-lake.jpg",
    },
    {
        "slug": "bozzhyra-expedition",
        "title": "Bozzhyra Expedition",
        "summary": "Jeep route across Mangystau with cliff panoramas and an overnight camp.",
        "destination": "Bozzhyra Valley",
        "region_key": "mangystau",
        "season_key": "mid",
        "duration_text": "3 days / 2 nights",
        "departure_city": "Aktau",
        "price": Decimal("88000.00"),
        "rating": 5.0,
        "popular": True,
        "hero_label": "Desert Drive",
        "image_url": "/images/tours/bozzhyra-valley.jpg",
    },
    {
        "slug": "turkestan-heritage-route",
        "title": "Turkestan Heritage Route",
        "summary": "Cultural itinerary around the Yasawi mausoleum and the old city.",
        "destination": "Turkestan",
        "region_key": "turkestan",
        "season_key": "mid",
        "duration_text": "2 days / 1 night",
        "departure_city": "Shymkent",
        "price": Decimal("51000.00"),
        "rating": 4.8,
        "popular": False,
        "hero_label": "Heritage Route",
        "image_url": "/images/tours/turkestan-yasawi.jpg",
    },
]


class Command(BaseCommand):
    help = "Add sample tours to a fresh NomadTrips database. Run after creating a staff user."

    def handle(self, *args, **options):
        owner = get_user_model().objects.filter(is_staff=True).order_by("id").first()
        if owner is None:
            raise CommandError("Create a staff user with createsuperuser before seeding tours.")

        created_count = 0
        for item in TOURS:
            destination, _ = Destination.objects.get_or_create(
                name=item["destination"],
                country="Kazakhstan",
            )
            _, created = Tour.objects.get_or_create(
                slug=item["slug"],
                defaults={
                    **{key: value for key, value in item.items() if key != "destination"},
                    "destination": destination,
                    "owner": owner,
                    "is_published": True,
                },
            )
            created_count += int(created)

        self.stdout.write(self.style.SUCCESS(f"Created {created_count} sample tours."))
