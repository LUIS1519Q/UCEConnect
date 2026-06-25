class IUserRepo {
  findByEmail(email) { throw new Error('Not implemented') }
  findById(id) { throw new Error('Not implemented') }
  save(user) { throw new Error('Not implemented') }
  updateVerified(userId) { throw new Error('Not implemented') }
  saveVerifyCode(userId, code, expiresAt) { throw new Error('Not implemented') }
  findVerifyCode(email) { throw new Error('Not implemented') }
  markCodeAsUsed(email) { throw new Error('Not implemented') }
  saveResetCode(userId, code, expiresAt) { throw new Error('Not implemented') }
  findResetCode(email) { throw new Error('Not implemented') }
  markResetCodeAsUsed(email) { throw new Error('Not implemented') }
  updatePassword(userId, passwordHash) { throw new Error('Not implemented') }
}
module.exports = IUserRepo
