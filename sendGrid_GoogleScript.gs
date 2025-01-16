// Function to send email via SendGrid on form submission
function sendEmailOnFormSubmit(e) {
  // Your SendGrid API Key
  // At the beginning of your script
  var SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
  var SENDGRID_API_KEY = SCRIPT_PROPERTIES.getProperty('SENDGRID_API_KEY');


  // Extract the submitted data
  var response = e.namedValues;

  // Get the values
  var timestamp = response['Timestamp'][0];
  var contractAddress = response['Contract Address'][0];
  var ownerAddress = response['Owner Address'][0];
  var version = response['Version'][0];

  // Compose the email content
  var subject = 'New Contract Deployed';
  var message = 'A new contract has been deployed.\n\n' +
                'Timestamp: ' + timestamp + '\n' +
                'Contract Address: ' + contractAddress + '\n' +
                'Owner Address: ' + ownerAddress + '\n' +
                'Version: ' + version + '\n';

  // Recipient email
  var recipients = ['insert_Email@blahblahblah.com', 'insert_Email@blahblahblah.com'];

  // Sender email
  var senderEmail = 'info@savetheworldwithart.io';
  var senderName = 'Save The World With Art';

  // Prepare the payload for SendGrid API
  var payload = {
    personalizations: [{
      to: recipients.map(email => ({ email })),
      subject: subject
    }],
    from: {
      email: senderEmail,
      name: senderName
    },
    content: [{
      type: 'text/plain',
      value: message
    }]
  };

  // Send the email via SendGrid API
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + SENDGRID_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch('https://api.sendgrid.com/v3/mail/send', options);

  // Check the response
  if (response.getResponseCode() === 202) {
    Logger.log('Email sent successfully via SendGrid.');
  } else {
    Logger.log('Failed to send email via SendGrid. Response code: ' + response.getResponseCode());
    Logger.log('Response body: ' + response.getContentText());
  }
}
