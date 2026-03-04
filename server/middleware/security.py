from app_factory import TAgenticApp

app = TAgenticApp.get_app()


def _parse_iframe_origins(config_value: str) -> list[str]:
    # Support comma-separated origins from .env and treat empty as default.
    origins = [origin.strip() for origin in config_value.split(",") if origin.strip()]
    return origins


def _build_frame_ancestors(config_value: str) -> str:
    origins = _parse_iframe_origins(config_value)
    if not origins:
        return "'self'"
    return " ".join(origins)


def _merge_csp_with_frame_ancestors(csp_value: str, frame_ancestors: str) -> str:
    if not csp_value:
        return f"frame-ancestors {frame_ancestors}"

    directives = [directive.strip() for directive in csp_value.split(";") if directive.strip()]
    directives = [directive for directive in directives if not directive.startswith("frame-ancestors ")]
    directives.append(f"frame-ancestors {frame_ancestors}")
    return "; ".join(directives)


@app.middleware("response")
async def set_iframe_policy(_request, response):
    frame_ancestors = _build_frame_ancestors(app.config.IFRAME_ORIGINS)
    current_csp = response.headers.get("Content-Security-Policy", "")
    response.headers["Content-Security-Policy"] = _merge_csp_with_frame_ancestors(current_csp, frame_ancestors)

    if frame_ancestors == "'self'":
        response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
