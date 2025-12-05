import axios from 'axios'

/**
 * Servicio para enviar emails usando la API
 */
export const emailService = {
  /**
   * Envía un email usando la API
   * @param {Object} options - Opciones del email
   * @param {number} options.group - ID del grupo
   * @param {string[]} options.toEmails - Array de emails destinatarios
   * @param {string} options.subject - Asunto del email
   * @param {string} options.htmlBody - Cuerpo del email en HTML
   * @returns {Promise} Promise con la respuesta de la API
   */
  sendEmail: async ({ group = 10, toEmails = ['manuelcoriaesc@gmail.com'], subject, htmlBody }) => {
    try {
      const response = await axios.post(
        '/email/v1/send_email_v2',
        {
          group,
          toEmails,
          subject,
          htmlBody
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      return response
    } catch (error) {
      console.error('Error al enviar email:', error)
      throw error
    }
  },

  /**
   * Genera el template HTML base para emails
   * @param {Object} options - Opciones del template
   * @param {string} options.title - Título del email
   * @param {string} options.greeting - Saludo (ej: "Estimado/a Juan")
   * @param {string} options.content - Contenido principal del email
   * @param {string} options.alertBox - Contenido de la caja de alerta (opcional)
   * @param {string} options.signature - Firma (ej: "Dr. Juan Pérez")
   * @returns {string} HTML del email
   */
  generateEmailTemplate: ({ title, greeting, content, alertBox, signature }) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #e4c8ff;
            color: #000000;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fdfdfd;
            border-radius: 1.4rem;
            padding: 32px;
            box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
          }
          .email-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 24px;
            background: #ffffff;
            border-bottom: 1px solid #e7e7ee;
            border-radius: 1.2rem 1.2rem 0 0;
            margin: -32px -32px 24px -32px;
          }
          .clinic-name {
            font-size: 18px;
            font-weight: 700;
            color: #000000;
            margin: 0;
          }
          .header {
            background: linear-gradient(180deg, rgba(112, 51, 255, 1) 0%, rgba(54, 0, 181, 1) 100%);
            color: #ffffff;
            padding: 24px;
            border-radius: 1.2rem;
            margin-bottom: 24px;
            text-align: center;
          }
          h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .greeting {
            font-size: 16px;
            color: #000000;
            margin-bottom: 16px;
          }
          .content {
            color: #000000;
            margin-bottom: 20px;
          }
          .estudios-list {
            background: #e2ebff;
            border: 1px solid #e7e7ee;
            border-radius: 1rem;
            padding: 20px;
            margin: 20px 0;
          }
          .estudios-list ul {
            margin: 10px 0;
            padding-left: 20px;
            list-style: none;
          }
          .estudios-list li {
            margin: 8px 0;
            position: relative;
            padding-left: 8px;
          }
          .estudios-list strong {
            color: #7033ff;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 14px;
          }
          .estudios-list ul ul {
            margin-top: 8px;
            padding-left: 16px;
          }
          .estudios-list ul ul li {
            color: #525252;
            font-size: 14px;
            padding-left: 12px;
            border-left: 2px solid #7033ff;
            margin: 6px 0;
          }
          .alert-box {
            background: linear-gradient(135deg, #7033ff 0%, #8c5cff 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 1rem;
            margin: 24px 0;
            border-left: 4px solid #ffffff;
          }
          .alert-box strong {
            display: block;
            font-size: 16px;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .footer {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid #e7e7ee;
            color: #525252;
            font-size: 14px;
          }
          .signature {
            color: #000000;
            font-weight: 600;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-header">
            <h1 class="clinic-name">FertilCare</h1>
          </div>
          
          <div class="header">
            <h2>${title}</h2>
          </div>
          
          <p class="greeting"><strong>${greeting}</strong></p>
          
          <div class="content">
            ${content}
          </div>
          
          ${alertBox ? `
          <div class="alert-box">
            ${alertBox}
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Saludos cordiales,</p>
            <p class="signature">${signature}</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  /**
   * Envía un email de estudios solicitados
   * @param {Object} options - Opciones del email
   * @param {string} options.pacienteNombre - Nombre del paciente
   * @param {string} options.medicoNombre - Nombre del médico
   * @param {Array} options.listaEstudios - Lista de estudios [{tipo: string, estudios: string[]}]
   * @param {string[]} options.toEmails - Emails destinatarios
   * @param {number} options.group - ID del grupo
   * @returns {Promise} Promise con la respuesta de la API
   */
  sendEstudiosEmail: async ({ pacienteNombre, medicoNombre, listaEstudios, toEmails, group }) => {
    // Crear HTML con la lista de estudios
    const listaEstudiosHTML = listaEstudios.map(grupo => `
      <li>
        <strong>${grupo.tipo.charAt(0).toUpperCase() + grupo.tipo.slice(1)}:</strong>
        <ul style="margin-top: 5px;">
          ${grupo.estudios.map(estudio => `<li>${estudio}</li>`).join('')}
        </ul>
      </li>
    `).join('')

    const htmlBody = emailService.generateEmailTemplate({
      title: 'Solicitud de Estudios Médicos',
      greeting: `Estimado/a ${pacienteNombre},`,
      content: `
        <p>El Dr. ${medicoNombre} ha solicitado los siguientes estudios médicos:</p>
        <div class="estudios-list">
          <ul>
            ${listaEstudiosHTML}
          </ul>
        </div>
      `,
      alertBox: `
        <strong>Importante:</strong>
        <p style="margin: 0;">Las órdenes médicas estarán disponibles para descargar desde su perfil en la plataforma.</p>
      `,
      signature: `Dr. ${medicoNombre}`
    })

    return emailService.sendEmail({
      group,
      toEmails,
      subject: `Nuevos Estudios Solicitados - ${pacienteNombre}`,
      htmlBody
    })
  },

  /**
   * Envía un email de cita confirmada
   * @param {Object} options - Opciones del email
   * @param {string} options.pacienteNombre - Nombre del paciente
   * @param {string} options.medicoNombre - Nombre del médico
   * @param {string} options.fecha - Fecha de la cita
   * @param {string} options.hora - Hora de la cita
   * @param {string[]} options.toEmails - Emails destinatarios
   * @param {number} options.group - ID del grupo
   * @returns {Promise} Promise con la respuesta de la API
   */
  sendCitaConfirmadaEmail: async ({ pacienteNombre, medicoNombre, fecha, hora, toEmails, group }) => {
    const htmlBody = emailService.generateEmailTemplate({
      title: 'CONFIRMAR ASISTENCIA',
      greeting: `Estimado/a ${pacienteNombre},`,
      content: `
        <p>Su medico a asignado un monitoreo con la siguiente informacion:</p>
        <div class="estudios-list">
          <ul>
            <li><strong>Médico:</strong> ${medicoNombre}</li>
            <li><strong>Fecha:</strong> ${fecha}</li>
            <li><strong>Hora:</strong> ${hora}</li>
          </ul>
        </div>
      `,
      alertBox: `
        <strong>Recordatorio:</strong>
        <p style="margin: 0;">Por favor acceda al portal para confirmar su asistencia.</p>
      `,
      signature: `Clínica FertilCare`
    })

    return emailService.sendEmail({
      group,
      toEmails,
      subject: `Confirmacion de monitoreo pendiente - ${fecha}`,
      htmlBody
    })
  }
}