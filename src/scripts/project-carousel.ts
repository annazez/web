class ProjectCarousel extends HTMLElement {
  #track: HTMLElement | null = null;
  #prevBtn: HTMLButtonElement | null = null;
  #nextBtn: HTMLButtonElement | null = null;
  #dots: NodeListOf<HTMLButtonElement> | null = null;
  #cleanup?: () => void;
  #isBound = false;

  #handleScroll = () => {
    requestAnimationFrame(this.#updateState);
  };

  #handlePrevClick = () => {
    if (!this.#track) return;
    this.#track.scrollBy({ left: -this.#track.clientWidth, behavior: 'smooth' });
  };

  #handleNextClick = () => {
    if (!this.#track) return;
    this.#track.scrollBy({ left: this.#track.clientWidth, behavior: 'smooth' });
  };

  #handleDotClick = (event: Event) => {
    if (!this.#track) return;
    const dot = event.currentTarget as HTMLButtonElement;
    const i = parseInt(dot.getAttribute('data-index') || '0', 10);
    this.#track.scrollTo({ left: this.#track.clientWidth * i, behavior: 'smooth' });
  };

  connectedCallback() {
    this.#track = this.querySelector('.projects-track');
    this.#prevBtn = this.querySelector('.prev') as HTMLButtonElement | null;
    this.#nextBtn = this.querySelector('.next') as HTMLButtonElement | null;
    this.#dots = this.querySelectorAll('.dot');

    if (!this.#track || !this.#prevBtn || !this.#nextBtn || !this.#dots.length) return;

    this.#bindControls();

    setTimeout(() => this.#updateState(), 50);

    const onResize = () => this.#updateState();
    window.addEventListener('resize', onResize);
    this.#cleanup = () => {
      window.removeEventListener('resize', onResize);
      this.#unbindControls();
    };
  }

  disconnectedCallback() {
    if (this.#cleanup) this.#cleanup();
  }

  #updateState = () => {
    if (!this.#track || !this.#prevBtn || !this.#nextBtn || !this.#dots) return;

    const scrollLeft = this.#track.scrollLeft;
    const width = this.#track.clientWidth;
    if (width === 0) return;
    const index = Math.round(scrollLeft / width);

    this.#prevBtn.disabled = index === 0;
    this.#nextBtn.disabled = index === this.#dots.length - 1;

    this.#dots.forEach((dot, i) => {
      if (i === index) {
        dot.setAttribute('data-active', 'true');
      } else {
        dot.removeAttribute('data-active');
      }
    });
  };

  #bindControls() {
    if (this.#isBound || !this.#track || !this.#prevBtn || !this.#nextBtn || !this.#dots) return;

    this.#track.addEventListener('scroll', this.#handleScroll);
    this.#prevBtn.addEventListener('click', this.#handlePrevClick);
    this.#nextBtn.addEventListener('click', this.#handleNextClick);

    this.#dots.forEach((dot, i) => {
      dot.setAttribute('data-index', i.toString());
      dot.addEventListener('click', this.#handleDotClick);
    });

    this.#isBound = true;
  }

  #unbindControls() {
    if (!this.#isBound) return;

    this.#track?.removeEventListener('scroll', this.#handleScroll);
    this.#prevBtn?.removeEventListener('click', this.#handlePrevClick);
    this.#nextBtn?.removeEventListener('click', this.#handleNextClick);

    this.#dots?.forEach(dot => {
      dot.removeEventListener('click', this.#handleDotClick);
    });

    this.#isBound = false;
  }
}

if (!customElements.get('project-carousel')) {
  customElements.define('project-carousel', ProjectCarousel);
}
