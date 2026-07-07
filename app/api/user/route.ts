// =============================================================================
// app/api/user/route.ts
// Rota de API mockada para gerenciar as informações do operador logado (Passo 10.3).
// Mantém as informações em memória no processo Node do servidor para simulação de GET/PUT.
// =============================================================================

import { NextResponse } from "next/server";

// Mock do usuário/operador padrão em memória do servidor
let mockUser = {
  id: "usr_ana_silva",
  name: "ANA SILVA",
  email: "ana.silva@sigah.gov.br",
  profile: "assistente_social",
  role: "Assistente Social",
  region: "Região Leste",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtPmbamYvNE6arXUN6VUCVWXZHn4IqHQ2GzgNaq1RVlF6MpedF8FMk4SSOA_a7nWrNk2iwWYvRWNA3eiEzNdT_Yc37uU0XaD9CIl8iFY1SvjbcQdKl99Stqbetq3GKo6A-mD50-PQjzTVdZm0uuQgvPtYFyEvN3oMgGlSkHdNImmlOwp-D4b8-6LKmvYL46cR0ucwCmIlbXmu1Jqk69GvBSpsNhIf-gpj-lWQo06koV8XZohaCisQ0965yTyiAbAhIjB4NGB5E8sk",
  phone: "(81) 98888-7777",
  address: "Av. Governador Agamenon Magalhães, 123 - Recife/PE"
};

/**
 * Retorna os dados cadastrais do operador logado.
 */
export async function GET() {
  return NextResponse.json(mockUser);
}

/**
 * Atualiza os dados cadastrais do operador logado (Nome e E-mail).
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validação básica de presença
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Nome e E-mail são campos obrigatórios." },
        { status: 400 }
      );
    }
    
    // Simula a validação de formato de e-mail básico no backend
    if (!body.email.includes("@") || !body.email.includes(".")) {
      return NextResponse.json(
        { error: "Formato de e-mail inválido." },
        { status: 400 }
      );
    }
    
    // Atualização em memória
    mockUser = {
      ...mockUser,
      name: body.name.trim().toUpperCase(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone !== undefined ? body.phone.trim() : mockUser.phone,
      address: body.address !== undefined ? body.address.trim() : mockUser.address,
    };
    
    return NextResponse.json({
      success: true,
      user: mockUser
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar a atualização." },
      { status: 500 }
    );
  }
}
