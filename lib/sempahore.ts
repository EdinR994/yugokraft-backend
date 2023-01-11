export class Semaphore {

    private readonly queue = [];

    private counter = this.concurrency;

    constructor(
        private readonly concurrency: number,
        private readonly timeout: number
    ) {}

    acquire() {
        return new Promise((resolve, reject) => {
            if (this.counter > 0) {
                this.counter--;
                resolve();
                return;
            }
            this.queue.push({ resolve });
        });
    }

    free() {
        if (this.queue.length === 0) {
            this.counter++;
            return;
        }
        const { resolve } = this.queue.shift();
        setTimeout(() => {
            resolve();
        }, this.timeout)
    }
}
