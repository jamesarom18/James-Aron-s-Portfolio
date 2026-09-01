document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = document.body.dataset.page;

  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });

  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggleButton && nav) {
    toggleButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');

  if (form && status) {
    const savedData = localStorage.getItem('portfolio-contact-form');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.entries(parsed).forEach(([key, value]) => {
          const field = form.elements.namedItem(key);
          if (field) {
            if (field.type === 'radio') {
              const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
              if (radio) radio.checked = true;
            } else if (field.type === 'checkbox') {
              field.checked = Array.isArray(value) ? value.includes(field.value) : Boolean(value);
            } else {
              field.value = value;
            }
          }
        });
      } catch (error) {
        console.warn('Unable to restore saved form data.', error);
      }
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = form.elements.namedItem('name')?.value.trim() || '';
      const email = form.elements.namedItem('email')?.value.trim() || '';
      const message = form.elements.namedItem('message')?.value.trim() || '';

      if (!name || !email || !message) {
        status.textContent = 'Please complete the required fields before submitting.';
        status.classList.remove('success');
        status.classList.add('error');
        return;
      }

      const formFields = {
        name,
        email,
        subject: form.elements.namedItem('subject')?.value || '',
        gender: form.querySelector('input[name="gender"]:checked')?.value || '',
        interest: Array.from(form.querySelectorAll('input[name="interest"]:checked')).map((box) => box.value),
        message,
      };

      localStorage.setItem('portfolio-contact-form', JSON.stringify(formFields));

      status.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
      status.classList.remove('error');
      status.classList.add('success');

      form.reset();
    });

    form.addEventListener('reset', () => {
      status.textContent = '';
      status.classList.remove('success', 'error');
      localStorage.removeItem('portfolio-contact-form');
    });
  }
});
