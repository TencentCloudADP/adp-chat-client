from typing import Any


def _has_iframe_origins(config_value: str) -> bool:
    return any(origin.strip() for origin in config_value.split(","))


def cookie_security_options(config: dict[str, Any]) -> dict[str, Any]:
    iframe_enabled = _has_iframe_origins(config.get("IFRAME_ORIGINS", ""))
    if iframe_enabled:
        # Third-party iframe cookie requires SameSite=None and Secure.
        return {
            "secure": True,
            "samesite": "None",
        }
    return {
        "secure": False,
        "samesite": "Lax",
    }


def add_auth_token_cookie(
    response,
    *,
    config: dict[str, Any],
    token: str,
    max_age: int,
    path: str = "/",
):
    options = cookie_security_options(config)
    response.add_cookie(
        "token",
        token,
        path=path,
        max_age=max_age,
        secure=options["secure"],
        samesite=options["samesite"],
    )
