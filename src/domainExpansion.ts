interface Array<T> {
    /**
     * @returns random element of the array
     */
    random(): T;

    /**
     * Checks if element exists in the array
     * @param element element to be checked for
     * @return true if element exists else false
     */
    has(element: T): boolean;
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.has = function (element) {
    return this.some((e) => e === element);
};

interface Date {
    /**
     * @returns something like "пн, 1 янв. 12:34"
     */
    toNormalString(): string;
}

Date.prototype.toNormalString = function () {
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const month = [
        'янв.',
        'февр.',
        'марта',
        'апр.',
        'мая',
        'июня',
        'июля',
        'авг.',
        'сент.',
        'окт.',
        'нояб.',
        'дек.',
    ];
    let str = `${days[this.getDay()]}, ${this.getDate()} ${
        month[this.getMonth()]
    } ${this.getHours()}:${
        this.getMinutes() < 10 ? `${this.getMinutes()}0` : this.getMinutes()
    }`;
    return str;
};
