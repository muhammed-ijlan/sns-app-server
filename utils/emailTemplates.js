function formatLink(link) {
    return link.replace(/^https?:\/\//, "");
}

function getSignUpVerificationTemplate(link) {
    link = formatLink(link);
    let template = `
  <!DOCTYPE html public "-//W3C//DTD HTML 4.0 Transitional//EN">
  <html lang="en">
  <head>
      <title>
          Lambda Gaming
      </title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  
      <style>
          /* Add your CSS styles here */
      </style>
  </head>
  
  <body style="font-family: 'Poppins', sans-serif; ">
      <table style="padding: 20px !important; margin: 0 auto; max-width: 700px; min-height: 400px;">
          <tr style="text-align: center;">
              <td style="vertical-align: top;">
                  <img src="${process.env.STACKED_LOGO_URL}" alt="stackroots" style="width: 100px;">
                  <p style="font-weight: 600; font-size: 24px; line-height: 36px; margin-bottom: 36px; text-align: center; color: black;">
                      Welcome!
                  </p>
                  <p style="margin-top: 4px !important; font-weight: 400; font-size: 20px; line-height: 30px !important; color: black;">
                      Hello, Greetings from StackEd. Complete your registration process and start your journey !!!
                  </p> 
                      <a href="${link}" style="color: #2E52A4; cursor: pointer; margin-top:"10px !important;">click here</a>
              </td>
          </tr>
      </table>
  
      <div style="text-align: center; margin-top: 100px;">
          <div style="display: inline-block; vertical-align: top; width: 40px;">
              <img src="https://stackroots-space.fra1.digitaloceanspaces.com/production%2Fcommon%2Fplanet-earth%201.png"
                  alt="earth" style="width: 30px; height: 30px;">
          </div>
          <div style="margin-right: 15px; display: inline-block; vertical-align: top;">
              <p style="margin-top: 6px !important;">
                  Please don't print this email unless it is necessary. Spread environmental awareness.
              </p>
          </div>
      </div>
  </body>
  </html>  
  `;
    return template;
}

module.exports = {
    getSignUpVerificationTemplate,
};
