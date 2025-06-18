from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    def to_dict(self):
        ret = dict(self.__dict__)
        del ret['_sa_instance_state']
        return ret
