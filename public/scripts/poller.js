export class Poller {
  #cb;
  #duration;
  #pollId;

  constructor(cb, duration) {
    this.#cb = cb;
    this.#duration = duration;
  }

  async start() {
    await this.#cb();
    this.#pollId = setInterval(this.#cb, this.#duration);
  }

  pause() {
    if (this.#pollId) clearInterval(this.#pollId);
  }

  resume() {
    if (!this.#pollId) {
      this.#pollId = setInterval(this.#cb, this.#duration);
    }
  }
}
