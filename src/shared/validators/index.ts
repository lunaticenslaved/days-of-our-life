import { validationRules } from '#libs/validate';

export const validators = {
  email: validationRules.required('Email is required'),
  login: (_: 'new' | 'required') => validationRules.required('Login is required'),
  password: (_: 'new' | 'required') => validationRules.required('Password is required'),
};
