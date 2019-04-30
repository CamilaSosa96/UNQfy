class IdIterator {
    constructor(initialId = 1) {
        this.nextId = initialId;
    }

    next() {
        this.nextId += 1;
        return this.nextId - 1;
    }
}

module.exports = IdIterator;