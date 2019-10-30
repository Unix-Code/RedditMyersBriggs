import os

import requests
from flask import Flask, current_app
from flask_cors import CORS

application = Flask(__name__)
CORS(application)
application.config["INDICO_API_KEY"] = os.environ.get("INDICO_API_KEY")
application.config["MIN_DATA_LENGTH"] = os.environ.get("MIN_DATA_LENGTH", 10)


def to_percent_by_len(nums, length=None):
    return [round(100 * (num / (length if length is not None else len(nums))), 3) for num in nums]


def get_personas(subreddit: str):
    pushshift_params = {
        "subreddit": subreddit,
        "is_self": True,
        "sort_type": "score",
        "sort": "desc",
        "size": 1000,
    }

    resp = requests.get('https://api.pushshift.io/reddit/search/submission', params=pushshift_params)

    unfiltered_texts = [post.get("selftext", "").replace('&amp;#x200B;', '').strip() for post in
                        resp.json().get("data", [])]

    self_texts = [post for post in unfiltered_texts if post and len(post) > 30]

    if len(self_texts) < current_app.config.get("MIN_DATA_LENGTH"):
        return None

    indico_payload = {
        "api_key": current_app.config.get("INDICO_API_KEY"),
        "data": self_texts,
        "persona": True
    }
    personas = requests.post('https://apiv2.indico.io/personality/batch', json=indico_payload)

    return personas.json().get("results", [])


@application.route('/personas/stats/<subreddit>')
def get_persona_stats(subreddit):
    raw_results = get_personas(subreddit)

    if raw_results is None:
        return "Not Enough Data For Analysis", 400

    persona_results = [result for result in raw_results if result]

    sum_results = {}
    max_count_results = {}

    for persona_result in persona_results:
        max_count_persona = None
        max_count_val = None
        for persona, value in persona_result.items():
            if persona in sum_results:
                sum_results[persona] += value
            else:
                sum_results[persona] = value
            if max_count_val is None or value > max_count_val:
                max_count_val = value
                max_count_persona = persona

        max_count_results[max_count_persona] = max_count_results.get(max_count_persona, 0) + 1

    result = {
        "data": {
            "avg_personas": list(sum_results.keys()),
            "avg_results": to_percent_by_len(sum_results.values(), len(persona_results)),
            "max_count_personas": list(max_count_results.keys()),
            "max_count_results": to_percent_by_len(max_count_results.values(), len(persona_results))
        }
    }
    return result
