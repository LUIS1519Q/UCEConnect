const SendObservation = require('../../application/incidents/SendObservation');

function initChat(io, deps) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
      || socket.handshake.headers.authorization
      || socket.handshake.query.token;
    if (!token) return next(new Error('Token requerido'));
    try {
      const decoded = deps.jwt.verify(token, deps.JWT_SECRET);
      socket.user = { ...decoded, role: decoded.role.toLowerCase() };
      next();
    } catch (err) {
      next(new Error('Token inválido o expirado'));
    }
  });

  io.on('connection', (socket) => {
    deps.logger.info(`Socket conectado: userId=${socket.user.id}`);

    socket.join(`user_${socket.user.id}`);
    deps.logger.info(`userId=${socket.user.id} joined personal room user_${socket.user.id}`);

    socket.on('join_incident', async ({ incidentId }) => {
      deps.logger.info(`join_incident recibido: incidentId=${incidentId} userId=${socket.user.id}`);
      try {
        const incident = await deps.incidentRepo.findById(incidentId);
        if (!incident) {
          socket.emit('error', { message: 'Incidencia no encontrada' });
          return;
        }
        if (socket.user.role === 'student' && incident.createdBy !== socket.user.id) {
          socket.emit('error', { message: 'No tienes permiso' });
          return;
        }
        socket.join(`incident_${incidentId}`);
        deps.logger.info(`userId=${socket.user.id} joined incident_${incidentId}`);
        socket.emit('joined', { incidentId });

        const observations = await deps.observationRepo.findByIncidentId(incidentId);
        const conversationEnabled = incident.status === 'in_progress';
        const isLocked = ['resolved', 'rejected', 'cancelled'].includes(incident.status);

        socket.emit('conversationLoaded', {
          conversationEnabled,
          messages: observations,
          ...(isLocked && {
            locked: true,
            status: incident.status,
            lockMessage: 'This conversation is now read-only.',
          }),
        });
      } catch (err) {
        deps.logger.error(`Error en join_incident: ${err.message} stack: ${err.stack}`);
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('send_message', async ({ incidentId, message }) => {
      try {
        const incident = await deps.incidentRepo.findById(Number(incidentId));
        if (!incident) {
          socket.emit('error', { message: 'Incidencia no encontrada' });
          return;
        }

        if (incident.status !== 'in_progress') {
          socket.emit('error', {
            event: 'error',
            message: incident.status === 'open'
              ? 'Conversation is not available yet.'
              : 'This conversation is read-only.',
          });
          return;
        }

        if (socket.user.role === 'student') {
          const observations = await deps.observationRepo.findByIncidentId(incidentId);
          const managerReplied = observations.some((o) => o.authorRole === 'manager');
          if (!managerReplied) {
            socket.emit('error', {
              event: 'error',
              message: 'Conversation is not available yet.',
            });
            return;
          }
        }

        const sendObservation = new SendObservation(
          deps.incidentRepo,
          deps.observationRepo,
          deps.logger,
          deps.notificationService
        );
        const observation = await sendObservation.execute({
          incidentId: Number(incidentId),
          authorId: socket.user.id,
          authorName: socket.user.name || socket.user.email,
          authorRole: socket.user.role,
          message,
        });
        io.to(`incident_${incidentId}`).emit('new_message', observation);
      } catch (err) {
        deps.logger.error(`Error en send_message: ${err.message}`);
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      deps.logger.info(`Socket desconectado: userId=${socket.user.id}`);
    });
  });
}

module.exports = { initChat };
