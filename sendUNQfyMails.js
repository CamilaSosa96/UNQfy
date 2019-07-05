const getGmailClient = require('./gmailClient');

function sendMail(address, mail){
    const gmailClient = getGmailClient();
    gmailClient.users.messages.send(
        {
          userId: 'me',
          requestBody: {
            raw: createMessage(address, mail),
          },
        }
      );
}

function createMessage(address, mail) {
    const subject = mail.subject;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const from = mail.from;
    const utf8From = `=?utf-8?B?${Buffer.from(from).toString('base64')}?=`;
    const mailAddress = address;
    const utf8Address = `=?utf-8?B?${Buffer.from(mailAddress).toString('base64')}?=`;
    const message = mail.message;
    const utf8Message = `=?utf-8?B?${Buffer.from(message).toString('base64')}?=`;
    const messageParts = [
      `From: ${utf8From}`,
      `To: UNQfy subscriber <${utf8Address}>`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      `${utf8Message}`,
    ];
    const myMessage = messageParts.join('\n');
  
    const encodedMessage = Buffer.from(myMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    return encodedMessage;
}

module.exports = sendMail;