from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .assistant import answer_travel_question
from .models import Destination, Tour


class TravelAssistantAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/assistant/chat"

    def test_rejects_empty_message(self):
        response = self.client.post(self.url, {"message": "   "}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["messageKey"], "chat.invalidMessage")

    @override_settings(GEMINI_API_KEY="")
    def test_reports_missing_api_key(self):
        response = self.client.post(self.url, {"message": "Which tour is best?"}, format="json")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["messageKey"], "chat.unavailable")

    @override_settings(GEMINI_API_KEY="test-key")
    @patch("api.views.answer_travel_question", return_value="Try Charyn Canyon.")
    def test_returns_model_reply_with_recent_history(self, answer):
        payload = {
            "message": "What about weekends?",
            "history": [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello"}],
            "language": "en",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["reply"], "Try Charyn Canyon.")
        answer.assert_called_once_with(payload["message"], payload["history"], payload["language"])

    @override_settings(GEMINI_API_KEY="test-key", GEMINI_MODEL="gemini-3.5-flash-lite")
    @patch("api.assistant.genai.Client")
    def test_model_receives_current_tour_catalog_and_history(self, gemini_client):
        owner = get_user_model().objects.create_user(username="manager")
        destination = Destination.objects.create(name="Charyn Canyon", country="Kazakhstan")
        Tour.objects.create(
            owner=owner,
            destination=destination,
            slug="charyn",
            title="Charyn Canyon Classic",
            price="42000.00",
        )
        client = gemini_client.return_value.__enter__.return_value
        client.models.generate_content.return_value.text = "Visit Charyn Canyon Classic."

        reply = answer_travel_question("Weekend trip?", [{"role": "assistant", "content": "Hello"}], "en")

        self.assertEqual(reply, "Visit Charyn Canyon Classic.")
        request = client.models.generate_content.call_args.kwargs
        self.assertIn("Charyn Canyon Classic", request["config"].system_instruction)
        self.assertIn("42000.00", request["config"].system_instruction)
        self.assertEqual(request["model"], "gemini-3.5-flash-lite")
        self.assertEqual([item.role for item in request["contents"]], ["model", "user"])
        self.assertEqual([item.parts[0].text for item in request["contents"]], ["Hello", "Weekend trip?"])
