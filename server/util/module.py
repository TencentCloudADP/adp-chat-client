from glob import glob
from importlib import import_module, util
from inspect import getmembers
from pathlib import Path
from types import ModuleType
import pkgutil
import logging
from sanic.blueprints import Blueprint


def autodiscover(app, module_names: list[ModuleType], recursive: bool = False):
    blueprints = set()
    _imported = set()

    def _find_bps(module):
        nonlocal blueprints

        for _, member in getmembers(module):
            if isinstance(member, Blueprint):
                blueprints.add(member)

    for module in module_names:
        _find_bps(module)

        if recursive:
            base = Path(module.__file__).parent
            for path in glob(f"{base}/**/*.py", recursive=True):
                if path not in _imported:
                    name = "module"
                    if "__init__" in path:
                        *_, name, __ = path.split("/")
                    spec = util.spec_from_file_location(name, path)
                    specmod = util.module_from_spec(spec)
                    _imported.add(path)
                    spec.loader.exec_module(specmod)
                    _find_bps(specmod)

    for bp in blueprints:
        print(f'[autodiscover] registering blueprint {bp}')
        app.blueprint(bp)


def autodiscover_vendor():
    import vendor
    vendors = {}

    for _, name, _ in pkgutil.iter_modules(vendor.__path__):
        module = import_module(f'vendor.{name}')
        if hasattr(module, 'get_class'):
            logging.info(f'loading vendor class: {name}')
            cls_or_list = module.get_class()
            
            # Support both single class and list of classes
            if isinstance(cls_or_list, list):
                for cls in cls_or_list:
                    vendor_name = cls.get_vendor()
                    vendors[vendor_name] = cls
                    logging.info(f'  registered vendor: {vendor_name}')
            else:
                vendor_name = cls_or_list.get_vendor()
                vendors[vendor_name] = cls_or_list
                logging.info(f'  registered vendor: {vendor_name}')

    return vendors
