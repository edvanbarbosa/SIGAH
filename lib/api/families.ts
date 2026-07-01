// =============================================================================
// lib/api/families.ts
// Serviços de comunicação para gerenciamento do cadastro familiar (CRUD)
// e verificação do status de integração com o Cadastro Único (CadÚnico).
// =============================================================================

import { apiClient } from "./client";
import { FamilyRegistration, IntegracaoCadUnico } from "@/types/family";
import { PaginatedResponse, PaginationParams } from "@/types/api";

/**
 * Busca a listagem paginada, filtrada e ordenada de cadastros familiares de um programa.
 *
 * @param programId - O ID do programa ao qual os cadastros pertencem.
 * @param params - Parâmetros opcionais de paginação, busca e ordenação.
 */
export async function fetchFamilyRegistrations(
  programId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<FamilyRegistration>> {
  const queryParams = new URLSearchParams();
  if (params) {
    if (params.page !== undefined) queryParams.set("page", params.page.toString());
    if (params.perPage !== undefined) queryParams.set("perPage", params.perPage.toString());
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);
    if (params.search) queryParams.set("search", params.search);
  }

  const queryStr = queryParams.toString();
  const endpoint = `/programs/${programId}/families${queryStr ? `?${queryStr}` : ""}`;

  return apiClient.get<PaginatedResponse<FamilyRegistration>>(endpoint);
}

/**
 * Busca os detalhes completos de um cadastro familiar a partir de seu ID único.
 *
 * @param id - ID do cadastro familiar.
 */
export async function fetchFamilyRegistration(id: string): Promise<FamilyRegistration> {
  return apiClient.get<FamilyRegistration>(`/families/${id}`);
}

/**
 * Cria uma nova inscrição/cadastro familiar associado a um programa específico.
 *
 * @param programId - O ID do programa habitacional de destino.
 * @param data - Objeto contendo os dados parciais do cadastro familiar.
 */
export async function createFamilyRegistration(
  programId: string,
  data: Partial<FamilyRegistration>
): Promise<FamilyRegistration> {
  return apiClient.post<FamilyRegistration>(`/programs/${programId}/families`, data);
}

/**
 * Atualiza os dados de um cadastro familiar existente.
 *
 * @param id - O ID do cadastro familiar a ser modificado.
 * @param data - Dados parciais a serem atualizados no cadastro.
 */
export async function updateFamilyRegistration(
  id: string,
  data: Partial<FamilyRegistration>
): Promise<FamilyRegistration> {
  return apiClient.put<FamilyRegistration>(`/families/${id}`, data);
}

/**
 * Remove permanentemente um cadastro familiar do sistema.
 *
 * @param id - O ID do cadastro familiar.
 */
export async function deleteFamilyRegistration(id: string): Promise<void> {
  return apiClient.delete<void>(`/families/${id}`);
}

/**
 * Consulta e atualiza o status de sincronização e integração com o CadÚnico.
 *
 * @param familyId - O ID do cadastro familiar.
 */
export async function fetchCadUnicoStatus(familyId: string): Promise<IntegracaoCadUnico> {
  return apiClient.get<IntegracaoCadUnico>(`/families/${familyId}/cadunico`);
}
