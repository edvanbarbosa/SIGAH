// =============================================================================
// lib/validations/index.ts
// Validações de formato client-side para dados cadastrais.
// Apenas validação estrutural — regras de elegibilidade são do backend.
// =============================================================================

/**
 * Valida o formato e os dígitos verificadores de um CPF.
 *
 * @param cpf - O CPF a ser validado (com ou sem formatação).
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) return false;

  // CPF com todos os dígitos iguais é inválido
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação matemática dos dígitos verificadores
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

/**
 * Valida o formato de telefones brasileiros (celulares e fixos).
 * Formatos aceitos: (XX) 9XXXX-XXXX, (XX) XXXX-XXXX, XX9XXXXXXXX, etc.
 *
 * @param phone - Telefone a ser validado.
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "");
  // Telefones brasileiros válidos possuem 10 ou 11 dígitos (com DDD)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;

  // Celulares (11 dígitos) precisam começar com o dígito 9 após o DDD
  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== "9") return false;

  // DDDs não podem começar com zero
  if (cleanPhone.charAt(0) === "0") return false;

  return true;
}

/**
 * Valida o formato de CEP.
 * Formatos aceitos: XXXXX-XXX ou XXXXXXXX.
 *
 * @param cep - CEP a ser validado.
 */
export function validateCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, "");
  return cleanCEP.length === 8;
}

/**
 * Valida se a string é um endereço de e-mail no formato correto.
 *
 * @param email - E-mail a ser verificado.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
