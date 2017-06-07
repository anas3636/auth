'use strict';
const config = require('../../config')();
const debug = require('debug')('emails-send');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;

const mailGunTransport = require('nodemailer-mailgun-transport');
const path = require('path');

const templateDir = path.resolve(__dirname, '..', '..', '..', 'api', 'emails', 'bam');

const EmailTemplate = require('email-templates').EmailTemplate;
//https://github.com/orliesaurus/nodemailer-mailgun-transport
const transport = nodemailer.createTransport(mailGunTransport(config.emails.mailgun.auth));
// https://github.com/andris9/nodemailer-html-to-text
transport.use('compile', htmlToText());

// Global email settings
const emailSettings  = config.emails.from;

const mjml = require('mjml');

/**
 * Return the given email
 * or a debug email
 * if we are in debug mode
 */
var getEmailOrDebug = (email) => {
  if (config.emails && config.emails.debug) {
    return config.emails.debugEmail || 'lucas.sebastien@gmail.com';
  } else {
    return email;
  }
}

/**
 * Send the email trough mailgun api
 *
 * @param {object} email : email object
 *  email.to destination email
 *  email.subject email subject
 * @param {string} templateId : identifier of the template to use
 * @param {object} templateVars : Object of variables to send to the template
 * @param {object} templateSubdir : subdirectory in the global email directory
 * @param {bolean} overrideDebugConfig : boolean to tell to send to email even
 * if the debug boolean is TRUE (used to dynamically define debug or test email)
 */
module.exports = function (email, templateId, templateVars, templateSubdir, overrideDebugConfig) {
  return new Promise(function (resolve, reject) {
    var templatePath = '';
    if (templateSubdir) {
      templatePath = path.join(templateDir, templateSubdir, templateId);
    } else {
      templatePath = path.join(templateDir, templateId);
    }
    var template = new EmailTemplate(templatePath);

    template.render(templateVars, function(err, renderedTemplate) {
      if (err) {
        debug('there was an error rendering the template.');
        return console.error(err)
      }
      debug(renderedTemplate.html);
      let mjmlRendered = mjml.mjml2html(renderedTemplate.html);

      let toEmail = getEmailOrDebug(email.to);
      debugger;
      let to =
      transport.sendMail(
      // Email settings
      {
        from: emailSettings.from,
        to: toEmail,
        subject: email.subject,
        bcc: emailSettings.bcc,
        html: mjmlRendered.html,

      }, (err, info) => {
        if (err) {
          debug(err);
          reject(err);
        }
        else {
          debug(info);
          resolve({
            id: templateId,
            log: info,
            vars: templateVars,
            // html: mjmlRendered,
          });
        }
      });
    });
  });
};
