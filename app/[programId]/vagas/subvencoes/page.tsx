// =============================================================================
// app/[programId]/vagas/subvencoes/page.tsx
// Tela de Subvenções e Repasses de Manutenção (Passo 30.1).
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
  TrendingUp,
  Download,
  Info,
  Plus,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  Calculator,
  Home,
  Users,
  FileText
} from "lucide-react";

interface TransferItem {
  id: string;
  condo: string;
  condoId: string;
  date: string;
  value: number;
  status: "Pago" | "Em Processamento" | "Agendado";
}

export default function SubvencoesManutencaoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados Financeiros
  const [availableBalance, setAvailableBalance] = useState(2450800);
  const [yearlyTransferred, setYearlyTransferred] = useState(12180450);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lista de Repasses
  const [transfers, setTransfers] = useState<TransferItem[]>([
    {
      id: "tr-1",
      condo: "Conjunto Habitacional Alvorada",
      condoId: "00982-BA",
      date: "24 Out, 2023",
      value: 45200,
      status: "Pago"
    },
    {
      id: "tr-2",
      condo: "Residencial Parque das Flores",
      condoId: "11234-SP",
      date: "28 Out, 2023",
      value: 12800,
      status: "Em Processamento"
    },
    {
      id: "tr-3",
      condo: "Solar da Liberdade II",
      condoId: "88712-RJ",
      date: "05 Nov, 2023",
      value: 22450,
      status: "Agendado"
    },
    {
      id: "tr-4",
      condo: "Edifício Horizonte Azul",
      condoId: "00551-MG",
      date: "12 Nov, 2023",
      value: 18900,
      status: "Pago"
    }
  ]);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCondoName, setNewCondoName] = useState("");
  const [newCondoId, setNewCondoId] = useState("");
  const [newVal, setNewVal] = useState("");
  const [newStatus, setNewStatus] = useState<"Pago" | "Em Processamento" | "Agendado">("Em Processamento");

  // Solicitar Novo Repasse
  const handleRequestTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedValue = parseFloat(newVal);
    if (!newCondoName.trim() || !newCondoId.trim() || isNaN(parsedValue) || parsedValue <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    if (parsedValue > availableBalance) {
      alert("Saldo de subvenção insuficiente para realizar o repasse.");
      return;
    }

    const newTransfer: TransferItem = {
      id: `tr-${Date.now()}`,
      condo: newCondoName,
      condoId: newCondoId,
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      value: parsedValue,
      status: newStatus
    };

    setTransfers(prev => [newTransfer, ...prev]);
    setAvailableBalance(prev => prev - parsedValue);
    setYearlyTransferred(prev => prev + parsedValue);
    setIsModalOpen(false);
    setNewCondoName("");
    setNewCondoId("");
    setNewVal("");

    setToastMessage("Solicitação de repasse enviada ao Tesouro e registrada!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Baixar Relatório Normativo (Fórmula)
  const handleDownloadNormative = () => {
    setToastMessage("Fazendo download da memória de cálculo...");

    const fileContent = `==================================================
SIGAH - MEMÓRIA DE CÁLCULO DE SUBVENÇÕES (PORTARIA 45/2023)
==================================================
Data de Geração: ${new Date().toLocaleDateString("pt-BR")}
Programa Habitacional: ${programId.toUpperCase()}

PARÂMETROS DA FÓRMULA:
  - Base Estrutural (B): R$ 1.200,00 por unidade de elevador
  - Fator Social (FS): 1.25 (multiplicador de vulnerabilidade)
  - Adicional de Antiguidade (AA): +15% (estruturas com +20 anos de instalação)

FÓRMULA NORMADA:
  Valor Repasse = (B * E * FS) + AA

SALDO GERAL:
  - Saldo de Subvenção Disponível: R$ ${availableBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
  - Total Repassado Anual: R$ ${yearlyTransferred.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

REPASSES DETALHADOS NO ARQUIVO:
${transfers.map(t => `- ${t.condo} (${t.condoId}): R$ ${t.value.toLocaleString("pt-BR")} | Status: ${t.status}`).join("\n")}

Housing Authority Governance - Ministério das Cidades
==================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `memoria_calculo_subvencoes_${Date.now()}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setToastMessage(null), 3000);
  };

  // Alternar Status de Item
  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === "Pago" ? "Em Processamento" : current === "Em Processamento" ? "Agendado" : "Pago";
    setTransfers(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    setToastMessage("Status do repasse atualizado com sucesso!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24 md:pb-0 flex flex-col">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho Hero */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 select-none">
              <div>
                <nav className="flex text-[10px] font-black text-on-surface-variant mb-2 gap-2 uppercase tracking-widest">
                  <span>Finanças</span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                  <span className="text-secondary font-black">Subvenções Governamentais</span>
                </nav>
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                  Subvenções de Manutenção
                </h2>
                <p className="text-on-surface-variant text-xs mt-2 max-w-xl leading-relaxed font-semibold">
                  Gerencie a alocação de recursos governamentais destinados à conservação de elevadores e infraestrutura crítica em complexos habitacionais.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-secondary hover:brightness-110 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all border-none cursor-pointer"
              >
                <CreditCard className="w-5 h-5 text-white" />
                Solicitar Novo Repasse
              </button>
            </div>

            {/* Dashboard Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              
              <div className="bg-primary-container text-white p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[180px] shadow-md border border-[#003366]">
                <div className="relative z-10">
                  <span className="text-on-primary-container/80 text-[10px] font-black uppercase tracking-wider">
                    Saldo de Subvenção Disponível
                  </span>
                  <div className="text-4xl font-extrabold mt-2 font-display">
                    R$ {availableBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2 text-on-primary-container text-xs font-semibold">
                  <Info className="w-4 h-4 text-secondary shrink-0" />
                  Atualizado em tempo real pelo Tesouro Estadual
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-outline-variant/15 flex flex-col justify-between min-h-[180px] shadow-sm">
                <div>
                  <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-wider">
                    Total Repassado no Ano
                  </span>
                  <div className="text-4xl font-extrabold mt-2 text-primary font-display">
                    R$ {yearlyTransferred.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                    <span>75% da meta anual atingida</span>
                    <span>Meta: R$ 16M</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Content Area - Asymmetric Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Lista de Transferências */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant/15 shadow-sm p-2">
                  <div className="px-6 py-6 flex items-center justify-between select-none">
                    <h3 className="font-heading text-lg font-black text-primary">Repasses Financeiros Recentes</h3>
                    <button 
                      onClick={() => {
                        setToastMessage("Carregando histórico financeiro completo...");
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-1.5 hover:underline border-none bg-transparent cursor-pointer"
                    >
                      Ver tudo
                      <ArrowRight className="w-4 h-4 text-secondary" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 select-none">
                          <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Condomínio</th>
                          <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Data</th>
                          <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-wider text-right">Valor</th>
                          <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {transfers.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="font-bold text-primary text-sm">{item.condo}</div>
                              <div className="text-[10px] text-on-surface-variant font-bold select-none">ID: {item.condoId}</div>
                            </td>
                            <td className="px-6 py-5 text-on-surface-variant text-xs font-semibold select-none">{item.date}</td>
                            <td className="px-6 py-5 text-right font-mono font-bold text-primary text-sm">
                              R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center select-none">
                                <button 
                                  onClick={() => handleToggleStatus(item.id, item.status)}
                                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border-none cursor-pointer transition-all active:scale-95 ${
                                    item.status === "Pago" 
                                      ? "bg-secondary-fixed text-on-secondary-fixed-variant" 
                                      : item.status === "Em Processamento"
                                      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {item.status}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Memória de Cálculo Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-white p-6 rounded-3xl border border-outline-variant/15 shadow-sm flex flex-col gap-6 sticky top-24">
                  
                  <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4 select-none">
                    <Calculator className="w-5 h-5 text-secondary shrink-0" />
                    <h3 className="font-heading text-base font-black text-primary">Memória de Cálculo</h3>
                  </div>

                  <div className="space-y-4 select-none">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-primary text-xs">Base Estrutural</div>
                        <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Valor fixo por unidade de elevador</p>
                      </div>
                      <span className="font-mono text-primary font-bold text-xs">R$ 1.200,00</span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-primary text-xs">Fator Social</div>
                        <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Multiplicador por renda per capita</p>
                      </div>
                      <span className="font-mono text-secondary font-bold text-xs">x 1.25</span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-primary text-xs">Adicional de Antiguidade</div>
                        <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Estruturas com +20 anos</p>
                      </div>
                      <span className="font-mono text-tertiary font-bold text-xs">+ 15%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-primary space-y-2 select-none">
                    <div className="text-[9px] uppercase font-black text-on-surface-variant tracking-wider">
                      Fórmula Aplicada
                    </div>
                    <code className="text-[10px] text-primary font-mono bg-white px-2 py-1 rounded block border border-slate-200">
                      Valor = (B * E * FS) + AA
                    </code>
                    <p className="text-[9px] text-on-surface-variant italic leading-relaxed">
                      Referência: Portaria Normativa nº 45/2023 - Secretaria de Habitação.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/10 select-none">
                    <button 
                      onClick={handleDownloadNormative}
                      className="flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group border-none bg-transparent"
                    >
                      <Download className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-black uppercase tracking-wider">Baixar Relatório Normativo</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

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
          href={`/${programId}/vagas/subvencoes`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <CreditCard className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Repasses</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Vagas</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: SOLICITAR NOVO REPASSE
          ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Solicitar Repasse de Manutenção</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRequestTransfer} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Nome do Condomínio / Conjunto
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Residencial Flores, Solar da Serra..."
                  value={newCondoName}
                  onChange={(e) => setNewCondoName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Código Identificador (ID)
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  placeholder="Ex: 11029-DF, 44215-SP..."
                  value={newCondoId}
                  onChange={(e) => setNewCondoId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Valor Solicitado (BRL)
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-mono font-bold" 
                  placeholder="Ex: 15000.00" 
                  type="number"
                  step="0.01"
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Status de Processamento
                </label>
                <select 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                >
                  <option value="Pago">Pago</option>
                  <option value="Em Processamento">Em Processamento</option>
                  <option value="Agendado">Agendado</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#001e40] text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  CONFIRMAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
