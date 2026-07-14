import json
import logging
import time

from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url=settings.GROQ_BASE_URL,
)


def ask_gork_with_fallback(prompt: str):
    last_error = None

    for model_name in settings.GORK_MODELS:

        for attempt in range(settings.MAX_RETRIES_PER_MODEL):

            try:
                logging.info(f"Trying {model_name} | Attempt {attempt+1}")

                response = client.responses.create(
                    model=model_name,
                    input=prompt
                )

                if response and response.output_text:
                    logging.info(f"Success with {model_name}")
                    return response.output_text

                raise Exception("Empty response")

            except Exception as e:
                last_error = str(e)
                logging.warning(f"{model_name} failed: {e}")
                time.sleep(1.5)

        logging.info(f"Switching model from {model_name}")

    logging.error("All models failed.")

    return json.dumps({
        "error": "All models unavailable",
        "details": last_error
    })
