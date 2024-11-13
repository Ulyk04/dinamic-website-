async function sendSignupData() {
    const form = document.getElementById('signUpForm');
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());
  
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData),
    });
  
    if (response.ok) {
      document.getElementById('signUpForm').style.display = 'none';
      document.getElementById('verifyForm').style.display = 'block';
      alert('Verification code sent to your email');
    } else {
      alert('Sign-up failed');
    }
  }
  
  async function verifyCode() {
    const form = document.getElementById('verifyForm');
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());
  
    const response = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData),
    });
  
    if (response.ok) {
      alert('Sign-up successful!');
      window.location.href = '/welcome';
    } else {
      alert('Invalid verification code');
    }
  }
  