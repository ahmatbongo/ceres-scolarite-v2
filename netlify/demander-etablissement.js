const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  // Autoriser seulement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Valider les données requises
    const requiredFields = [
      'nom_etablissement',
      'ville',
      'province',
      'nom_directeur',
      'telephone',
      'email',
      'formule_souhaitee',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `${field} est requis` }),
        };
      }
    }

    // Formater le message pour l'email
    const emailContent = `
Nouvelle demande d'établissement scolaire reçue:

Nom de l'établissement: ${data.nom_etablissement}
Ville: ${data.ville}
Province: ${data.province}
Nom du directeur: ${data.nom_directeur}
Téléphone: ${data.telephone}
E-mail: ${data.email}
Formule souhaitée: ${data.formule_souhaitee}
Message: ${data.message || 'Aucun message supplémentaire'}

Date: ${new Date().toLocaleString('fr-FR')}
    `;

    // Envoyer l'email via Resend
    const emailResponse = await resend.emails.send({
      from: 'noreply@ceres-scolarite.com',
      to: 'ceres151266@gmail.com',
      subject: `Nouvelle demande d'établissement: ${data.nom_etablissement}`,
      text: emailContent,
    });

    if (emailResponse.error) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailResponse.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }),
      };
    }

    // Stocker dans Supabase
    const { data: insertedData, error: supabaseError } = await supabase
      .from('demandes_etablissements')
      .insert([
        {
          nom_etablissement: data.nom_etablissement,
          ville: data.ville,
          province: data.province,
          nom_directeur: data.nom_directeur,
          telephone: data.telephone,
          email: data.email,
          formule_souhaitee: data.formule_souhaitee,
          message: data.message || null,
          date_soumission: new Date().toISOString(),
          email_envoye: true,
        },
      ]);

    if (supabaseError) {
      console.error('Erreur Supabase:', supabaseError);
      // L'email a été envoyé, mais pas la sauvegarde BD
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Email envoyé avec succès, mais la sauvegarde en base de données a échoué',
          email_id: emailResponse.id,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Demande traitée avec succès',
        email_id: emailResponse.id,
        database_id: insertedData[0]?.id,
      }),
    };
  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur interne' }),
    };
  }
};
