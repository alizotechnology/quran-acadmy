document.addEventListener('DOMContentLoaded', () => {
  // Navigation Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Smooth Scrolling for Navigation Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enroll Buttons pre-fill Course Selection in Contact Form
  const courseSelect = document.getElementById('course');
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedCourse = this.getAttribute('data-course');
      if (courseSelect && selectedCourse) {
        courseSelect.value = selectedCourse;
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnText = submitBtn.querySelector('.btn-text');
      const spinner = submitBtn.querySelector('.spinner');

      // Reset alert state
      formAlert.className = 'alert hidden';
      formAlert.textContent = '';

      // Extract form data
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        course: document.getElementById('course').value,
        message: document.getElementById('message').value.trim()
      };

      // Client-side validation
      if (!formData.name || !formData.email || !formData.phone || !formData.course) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
      }

      // UI Loading state
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Submitting...';
      if (spinner) spinner.classList.remove('hidden');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showAlert(result.message || 'Thank you! Your registration has been submitted successfully.', 'success');
          contactForm.reset();
        } else {
          showAlert(result.message || 'Failed to submit form. Please try again.', 'danger');
        }
      } catch (error) {
        console.error('Submission error:', error);
        showAlert('An unexpected error occurred. Please check your connection and try again.', 'danger');
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Submit Request';
        if (spinner) spinner.classList.add('hidden');
      }
    });
  }

  function showAlert(msg, type) {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.className = `alert alert-${type}`;
  }
});
