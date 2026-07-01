// =============================================================================
// lib/formatters/index.ts
// Formatadores de dados do domínio para exibição legível na interface de usuário.
// Suporta formatação de CPF, valores monetários (BRL), datas, telefones e status.
// =============================================================================

import { ProcessStage } from "@/types/api";
import { RegistrationStatus } from "@/types/family";

/**
 * Formata um CPF limpando e adicionando máscara (XXX.XXX.XXX-XX).
 *
 * @param cpf - O CPF a ser formatado.
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return cpf;
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata um valor monetário em centavos para string BRL (R$ 0,00).
 *
 * @param valueInCents - O valor monetário em centavos.
 */
export function formatCurrencyBRL(valueInCents: number): string {
  const valueInReais = valueInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInReais);
}

/**
 * Formata uma data no formato ISO para padrão brasileiro (DD/MM/YYYY).
 *
 * @param dateStr - A string de data ISO 8601.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    // Impede datas inválidas
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Formata um telefone adicionando a máscara brasileira ((XX) XXXXX-XXXX ou (XX) XXXX-XXXX).
 *
 * @param phone - Telefone bruto.
 */
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  
  return phone;
}

/**
 * Converte a etapa processual (ProcessStage) do backend para rótulo legível.
 *
 * @param stage - Etapa do processo.
 */
export function formatProcessStage(stage: ProcessStage): string {
  const stageLabels: Record<ProcessStage, string> = {
    [ProcessStage.INSCRICAO]: "Inscrição",
    [ProcessStage.VALIDACAO_DOCUMENTAL]: "Validação Documental",
    [ProcessStage.INTEGRACAO_EXTERNA]: "Integração Externa",
    [ProcessStage.CLASSIFICACAO]: "Classificação",
    [ProcessStage.APLICACAO_COTAS]: "Aplicação de Cotas",
    [ProcessStage.SORTEIO]: "Sorteio",
    [ProcessStage.SUPLENCIA]: "Lista de Suplência",
    [ProcessStage.CONVOCACAO]: "Convocação",
    [ProcessStage.DESIGNACAO_UNIDADE]: "Designação de Unidade",
    [ProcessStage.POS_OCUPACAO]: "Pós-Ocupação",
    [ProcessStage.FINALIZADO]: "Processo Finalizado",
  };

  return stageLabels[stage] || stage;
}

/**
 * Converte o status do cadastro (RegistrationStatus) para rótulo legível com cores associadas.
 *
 * @param status - Status do cadastro familiar.
 */
export function formatRegistrationStatus(status: RegistrationStatus): string {
  const statusLabels: Record<RegistrationStatus, string> = {
    rascunho: "Rascunho",
    enviado: "Enviado",
    em_analise: "Em Análise",
    pendente_documentos: "Pendente de Documentação",
    aprovado: "Aprovado",
    reprovado: "Reprovado",
    cancelado: "Cancelado",
  };

  return statusLabels[status] || status;
}
