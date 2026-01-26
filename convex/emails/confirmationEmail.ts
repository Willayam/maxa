export function getConfirmationEmailHtml(confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FA;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 480px; width: 100%; border-collapse: collapse;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-size: 32px; font-weight: 900; color: #FFC800;">Maxa</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 24px; border: 2px solid #E0E6EB; padding: 40px 32px;">

              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 900; color: #2C3E50; text-align: center;">
                Bekräfta din e-post
              </h1>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #6C7A89; text-align: center;">
                Tack för att du vill vara med på Maxas väntelista! Klicka på knappen nedan för att bekräfta din e-postadress.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}"
                       style="display: inline-block;
                              padding: 16px 40px;
                              background-color: #FFC800;
                              color: #2C3E50;
                              font-size: 16px;
                              font-weight: 800;
                              text-decoration: none;
                              text-transform: uppercase;
                              letter-spacing: 0.5px;
                              border-radius: 16px;
                              border-bottom: 4px solid #E5A400;">
                      Bekräfta e-post
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #6C7A89; text-align: center;">
                Fungerar inte knappen? Kopiera och klistra in den här länken:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #A8A3B8; text-align: center; word-break: break-all;">
                ${confirmUrl}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6C7A89;">
                Du får det här mejlet för att du registrerade dig på maxahp.se
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #A8A3B8;">
                © ${new Date().getFullYear()} Maxa. Alla rättigheter förbehållna.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
