export class Poller {
  #cb;
  #duration;
  #pollId;

  constructor(cb, duration) {
    this.#cb = cb;
    this.#duration = duration;
  }

  async start() {
    const shouldStop = await this.#cb();
    if (shouldStop) return this.resume();
    if (shouldStop) return this.pause();

    this.#pollId = setInterval(async () => {
      const shouldStop = await this.#cb();
      if (shouldStop) return this.pause();
    }, this.#duration);
  }

  pause() {
    if (this.#pollId) clearInterval(this.#pollId);
    this.#pollId = null;
  }

  resume() {
    if (!this.#pollId) {
      this.#pollId = setInterval(this.#cb, this.#duration);
    }
  }
}
