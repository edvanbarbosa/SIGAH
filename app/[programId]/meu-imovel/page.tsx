// =============================================================================
// app/[programId]/meu-imovel/page.tsx
// Gestão de Inalienabilidade, Sucessão e Sinistros (Passo 30.1).
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
  Lock,
  Info,
  Calculate,
  FileText,
  Download,
  Users,
  ShieldAlert,
  ArrowRight,
  X,
  CheckCircle2,
  Loader2,
  Calendar,
  AlertTriangle,
  Award,
  BookOpen,
  Home
} from "lucide-react";

export default function MeuImovelInalienabilidadePage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados Financeiros e Prazos
  const [monthsElapsed, setMonthsElapsed] = useState(24);
  const totalMonths = 60;
  const originalSubsidy = 45000;
  const bonusDiscount = (monthsElapsed / totalMonths) * originalSubsidy; // 40% -> R$ 18.000,00
  const quitacaoAmount = originalSubsidy - bonusDiscount;

  // Estados da UI
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBoletoGenerating, setIsBoletoGenerating] = useState(false);
  const [showNormativeModal, setShowNormativeModal] = useState(false);

  // Estados dos Protocolos
  const [isSinistroModalOpen, setIsSinistroModalOpen] = useState(false);
  const [sinistroType, setSinistroType] = useState("Óbito do Titular");
  const [sinistroNotes, setSinistroNotes] = useState("");
  const [sinistroProt, setSinistroProt] = useState<string | null>(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"obito" | "divorcio">("obito");
  const [successorName, setSuccessorName] = useState("");
  const [successorCPF, setSuccessorCPF] = useState("");
  const [transferProt, setTransferProt] = useState<string | null>(null);

  // Solicitar Boleto de Quitação
  const handleRequestBoleto = () => {
    setIsBoletoGenerating(true);
    setTimeout(() => {
      setIsBoletoGenerating(false);
      setToastMessage("Boleto para quitação antecipada (R$ 27.000,00) gerado e enviado para o seu e-mail!");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  // Enviar Protocolo de Sinistro
  const handleSendSinistro = (e: React.FormEvent) => {
    e.preventDefault();
    const protNum = `SIN-2023-${Math.floor(1000 + Math.random() * 9000)}`;
    setSinistroProt(protNum);
    setIsSinistroModalOpen(false);
    setSinistroNotes("");

    setToastMessage(`Protocolo de sinistro ${protNum} registrado em análise técnica!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Enviar Protocolo de Transferência (Sucessão)
  const handleSendTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!successorName.trim() || !successorCPF.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const protNum = `SUC-2023-${Math.floor(1000 + Math.random() * 9000)}`;
    setTransferProt(protNum);
    setIsTransferModalOpen(false);
    setSuccessorName("");
    setSuccessorCPF("");

    setToastMessage(`Protocolo de transferência ${protNum} iniciado para análise jurídica!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="bg-surface text-primary min-h-screen pb-24 md:pb-0 flex flex-col font-sans">
      
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
              <div className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <header className="space-y-2 select-none">
              <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] font-black uppercase tracking-widest">
                <span>Imóveis</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-secondary font-black">Gestão de Inalienabilidade</span>
              </nav>
              <h1 className="text-3xl font-extrabold text-[#001e40] tracking-tight">
                Residencial Ipê Amarelo - Apto 402
              </h1>
              <p className="text-slate-500 text-sm font-semibold">
                Contrato: #RF-2023-00912 • Brasília - DF
              </p>
            </header>

            {/* Grid Bento Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Card 1: Status de Propriedade (RF061) */}
              <section className="lg:col-span-7 bg-white rounded-2xl p-8 flex flex-col justify-between border border-outline-variant/15 shadow-sm relative overflow-hidden select-none min-h-[220px]">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Status de Propriedade (RF061)
                    </h3>
                    <p className="text-xl font-bold text-[#001e40]">Período de Inalienabilidade</p>
                  </div>
                  <span className="bg-[#001e40]/10 text-[#001e40] px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-slate-200">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    IMÓVEL BLOQUEADO
                  </span>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-slate-400">
                      Meses decorridos: <strong className="text-secondary">{monthsElapsed}</strong> de {totalMonths}
                    </span>
                    <span className="text-2xl font-black text-secondary">
                      {Math.round((monthsElapsed / totalMonths) * 100)}%
                    </span>
                  </div>

                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0059bb] rounded-full transition-all duration-500" 
                      style={{ width: `${(monthsElapsed / totalMonths) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Início: Jan 2022</span>
                    <span>Previsão de Desbloqueio: Jan 2027</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </section>

              {/* Card 2: Regra de Inalienabilidade (Alerta) */}
              <section className="lg:col-span-5 bg-gradient-to-br from-[#003366] to-[#001e40] text-white rounded-2xl p-8 flex flex-col justify-between border border-[#001e40] shadow-md relative overflow-hidden select-none min-h-[220px]">
                <div className="absolute top-4 right-4 opacity-5">
                  <Award className="w-48 h-48" />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black font-headline tracking-tight">Regra de Inalienabilidade</h3>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed font-semibold my-4">
                  Conforme o regulamento institucional (RF061), este imóvel possui restrição de venda, aluguel ou cessão de direitos pelo período de 60 meses. O descumprimento pode acarretar a perda do subsídio e rescisão contratual imediata.
                </p>

                <div>
                  <button 
                    onClick={() => setShowNormativeModal(true)}
                    className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 cursor-pointer"
                  >
                    Ler Normativa Completa
                  </button>
                </div>
              </section>

              {/* Card 3: Calculadora de Quitação (RF079) */}
              <section className="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
                <div className="flex items-center gap-3 select-none">
                  <Info className="w-5 h-5 text-secondary shrink-0" />
                  <h3 className="text-lg font-black text-[#001e40]">Quitação Antecipada (RF079)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200/60 select-none">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Subsídio Original
                      </label>
                      <span className="text-xl font-black text-[#001e40]">
                        R$ {originalSubsidy.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200/60 select-none">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Bônus Permanência ({monthsElapsed} meses)
                      </label>
                      <span className="text-xl font-black text-emerald-600">
                        - R$ {bonusDiscount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">
                        40% de desconto proporcional aplicado
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#001e40] p-6 rounded-xl text-white flex flex-col justify-between shadow-md">
                    <div className="select-none">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 block">
                        Valor para Quitação Hoje
                      </label>
                      <div className="text-3xl font-black">
                        R$ {quitacaoAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleRequestBoleto}
                      disabled={isBoletoGenerating}
                      className="w-full mt-6 bg-[#0059bb] hover:bg-secondary text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                      {isBoletoGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Gerando Boleto...</span>
                        </>
                      ) : (
                        <>
                          <span>Solicitar Boleto</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* Card 4: Termo de Quitação (Documento Suspenso) */}
              <section className="lg:col-span-5 bg-white p-8 rounded-2xl border border-outline-variant/15 shadow-sm flex flex-col justify-between min-h-[300px]">
                <div className="flex items-center gap-3 select-none">
                  <FileText className="w-5 h-5 text-secondary shrink-0" />
                  <h3 className="text-lg font-black text-[#001e40]">Documentação e Quitação</h3>
                </div>

                <div className="flex-grow flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl my-4 select-none">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Download className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-black text-[#001e40] mb-1">Termo de Quitação (RF072)</p>
                  <p className="text-[10px] text-slate-400 font-semibold max-w-[200px] leading-relaxed">
                    Indisponível. O documento será liberado após os 60 meses de bloqueio ou quitação total do saldo.
                  </p>
                </div>

                <button 
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border-none"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  Baixar Termo de Quitação
                </button>
              </section>

              {/* Card 5: Sucessão e Sinistros (RF071/081) */}
              <section className="lg:col-span-12 bg-slate-50 p-8 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
                <div className="flex items-center gap-3 select-none">
                  <Users className="w-5 h-5 text-[#001e40] shrink-0" />
                  <h3 className="text-lg font-black text-[#001e40]">Sucessão e Sinistros (RF071/081)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Transferência de Titularidade */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 text-primary select-none">
                      <Users className="w-5 h-5 text-[#0059bb] shrink-0" />
                      <h4 className="font-extrabold text-sm text-[#001e40]">Transferência de Titularidade</h4>
                    </div>

                    <div className="space-y-3">
                      <div 
                        onClick={() => {
                          setTransferType("obito");
                          setIsTransferModalOpen(true);
                        }}
                        className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Users className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-[#001e40]">Sucessão por Óbito</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                            Transferência legal de titularidade do imóvel para herdeiros legítimos diretos.
                          </p>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          setTransferType("divorcio");
                          setIsTransferModalOpen(true);
                        }}
                        className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Users className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-[#001e40]">Prioridade da Mulher (Divórcio)</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                            Transferência da posse definitiva do imóvel em conformidade legal pós-separação.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acionamento de Seguro */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-primary select-none">
                        <ShieldAlert className="w-5 h-5 text-[#0059bb] shrink-0" />
                        <h4 className="font-extrabold text-sm text-[#001e40]">Acionamento de Seguro (MIP)</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Solicite a cobertura securitária obrigatória por Morte ou Invalidez Permanente (MIP) para amortização ou quitação do saldo do imóvel.
                      </p>
                    </div>

                    <button 
                      onClick={() => setIsSinistroModalOpen(true)}
                      className="w-full bg-[#001e40] hover:bg-primary-container text-white py-3.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-none cursor-pointer mt-6"
                    >
                      <span>Iniciar Protocolo de Sinistro</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>

                </div>
              </section>

              {/* Card 6: Histórico de Movimentação */}
              <section className="lg:col-span-12 bg-white rounded-2xl p-8 border border-outline-variant/15 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  Histórico de Movimentação do Imóvel
                </h3>
                
                <div className="divide-y divide-slate-100">
                  <div className="flex items-center py-4 bg-slate-50 px-4 rounded-t-lg select-none">
                    <div className="w-2 h-2 rounded-full bg-secondary mr-6"></div>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-[#001e40]">Atualização do Valor de Quitação</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Correção mensal do índice TR efetuada.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400">HOJE, 09:42</p>
                    </div>
                  </div>

                  <div className="flex items-center py-4 bg-white px-4 select-none">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mr-6"></div>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-[#001e40]">Vistoria Semestral Realizada</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Conformidade com uso residencial confirmada.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400">12 JUN 2023</p>
                    </div>
                  </div>

                  <div className="flex items-center py-4 bg-slate-50 px-4 rounded-b-lg select-none">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mr-6"></div>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-[#001e40]">Contrato Registrado</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Registro inicial de inalienabilidade no cartório de registro de imóveis.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400">15 JAN 2022</p>
                    </div>
                  </div>
                </div>
              </section>

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
          href={`/${programId}/meu-imovel`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Lock className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Imóvel</span>
        </a>
        <a 
          href={`/${programId}/minha-classificacao`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Ranking</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: NORMATIVA COMPLETA DE INALIENABILIDADE
          ========================================== */}
      {showNormativeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowNormativeModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Portaria Normativa nº 45/2023</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowNormativeModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
              <p className="text-xs text-[#001e40] leading-relaxed font-semibold">
                <strong>Art. 1º.</strong> Os imóveis habitacionais subsidiados pelos cofres públicos serão gravados com cláusulas restritivas de inalienabilidade pelo prazo improrrogável de 60 (sessenta) meses, contados a partir da data de assinatura do contrato de compra e venda.
              </p>
              <p className="text-xs text-[#001e40] leading-relaxed font-semibold">
                <strong>Art. 2º.</strong> Fica vedada qualquer modalidade de cessão física, permuta, locação ou venda informal no período de vigência da inalienabilidade, sob pena de perda total dos subsídios estaduais acumulados.
              </p>
              <p className="text-xs text-[#001e40] leading-relaxed font-semibold">
                <strong>Art. 3º.</strong> A quitação proporcional antecipada poderá ser requerida a partir do 24º mês, mediante devolução do subsídio remanescente calculado com base na taxa referencial do período.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-150 flex justify-end select-none">
              <button 
                onClick={() => setShowNormativeModal(false)}
                className="py-3 px-8 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
              >
                Ciente da Regra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REGISTRAR PROTOCOLO DE SINISTRO
          ========================================== */}
      {isSinistroModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSinistroModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Acionar Protocolo de Sinistro</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsSinistroModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendSinistro} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Tipo de Sinistro Securitário
                </label>
                <select 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  value={sinistroType}
                  onChange={(e) => setSinistroType(e.target.value)}
                >
                  <option value="Óbito do Titular">Óbito do Titular</option>
                  <option value="Invalidez Permanente (MIP)">Invalidez Permanente (MIP)</option>
                  <option value="Danos Físicos por Força Maior">Danos Físicos por Força Maior</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Descrição e Laudo Inicial
                </label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="Descreva detalhes como datas, certidão de óbito ou laudo do INSS..."
                  value={sinistroNotes}
                  onChange={(e) => setSinistroNotes(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsSinistroModalOpen(false)}
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

      {/* ==========================================
          MODAL: PROTOCOLO DE TRANSFERÊNCIA DE TITULARIDADE
          ========================================== */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setIsTransferModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">
                {transferType === "obito" ? "Sucessão por Óbito" : "Prioridade da Mulher"}
              </h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsTransferModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendTransfer} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Nome Completo do Novo Titular
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="Nome do sucessor ou beneficiária..."
                  value={successorName}
                  onChange={(e) => setSuccessorName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  CPF do Novo Titular
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="000.000.000-00"
                  value={successorCPF}
                  onChange={(e) => setSuccessorCPF(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsTransferModalOpen(false)}
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
