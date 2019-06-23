const IdIterator = require('./idIterator');

class IdGenerator {

    constructor(entities = []) {
        const map = {};
        entities.forEach((entity) => {
            map[entity] = new IdIterator();
        });
        this.entities = map;
    }

    obtainId(entity) {
        if (! (entity in this.entities)) throw Error(`No existe la entidad "${entity}"`);
        return this.entities[entity].next();
    }
}

module.exports = IdGenerator;