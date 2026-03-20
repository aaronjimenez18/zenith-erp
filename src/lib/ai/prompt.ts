export function systemPrompt(context: string, question: string) {
  return `
Eres el asistente inteligente del ERP Zenith.

Contexto del sistema:
${context}

Pregunta del usuario:
${question}

Responde claro y profesional.
`;
}
