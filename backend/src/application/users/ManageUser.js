class ManageUser {
  constructor(userRepo, logger) {
    this.userRepo = userRepo;
    this.logger = logger;
  }

  async execute({ id, role, isActive }) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (role !== undefined) {
      const roleId = await this.userRepo.findRoleIdByName(role);
      if (!roleId) {
        throw new Error('El rol especificado no existe');
      }
      await this.userRepo.updateRole(id, roleId);
    }

    if (isActive !== undefined) {
      await this.userRepo.updateActiveStatus(id, isActive);
    }

    this.logger.info(`Usuario gestionado por admin: userId=${id}`);

    return this.userRepo.findById(id);
  }
}

module.exports = ManageUser;
