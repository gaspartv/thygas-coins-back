export function createUserTemplate(name: string) {
  return `
Olá, ${name}

Segue o link para criar sua senha no ${process.env.COMPANY_NAME}

*${process.env.URL_FRONT}/change-password/COLOCAR_O_TOKEN_AQUI*

Se não foi você, então descarte este email!

Obrigado!
*Equipe ${process.env.COMPANY_NAME}*
`;
}
