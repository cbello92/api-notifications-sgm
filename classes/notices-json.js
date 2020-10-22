class NoticesJson {

    constructor (before, after) {
        this.lengthBefore = before;
        this.lengthAfter = after;
    }

    static setNoticesJson(before, after) { 
        this.lengthBefore = before;
        this.lengthAfter = after;

        return new NoticesJson(before, after);
    }

    static getNoticesJson () {
        return {
            lengthBefore: this.lengthBefore,
            lengthAfter: this.lengthAfter
        }
    }
}

module.exports = {
    NoticesJson
}