class IEmailNotifier {
  sendVerificationCode(email, code) { throw new Error('Not implemented') }
  sendWelcome(email, name) { throw new Error('Not implemented') }
}
module.exports = IEmailNotifier
