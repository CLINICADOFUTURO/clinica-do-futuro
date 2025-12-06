import { N8NAnamnesisPayload, N8NMessagePayload } from "../types";

// CONFIGURAÇÃO: Coloque aqui os URLs dos seus Webhooks do n8n
// Se estiver rodando n8n localmente (tunnel), use o URL público
const N8N_CONFIG = {
  WEBHOOK_ANAMNESIS: 'https://seu-n8n.com/webhook/anamnese',
  WEBHOOK_WHATSAPP: 'https://seu-n8n.com/webhook/whatsapp-send',
  WEBHOOK_FINANCE: 'https://seu-n8n.com/webhook/financeiro',
};

/**
 * Envia os dados brutos da consulta para o n8n processar com IA e salvar no banco
 */
export const processAnamnesisWithN8N = async (payload: N8NAnamnesisPayload): Promise<boolean> => {
  console.log("🚀 Enviando para n8n [Anamnese]:", payload);
  
  try {
    // Descomente a linha abaixo quando tiver o URL real do n8n
    // const response = await fetch(N8N_CONFIG.WEBHOOK_ANAMNESIS, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // return response.ok;

    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true; 
  } catch (error) {
    console.error("Erro ao conectar com n8n:", error);
    return false;
  }
};

/**
 * Aciona o n8n para enviar mensagem no WhatsApp (via Twilio, Waha, ou API Oficial)
 */
export const triggerWhatsappAutomation = async (payload: N8NMessagePayload): Promise<boolean> => {
  console.log("🚀 Disparando Automação WhatsApp via n8n:", payload);

  try {
    // const response = await fetch(N8N_CONFIG.WEBHOOK_WHATSAPP, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // return response.ok;

    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error("Erro ao conectar com n8n:", error);
    return false;
  }
};

/**
 * Helper para abrir o WhatsApp Web direto no navegador (sem n8n)
 */
export const openDirectWhatsapp = (phone: string, text: string) => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
};