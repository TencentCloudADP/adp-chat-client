from .openai_compatible import OpenAICompatible, OpenAI, Ollama


def get_class():
    """
    Return vendor classes for registration
    
    This function is called by autodiscover_vendor() to register all vendor classes.
    We return a list of all three classes (OpenAICompatible, OpenAI, Ollama) so that
    users can use any of these names in their Vendor configuration.
    """
    # Return all three classes for registration
    # The autodiscover_vendor() will register each one by calling get_vendor()
    return [OpenAICompatible, OpenAI, Ollama]


__all__ = ['OpenAICompatible', 'OpenAI', 'Ollama', 'get_class']
