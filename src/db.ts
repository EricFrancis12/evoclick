

// An Librarian is a way to persist data for future recall.
// It has 2 buckets: a long-term bucket, and a short-term bucket
// The long-term bucket contains all of the data that we want to store and is the ultimate source of truth.
// The short-term bucket contains an exact copy of the data in the long-term bucket,
// however it keeps it floating in RAM for faster access.
// By nature, everything in the short-term bucket is NOT guaranteed to be accurate,
// but it is there because it provides faster access.
// Wnenever the long-term bucket is modified successfully AND every X minutes,
// the Librarian creates a new copy of the long-term bucket and makes that the new short-term bucket
// so we have a way of keeping both in sync.

const fiveMinutesMs = 5 * 60 * 1000;

type TPred<T> = (data: T) => boolean;

export class Librarian<T> {
    panicked: boolean;
    cacheExpiry: number; // milliseconds
    interval: NodeJS.Timeout | null;

    constructor({
        cacheExpiry = fiveMinutesMs,
        startImmedietly = true
    }) {
        this.panicked = false;
        this.cacheExpiry = cacheExpiry;

        this.interval = startImmedietly
            ? setInterval(refreshCache, this.cacheExpiry)
            : null;
    }

    // Return all items that we have stored
    async find(pred: TPred<T> = () => true): Promise<T[] | Error> {
        // if panicked, pull all items from the long-term bucket
        // else, pull all items from the short-term bucket
        return [];
    }

    // Search for a specific item
    async findOne(pred: TPred<T>): Promise<T | null | Error> {
        // if panicked, search the long-term bucket for a match, and if found return it
        // else, search the short-term bucket for a match, and if found return it
        // if not found, search the long-term bucket for a match and return it
        // if still not found return null
    }

    async insert(data: T | T[]): Promise<T | Error> {
        // insert a new item into the long-term bucket
        // if not successful, return an Error
        // if successful, attempt to create a new copy of the long-term data and have that become the new short-term data
        // if not successful, enter panic mode 
    }

    async updateOne(pred: TPred<T>): Promise<T | null | Error> {

    }

    async deleteOne(pred: TPred<T>): Promise<true | Error> {

    }

    panic(): void {
        if (this.panicked === true) return;
        // recursively try to call the long-term bucket for a copy of the data
        // when optained, set that data as the new short-term bucket, and turn off panicked
    }

    setCacheExpiry(ce: number): void {
        this.cacheExpiry = ce;
    }
}

function refreshCache() {
    // ...
}
