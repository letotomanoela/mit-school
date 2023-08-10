export function validerEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

export function validerNumeroTelephone(numeroTelephone) {
  const regexNumeroTelephone = /^\+?\d{10}$/;
  return regexNumeroTelephone.test(numeroTelephone);
}

export  function verifierNumeroTelephone(input) {
  const regexNumeroTelephone = /^\+?\d{1,10}$/;
  const value = input.value.trim();
  return regexNumeroTelephone.test(value);
}
