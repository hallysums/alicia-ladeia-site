/* =========================================================================
   CONFIGURAÇÃO DO SITE — Dra. Alicia Ladeia
   -------------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para ativar contatos,
   mapa, horários, análise de acessos, casos e depoimentos.
   Campos vazios ("") ficam ocultos ou usam um destino alternativo seguro.
   ========================================================================= */
window.SITE_CONFIG = {

  /* ---------- Contato ---------- */
  // WhatsApp oficial: apenas números, com DDI 55 + DDD. Ex.: "5511999999999"
  // Enquanto estiver vazio, os botões de agendamento abrem o Instagram (Direct).
  whatsapp: "",
  whatsappMessage: "Olá, Dra. Alicia! Vim pelo site e gostaria de agendar uma avaliação.",
  instagram: "draalicialadeia",

  /* ---------- Localização ---------- */
  // Endereço completo do consultório. Ex.: "Rua Exemplo, 123 - Sala 45 - Tatuapé, São Paulo - SP, 03000-000"
  address: "",
  // Usado no mapa e na rota enquanto o endereço não for informado:
  mapQueryFallback: "Tatuapé, São Paulo - SP",
  // Horários de atendimento. Ex.: [["Segunda a sexta", "9h às 19h"], ["Sábado", "9h às 13h"]]
  hours: [],

  /* ---------- Análise de acessos (carregam somente após consentimento) ---------- */
  googleAnalyticsId: "",   // Ex.: "G-XXXXXXXXXX"
  metaPixelId: "",         // Ex.: "123456789012345"

  /* ---------- Antes e depois ----------
     Use SOMENTE fotos reais, com autorização por escrito do(a) paciente
     (TCLE), conforme as normas do Conselho Federal de Odontologia.
     Salve as imagens em assets/img/casos/ (mesmo enquadramento e proporção 4:5).
     Exemplo:
     { title: "Caso 01", note: "Lentes de resina — 10 elementos",
       before: "assets/img/casos/caso01-antes.webp",
       after:  "assets/img/casos/caso01-depois.webp" }
  */
  cases: [],

  /* ---------- Depoimentos ----------
     Somente depoimentos reais e autorizados.
     { text: "...", name: "Nome ou iniciais autorizadas", detail: "Paciente", photo: "" }
  */
  testimonials: []
};
