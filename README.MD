I use this to send emails using the free versions of google sheets and the sendGrid API when a google form is filled out and a google sheet is updated.

1) How it accesses my email?
these lines:
// Function to send email via SendGrid on form submission
function sendEmailOnFormSubmit(e) {
  // Your SendGrid API Key
  // At the beginning of your script
  var SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
  var SENDGRID_API_KEY = SCRIPT_PROPERTIES.getProperty('SENDGRID_API_KEY');

The SENDGRID_API_KEY is securely stored in the Google Sheet extension: Apps Script, in the project setting's "Script Properties", away from plain view and accessed only by the backend of google sheets

2) Next the script detects input fields when entries are made, uses the google sheet columns that where updated by google forms, and it formats an email with subject and a message with the following lines:

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

3) you will need to update the recipient emails, can be any email:

  // Recipient email
  var recipients = ['insert_Email@blahblahblah.com', 'insert_Email@blahblahblah.com'];

4) These emails, the "Sender" have to be what you set up in sendGrid:
// Sender email
  var senderEmail = 'info@savetheworldwithart.io';
  var senderName = 'Save The World With Art';

5) The rest is sending it off to sendGrid properly formatted so it knows how to handle the package and can deliver the emails to the "recipients"

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

Good Luck! and have fun setting this up!  Use LLMs to help you if you get stuck, I built 99% of this and so much more with the assistance of ChatGPT
