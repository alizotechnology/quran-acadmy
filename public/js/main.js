document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
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
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
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

  // Enroll Buttons handler
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const selectedCourse = this.getAttribute('data-course') || 'Quran Course';
      const courseSelect = document.getElementById('course') || document.getElementById('trial_course') || document.getElementById('courseTrack');
      if (courseSelect) {
        courseSelect.value = selectedCourse;
      }
      const targetForm = document.getElementById('contact') || document.getElementById('trialBookingForm') || document.getElementById('admissionsInquiryForm');
      if (targetForm) {
        targetForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 1. Contact Form Handler (contactForm in index.html or contact.html)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formAlert = document.getElementById('formAlert');
      const submitBtn = document.getElementById('submitBtn');

      const formData = {
        name: (document.getElementById('name') || {}).value?.trim(),
        email: (document.getElementById('email') || {}).value?.trim(),
        phone: (document.getElementById('phone') || {}).value?.trim(),
        course: (document.getElementById('course') || {}).value,
        message: (document.getElementById('message') || {}).value?.trim()
      };

      if (!formData.name || !formData.email || !formData.phone) {
        if (formAlert) {
          formAlert.textContent = 'Please fill in required name, email, and phone fields.';
          formAlert.className = 'alert alert-danger';
          formAlert.classList.remove('hidden');
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok && result.success) {
          if (formAlert) {
            formAlert.textContent = result.message || 'Thank you! Request submitted successfully.';
            formAlert.className = 'alert alert-success';
            formAlert.classList.remove('hidden');
          }
          contactForm.reset();
        } else {
          if (formAlert) {
            formAlert.textContent = result.message || 'Submission failed. Please try again.';
            formAlert.className = 'alert alert-danger';
            formAlert.classList.remove('hidden');
          }
        }
      } catch (err) {
        console.error('Submission error:', err);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // 2. Admissions Inquiry Form Handler (contact.html)
  const admissionsInquiryForm = document.getElementById('admissionsInquiryForm');
  if (admissionsInquiryForm) {
    admissionsInquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value?.trim();
      const email = document.getElementById('emailAddress')?.value?.trim();
      const code = document.getElementById('countryCode')?.value || '';
      const phoneNum = document.getElementById('phoneNumber')?.value?.trim() || '';
      const category = document.getElementById('inquiryCategory')?.value || '';
      const timezone = document.getElementById('studentTimezone')?.value || '';
      const goal = document.getElementById('primaryGoal')?.value || '';
      const details = document.getElementById('inquiryDetails')?.value?.trim() || '';

      const payload = {
        name: fullName,
        email: email,
        phone: `${code} ${phoneNum}`.trim(),
        course: category || goal || 'General Inquiry',
        message: `Timezone: ${timezone} | Goal: ${goal} | Details: ${details}`
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (response.ok && result.success) {
          const successModal = document.getElementById('formSuccessModal');
          if (successModal) {
            successModal.classList.remove('hidden');
          } else {
            alert(result.message || 'Inquiry submitted successfully!');
          }
          admissionsInquiryForm.reset();
        }
      } catch (err) {
        console.error('Admissions form error:', err);
      }
    });
  }

  // 3. Trial Booking Form Handler (pricing.html & index.html)
  const trialBookingForm = document.getElementById('trialBookingForm');
  if (trialBookingForm) {
    trialBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitTrialForm(trialBookingForm);
    });
  }
});

// Global function for handleTrialSubmit (index.html)
window.handleTrialSubmit = async function(e) {
  if (e) e.preventDefault();
  const form = e ? e.target : document.getElementById('trialBookingForm');
  if (form) {
    await submitTrialForm(form);
  }
};

async function submitTrialForm(form) {
  const name = form.querySelector('#trial_name, #fullName')?.value?.trim() || form.querySelector('input[type="text"]')?.value?.trim();
  const email = form.querySelector('#trial_email, #emailAddress')?.value?.trim() || form.querySelector('input[type="email"]')?.value?.trim();
  const phone = form.querySelector('#trial_phone, #whatsappNumber, #phoneNumber')?.value?.trim() || form.querySelector('input[type="tel"]')?.value?.trim();
  const course = form.querySelector('#trial_course, #courseTrack, #inquiryCategory')?.value || 'Free Trial Class';
  const timezone = form.querySelector('#trial_timezone, #studentTimezone')?.value || 'GMT';
  const tutorPref = form.querySelector('#trial_tutor_pref')?.value || '';
  const notes = form.querySelector('#additionalNotes, #inquiryDetails')?.value?.trim() || '';

  const payload = { name, email, phone, course, timezone, tutorPref, notes };

  try {
    const response = await fetch('/api/trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (response.ok && result.success) {
      const successState = document.getElementById('bookingSuccessState') || document.getElementById('formSuccessModal');
      if (successState) {
        successState.classList.remove('hidden');
        form.classList.add('hidden');
      } else {
        alert(result.message || 'Free Trial requested successfully!');
        form.reset();
      }
    } else {
      alert(result.message || 'Failed to submit trial request.');
    }
  } catch (err) {
    console.error('Trial submission error:', err);
  }
}

// Global function for handleSafeguardSubmit (safeguarding.html)
window.handleSafeguardSubmit = async function(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('safeguardForm');
  if (!form) return;

  const textInputs = form.querySelectorAll('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const telInput = form.querySelector('input[type="tel"]');
  const selectCategory = form.querySelector('select');
  const textarea = form.querySelector('textarea');
  const anonCheck = document.getElementById('anonCheck');

  const payload = {
    name: textInputs[0]?.value?.trim() || 'Anonymous',
    email: emailInput?.value?.trim() || '',
    phone: telInput?.value?.trim() || '',
    category: selectCategory?.value || 'Safeguarding Concern',
    studentName: textInputs[1]?.value?.trim() || '',
    teacherName: textInputs[2]?.value?.trim() || '',
    details: textarea?.value?.trim() || '',
    anonymous: anonCheck?.checked || false
  };

  try {
    const response = await fetch('/api/safeguard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (response.ok && result.success) {
      const successMsg = document.getElementById('formSuccessMessage');
      if (successMsg) {
        successMsg.classList.remove('hidden');
      } else {
        alert(result.message || 'Safeguarding report submitted successfully.');
      }
      form.reset();
    } else {
      alert(result.message || 'Submission failed. Please check inputs.');
    }
  } catch (err) {
    console.error('Safeguard submission error:', err);
  }
};

// Global function for handleAssessmentSubmit (tajweed-ijazah.html)
window.handleAssessmentSubmit = async function(e) {
  if (e) e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]')?.value?.trim();
  const phone = form.querySelector('input[type="tel"]')?.value?.trim();
  const selects = form.querySelectorAll('select');
  const ageGroup = selects[0]?.value || '';
  const teacherPref = selects[1]?.value || '';

  const payload = {
    name: name || 'Assessment Candidate',
    email: 'assessment@alhuda.com',
    phone: phone || '',
    course: 'Tajweed & Ijazah 1-on-1 Evaluation',
    notes: `Age Group: ${ageGroup} | Teacher Pref: ${teacherPref}`
  };

  try {
    const response = await fetch('/api/trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (response.ok && result.success) {
      alert(result.message || '1-on-1 Evaluation scheduled successfully!');
      form.reset();
    } else {
      alert(result.message || 'Failed to submit evaluation request.');
    }
  } catch (err) {
    console.error('Assessment submission error:', err);
  }
};
