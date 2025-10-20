export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6 && password.length <= 128;
};

export const validateName = (name) => {
  return typeof name === 'string' && name.trim().length >= 1 && name.length <= 50;
};

export const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const validateRegistration = (data) => {
  const errors = [];
  
  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!validatePassword(data.password)) {
    errors.push('Password must be 6-128 characters');
  }
  
  if (!validateName(data.firstName)) {
    errors.push('First name is required (1-50 characters)');
  }
  
  if (!validateName(data.lastName)) {
    errors.push('Last name is required (1-50 characters)');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      email: sanitizeInput(data.email?.toLowerCase()),
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      phone: sanitizeInput(data.phone),
      password: data.password // Don't sanitize password
    }
  };
};