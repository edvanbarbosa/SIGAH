// =============================================================================
// app/[programId]/unidades/adaptacoes/page.tsx
// Gerenciamento de Adaptações - Otimizado (Passo 25.1).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import {
  ChevronRight,
  AlertTriangle,
  Mail,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Check,
  Building2,
  Clock,
  Home,
  Users
} from "lucide-react";

interface AdaptationItem {
  id: string;
  unit: string;
  residencial: string;
  constructor: string;
  status: "execucao" | "aguardando" | "concluida";
  deadline: string;
  travaDays: number;
}

export default function GerenciamentoAdaptacoesPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newResidencial, setNewResidencial] = useState("Residencial Aurora");
  const [newConstructor, setNewConstructor] = useState("Vanguarda Construções");

  // Lista de Adaptações
  const [items, setItems] = useState<AdaptationItem[]>([
    {
      id: "ad-1",
      unit: "Apto 402 - Bloco B",
      residencial: "Residencial Aurora",
      constructor: "Vanguarda Construções",
      status: "execucao",
      deadline: "15/10/2026",
      travaDays: 12
    },
    {
      id: "ad-2",
      unit: "Casa 12 - Quadra H",
      residencial: "Loteamento Sol Nascente",
      constructor: "Global Engenharia Ltda",
      status: "aguardando",
      deadline: "02/11/2026",
      travaDays: 30
    },
    {
      id: "ad-3",
      unit: "Apto 101 - Bloco C",
      residencial: "Park Avenue Residence",
      constructor: "Vanguarda Construções",
      status: "concluida",
      deadline: "25/11/2026",
      travaDays: 53
    }
  ]);

  // Exportar Relatório Agente Financeiro (Relatório TXT para simular o mockup)
  const handleExportRelatorio = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToastMessage("Relatório consolidado exportado com sucesso!");

      const content = `==================================================
SIGAH - RELATÓRIO CONSOLIDADO DE ADAPTAÇÕES PCD
==================================================
Programa Habitacional: ${programId.toUpperCase()}
Status de Auditoria: Ativa
Total de Solicitações: ${items.length}

ITENS DE VINCULAÇÃO:
${items.map(i => `- Unidade: ${i.unit} (${i.residencial})\n  Construtora: ${i.constructor}\n  Status: ${i.status.toUpperCase()}\n  Prazo: ${i.deadline}`).join("\n\n")}

Gerado em: ${new Date().toLocaleString("pt-BR")}
==================================================`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio_adaptacoes_${programId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  // Disparar Notificação à Construtora
  const handleNotifyConstructor = () => {
    setToastMessage("Notificação de alerta enviada com sucesso para as construtoras parceiras!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Adicionar Nova Solicitação Manual
  const handleAddAdaptation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName) return;

    const newItem: AdaptationItem = {
      id: `ad-${Date.now()}`,
      unit: newUnitName,
      residencial: newResidencial,
      constructor: newConstructor,
      status: "aguardando",
      deadline: "20/12/2026",
      travaDays: 78
    };

    setItems(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setNewUnitName("");
    setToastMessage(`Adaptação para ${newUnitName} cadastrada no lote com sucesso!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Alterar status de item
  const handleUpdateStatus = (id: string, newStatus: AdaptationItem["status"]) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
    setActiveMenuId(null);
    setToastMessage("Status da adaptação atualizado!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtrar itens
  const filteredItems = items.filter(item => 
    item.unit.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.constructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.residencial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-surface text-primary min-h-screen pb-24 md:pb-0 flex flex-col font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Alerta de Prazo Crítico (Bento Laranja) */}
            <section className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl flex items-start gap-4 shadow-sm select-none">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-orange-600 w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-sm text-[#7a5a00] uppercase tracking-wider">
                  Alerta de Prazo Crítico
                </h3>
                <p className="text-[#7a5a00] text-xs leading-relaxed font-semibold">
                  Existem <strong>12 unidades</strong> no Residencial Horizonte com entrega prevista para os próximos 30 dias que ainda não possuem o status de "Adaptação Concluída". Ações imediatas são necessárias para evitar multas contratuais.
                </p>
              </div>
            </section>

            {/* Seção Grid Bento: Ações em Lote e Trava de Prazos */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Card Central de Comunicação (8 cols) */}
              <div className="md:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-[#0059bb] uppercase">
                      Ações em Lote
                    </span>
                    <h3 className="text-xl font-black text-[#001e40] mt-1">
                      Central de Comunicação com Parceiros
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed max-w-md font-semibold">
                      Exporte dados consolidados para o Agente Financeiro ou dispare notificações técnicas para as construtoras responsáveis.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 select-none">
                    <button 
                      onClick={handleExportRelatorio}
                      disabled={isExporting}
                      className="px-5 py-3.5 bg-[#001e40] text-white font-black text-[10px] rounded-xl uppercase tracking-wider flex items-center gap-2 hover:bg-[#003366] transition-all shadow-md border-none cursor-pointer"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4.5 h-4.5 text-white" />
                      )}
                      Gerar Relatório Agente Financeiro
                    </button>
                    <button 
                      onClick={handleNotifyConstructor}
                      className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-primary font-black text-[10px] rounded-xl uppercase tracking-wider flex items-center gap-2 border-none cursor-pointer transition-all"
                    >
                      <Mail className="w-4.5 h-4.5 text-slate-600" />
                      Notificar Construtora
                    </button>
                  </div>
                </div>

                <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-slate-50 rounded-full blur-3xl group-hover:bg-indigo-50/50 transition-colors duration-500"></div>
              </div>

              {/* Card Prazos Encerrando (4 cols) */}
              <div className="md:col-span-4 bg-primary text-white p-8 rounded-2xl flex flex-col justify-center items-center text-center space-y-4 shadow-md relative overflow-hidden select-none">
                <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center shrink-0 animate-pulse">
                  <span className="font-heading text-xl font-black text-white">22</span>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider">Prazos Encerrando</h4>
                  <p className="text-[10px] text-slate-300 font-semibold mt-1">Adaptações com trava em &lt; 15 dias</p>
                </div>
                <button 
                  onClick={() => {
                    setSearchTerm("Vanguarda");
                    setToastMessage("Exibindo adaptações críticas sob responsabilidade da Vanguarda Construções...");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-[10px] font-black text-[#0070ea] uppercase tracking-wider border-none bg-transparent hover:underline cursor-pointer"
                >
                  Ver Detalhes
                </button>
              </div>

            </div>

            {/* Tabela de Gerenciamento de Adaptações */}
            <section className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-1 shadow-sm">
              
              <div className="px-6 py-6 bg-white rounded-t-xl flex flex-wrap justify-between items-center gap-4 select-none border-b border-slate-100">
                <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wide">
                  Gerenciamento de Adaptações
                </h3>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full w-full md:w-auto">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-xs text-primary focus:outline-none focus:ring-0 outline-none w-full md:w-60 font-semibold" 
                    placeholder="Filtrar por unidade ou construtora..."
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="border-none bg-transparent cursor-pointer">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-100 border-b border-slate-200/50 select-none">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-455">Unidade / Empreendimento</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-455">Construtora</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-455">Status de Adaptação</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-455">Prazo de Entrega</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-455 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 bg-white">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="text-xs font-black text-primary">{item.unit}</p>
                          <p className="text-[10px] text-slate-450 font-bold mt-0.5 select-none">{item.residencial}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs text-slate-700 font-bold">{item.constructor}</span>
                        </td>
                        <td className="px-6 py-5 select-none">
                          {item.status === "execucao" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0059bb] text-[10px] font-black border border-blue-200 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0059bb]"></span>
                              Em Execução
                            </span>
                          )}
                          {item.status === "aguardando" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-250 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              Aguardando Início
                            </span>
                          )}
                          {item.status === "concluida" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-250 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Concluída
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <p className={`text-xs font-black ${item.travaDays <= 15 ? "text-red-600" : "text-slate-700"}`}>
                            {item.deadline}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5 select-none">
                            Trava: {item.travaDays} dias
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right relative">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className="p-2 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer text-slate-450"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Menu de Ações Flutuante */}
                          {activeMenuId === item.id && (
                            <div className="absolute right-6 top-12 z-20 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 text-left select-none animate-fade-in">
                              <button 
                                onClick={() => handleUpdateStatus(item.id, "execucao")}
                                className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-slate-700 hover:bg-slate-50 rounded-lg border-none bg-transparent cursor-pointer"
                              >
                                Iniciar Execução
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, "concluida")}
                                className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-slate-700 hover:bg-slate-50 rounded-lg border-none bg-transparent cursor-pointer"
                              >
                                Marcar Concluída
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, "aguardando")}
                                className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-slate-700 hover:bg-slate-50 rounded-lg border-none bg-transparent cursor-pointer"
                              >
                                Aguardar Início
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredItems.length === 0 && (
                      <tr className="select-none">
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                          Nenhuma solicitação encontrada para o termo pesquisado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="px-6 py-4 bg-slate-50 rounded-b-xl flex justify-between items-center border-t border-slate-100 select-none">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  Exibindo {filteredItems.length} de {items.length} Solicitações
                </span>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </section>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          FAB (Floating Action Button)
          ========================================== */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed right-6 bottom-6 md:bottom-10 bg-secondary hover:bg-secondary-container shadow-xl text-white w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-30 border-none cursor-pointer"
        title="Nova Solicitação de Adaptação"
      >
        <Plus className="w-6 h-6 text-white shrink-0" />
      </button>

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/95 dark:bg-[#001e40]/95 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Home className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/unidades`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Building className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Unidades</span>
        </a>
        <a 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Famílias</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: ADICIONAR SOLICITAÇÃO MANUAL
          ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Cadastrar Adaptação</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAdaptation} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Unidade / Identificação</label>
                <input 
                  type="text"
                  required
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="Ex: Apto 203 - Bloco E"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-primary font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Empreendimento</label>
                <select 
                  value={newResidencial}
                  onChange={(e) => setNewResidencial(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-primary font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                >
                  <option value="Residencial Aurora">Residencial Aurora</option>
                  <option value="Loteamento Sol Nascente">Loteamento Sol Nascente</option>
                  <option value="Park Avenue Residence">Park Avenue Residence</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Construtora Responsável</label>
                <select 
                  value={newConstructor}
                  onChange={(e) => setNewConstructor(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-primary font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                >
                  <option value="Vanguarda Construções">Vanguarda Construções</option>
                  <option value="Global Engenharia Ltda">Global Engenharia Ltda</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setShowAddModal(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#001e40] text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  CADASTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
