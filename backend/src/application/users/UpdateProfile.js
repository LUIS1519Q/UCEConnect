class UpdateProfile {
  constructor(userRepo, logger) {
    this.userRepo = userRepo;
    this.logger = logger;
  }

  async execute({ userId, firstName, lastName, phone, facultyId, careerId }) {
    if (firstName !== undefined) {
      if (firstName.length < 2 || firstName.length > 50) {
        throw new Error('First name must contain between 2 and 50 characters.');
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName)) {
        throw new Error('First name must contain only letters and spaces.');
      }
    }

    if (lastName !== undefined) {
      if (lastName.length < 2 || lastName.length > 50) {
        throw new Error('Last name must contain between 2 and 50 characters.');
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)) {
        throw new Error('Last name must contain only letters and spaces.');
      }
    }

    if (phone !== undefined) {
      if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
        throw new Error('Invalid phone number format.');
      }
    }

    if (facultyId !== undefined) {
      const faculties = await this.userRepo.findFaculties();
      const facultyExists = faculties.some((faculty) => faculty.id === facultyId);
      if (!facultyExists) {
        throw new Error('Selected faculty does not exist.');
      }
    }

    if (careerId !== undefined) {
      let targetFacultyId = facultyId;

      if (targetFacultyId === undefined) {
        const career = await this.userRepo.findCareerById(careerId);
        if (!career) {
          throw new Error('Selected career does not exist.');
        }
        targetFacultyId = career.faculty_id;
      }

      const careers = await this.userRepo.findCareersByFaculty(targetFacultyId);
      const careerExists = careers.some((career) => career.id === careerId);
      if (!careerExists) {
        throw new Error('Selected career does not belong to the selected faculty.');
      }
    }

    await this.userRepo.updateProfile(userId, { firstName, lastName, phone, facultyId, careerId });

    this.logger.info(`Profile updated: userId=${userId}`);

    return this.userRepo.findById(userId);
  }
}

module.exports = UpdateProfile;
