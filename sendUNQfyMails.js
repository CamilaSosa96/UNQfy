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
  const from = mail.from;
  const message = mail.message;
  const messageParts = [
    `From: ${from}`,
    `To: UNQfy subscriber <${address}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    `${message}`,
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