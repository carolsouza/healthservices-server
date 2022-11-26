const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.enviar = async (destinatarios, assunto, corpo) => {
  try {
    let resp = await sgMail.send({
      to: destinatarios,
      from: 'd2vid.guedes@gmail.com',
      subject: assunto,
      html: corpo,
    });

    //console.log('Deu bom: ', resp);
    return resp;
  } catch (e) {
    console.log(e);
    if (e.response) {
      console.error(e.response.body);
    }
  }
};
