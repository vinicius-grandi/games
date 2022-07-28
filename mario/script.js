/** @type { HTMLDivElement } */
const player = document.querySelector('#player');
/** @type { HTMLDivElement } */
const hurdle = document.querySelector('.square');
const scoreboard = document.querySelector('#scoreboard');

let animationItCounter = 0;

hurdle.addEventListener('animationiteration', () => {
  const value = parseInt(scoreboard.value);
    scoreboard.value = value + 1;
  const currDuration = Number(
    window.getComputedStyle(hurdle).animationDuration.slice(0, -1)
  );

  animationItCounter += 1;

  if (animationItCounter % 10 === 0) {
    hurdle.style.animationDuration = `${currDuration - 0.1}s`;
  }
});

player.addEventListener('animationend', () => {
  player.style.animation = '';
});

const controller = {
  posX: parseInt(window.getComputedStyle(player).right.slice(0, -2)),

  handleInterval: {
    ArrowRight: null,
    ArrowLeft: null,
    [' ']: null,
  },

  changePositionX(direction) {
    const offset = direction === 'left' ? 5 : -5;
    if (this.posX > 561) {
      this.posX = 559;
      return;
    }
    if (this.posX < 0) {
      this.posX = 1;
      return;
    }
    player.style.right = `${this.posX + offset}px`;
    this.posX += offset;
  },

  [' ']: () => {
    player.style.animation = 'jump 1s 1 ease-in';
  },

  ArrowRight() {
    const i = setInterval(() => this.changePositionX('right'), 0);
    this.handleInterval.ArrowRight = i;
  },

  ArrowLeft() {
    const i = setInterval(() => this.changePositionX('left'), 0);
    this.handleInterval.ArrowLeft = i;
  },
};

const loop = setInterval(() => {
  const hurdlePosition = hurdle.offsetLeft;
  const posX = player.offsetLeft;
  if (Math.abs(hurdlePosition - posX) < 50) {
    if (Number(window.getComputedStyle(player).bottom.slice(0, -2)) < 80) {
      hurdle.style.animation = '';
      scoreboard.value = 0;
      window.location.reload(false);
    }
  }
}, 10);

function handleKey(ev) {
  if (ev.key in controller && !controller.handleInterval[ev.key]) {
    return controller[ev.key]();
  }

  if (ev.type === 'keyup') {
    clearInterval(controller.handleInterval[ev.key]);
    controller.handleInterval[ev.key] = null;
  }
}

window.addEventListener('keydown', handleKey);
window.addEventListener('keyup', handleKey);
