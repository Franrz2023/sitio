const loaderTexts = ['Preparando', 'Cursos', 'Capacitaciones', 'Innovacion'];
let textIndex = 0;
const textEl = document.getElementById('loaderText');

function showWord(word, onDone) {
  textEl.innerHTML = '';
  const letters = word.split('');
  letters.forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'loader-letter';
    span.textContent = char;
    textEl.appendChild(span);
    requestAnimationFrame(() => {
      span.style.transitionDelay = `${i * 0.012}s`;
      span.classList.add('in');
    });
  });
  const totalDelay = letters.length * 0.012 + 80;
  if (onDone) setTimeout(onDone, totalDelay);
}

function hideWord(onDone) {
  const letters = textEl.querySelectorAll('.loader-letter');
  if (!letters.length) { if (onDone) onDone(); return; }
  letters.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.008}s`;
    el.classList.remove('in');
    el.classList.add('out');
  });
  const delay = letters.length * 0.008 + 80;
  if (onDone) setTimeout(onDone, delay);
}

function cycleText() {
  hideWord(() => {
    textIndex = (textIndex + 1) % loaderTexts.length;
    showWord(loaderTexts[textIndex]);
  });
}

showWord(loaderTexts[0]);
setInterval(cycleText, 450);

setTimeout(() => {
  hideWord(() => {
    document.getElementById('loader').classList.add('hidden');
  });
}, 2000);

const courses = {
  inicial: {
    title: 'Nivel Inicial (3-5 años) — Sin pantallas',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    description: 'Desarrollo lógico y espacial con lógicas tangibles, protegiendo el desarrollo cognitivo temprano mediante experiencias concretas y manipulativas.',
    topics: [
      'Lógica algorítmica tangible',
      'Sensores de textura y luz básicos',
      'Circuitos blandos con masas conductoras',
      'Integración en proyectos narrativos'
    ]
  },
  primaria: {
    title: 'Nivel Primario (6-11 años) — STEAM con bloques',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    description: 'Metodología STEAM con bloques visuales interactivos y resolución de problemas en el aula, fomentando el pensamiento computacional desde temprana edad.',
    topics: [
      'Programación por bloques visuales',
      'Sensores ultrasónicos',
      'Resolución de problemas en equipo',
      'Planificación interdisciplinaria'
    ]
  },
  secundaria: {
    title: 'Nivel Secundario (12-17 años) — Electrónica y 3D',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=600&q=80',
    description: 'Diseño 3D, lenguajes basados en texto y electrónica aplicada a sistemas automatizados, preparando a los estudiantes para los desafíos tecnológicos del futuro.',
    topics: [
      'Microcontroladores y programación',
      'Electrónica con actuadores y relés',
      'Diseño e impresión 3D',
      'Proyectos IoT escolares'
    ]
  }
};

const modal = document.getElementById('courseModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTopics = document.getElementById('modalTopics');

function openCourseModal(key) {
  const course = courses[key];
  if (!course) return;

  modalImage.src = course.image;
  modalImage.alt = course.title;
  modalTitle.textContent = course.title;
  modalDescription.textContent = course.description;

  modalTopics.innerHTML = '';
  course.topics.forEach(topic => {
    const li = document.createElement('li');
    li.textContent = topic;
    modalTopics.appendChild(li);
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOutside(event) {
  if (event.target === modal) {
    closeCourseModal();
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && modal.classList.contains('active')) {
    closeCourseModal();
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function () {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
  });
});

document.querySelectorAll('.program-card').forEach(card => {
  const layers = card.querySelectorAll('[data-depth]');
  let animationId = null;

  card.addEventListener('mousemove', function (e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (animationId) cancelAnimationFrame(animationId);

    animationId = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      card.style.transform =
        `rotateY(${(px - 0.5) * 16}deg) rotateX(${(0.5 - py) * 16}deg)`;
      card.style.setProperty('--gx', `${px * 100}%`);
      card.style.setProperty('--gy', `${py * 100}%`);

      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth);
        if (isNaN(d)) return;
        l.style.transform =
          `translateZ(${d}px) translate(${(0.5 - px) * d * 0.5}px, ${(0.5 - py) * d * 0.5}px)`;
      });

      animationId = null;
    });
  });

  card.addEventListener('mouseleave', function () {
    if (animationId) cancelAnimationFrame(animationId);
    card.style.transform = 'rotateY(0) rotateX(0)';
    layers.forEach(l => {
      const d = parseFloat(l.dataset.depth);
      if (isNaN(d)) return;
      l.style.transform = `translateZ(${d}px)`;
    });
  });
});
