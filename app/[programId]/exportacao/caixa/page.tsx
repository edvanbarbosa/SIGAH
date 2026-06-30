// =============================================================================
// app/[programId]/exportacao/caixa/page.tsx
// Exportar Dados para a Caixa - Versão Final (Etapa 65).
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
  CloudUpload,
  ShieldCheck,
  Lock,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  Eye,
  RefreshCw,
  Network,
  Shield
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface TransmissionRecord {
  id: string;
  date: string;
  responsible: string;
  status: "sucesso" | "erro" | "pendente";
  statusLabel: string;
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function ExportarCaixaPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // ─── Estados de Interação ─────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionDone, setTransmissionDone] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationDone, setValidationDone] = useState(false);

  // ─── Dados de Progresso ───────────────────────────────────────────────
  const [execFisica] = useState(45);
  const [volumeFamilias] = useState(125);
  const [registros, setRegistros] = useState(650);
  const [erros, setErros] = useState(0);

  // ─── Histórico de Transmissões ────────────────────────────────────────
  const [history, setHistory] = useState<TransmissionRecord[]>([
    {
      id: "tx-1",
      date: "20/05/2024",
      responsible: "Gestor Habitação",
      status: "sucesso",
      statusLabel: "Processado/Sucesso"
    },
    {
      id: "tx-2",
      date: "18/05/2024",
      responsible: "Analista SIGAH",
      status: "sucesso",
      statusLabel: "Processado/Sucesso"
    }
  ]);

  // ─── Ações Reativas ───────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationDone(true);
      showToast("Validação de integridade concluída: 650 registros, 0 erros encontrados.");
    }, 2000);
  };

  const handleTransmit = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmissionDone(true);

      const newRecord: TransmissionRecord = {
        id: `tx-new-${Date.now()}`,
        date: new Date().toLocaleDateString("pt-BR"),
        responsible: "Ana Silva",
        status: "sucesso",
        statusLabel: "Processado/Sucesso"
      };
      setHistory(prev => [newRecord, ...prev]);

      showToast("Arquivo transmitido com sucesso para os servidores da CEF. Protocolo gerado.");
    }, 3000);
  };

  const getStatusBadge = (status: TransmissionRecord["status"]) => {
    switch (status) {
      case "sucesso":
        return "bg-[#d8e2ff]/50 text-[#004493]";
      case "erro":
        return "bg-[#ffdad6] text-[#93000a]";
      case "pendente":
        return "bg-[#ffdbca] text-[#723610]";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 md:pb-0 flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-7xl mx-auto px-6 pt-24 pb-32 space-y-8">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="ml-auto text-white/60 hover:text-white cursor-pointer bg-transparent border-none">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push(`/${programId}/dashboard`)}>Início</span>
              <ChevronRight className="w-3 h-3" />
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push(`/${programId}/exportacao`)}>Exportação</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-secondary">Transmissão Caixa</span>
            </nav>

            {/* Título Principal */}
            <header className="space-y-2 select-none">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-tight">
                Exportar Dados para a Caixa
              </h2>
              <p className="text-[#43474f] text-base">
                Módulo de Transmissão Institucional
              </p>
            </header>

            {/* ─── Bento Grid Principal ───────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* ═══════════════════════════════════════════════════════
                  COLUNA ESQUERDA: Status e Validação (8-col)
                  ═══════════════════════════════════════════════════════ */}
              <div className="md:col-span-8 flex flex-col gap-6">

                {/* ── Seção: Execução do Programa ──────────────────── */}
                <section className="bg-white rounded-xl p-6 shadow-[0_16px_32px_-12px_rgba(0,30,64,0.05)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline font-bold text-[#191c1d] text-lg">Execução do Programa</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#737780] bg-[#edeeef] px-2 py-1 rounded">
                      Monitoramento Real-Time
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Execução Física */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[#43474f] text-sm font-medium">Execução Física da Obra</span>
                        <span className="text-[#381300] font-bold">{execFisica}%</span>
                      </div>
                      <div className="w-full bg-[#e7e8e9] h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-[#592300] h-full rounded-full transition-all duration-700"
                          style={{ width: `${execFisica}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#381300] font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Próximo ao limite de medição (50%)
                      </p>
                    </div>

                    {/* Volume de Famílias */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[#43474f] text-sm font-medium">Volume de Famílias</span>
                        <span className="text-secondary font-bold">{volumeFamilias}%</span>
                      </div>
                      <div className="w-full bg-[#e7e8e9] h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(volumeFamilias, 100) / 130 * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#43474f]">Limite do Convênio: 130%</p>
                    </div>
                  </div>
                </section>

                {/* ── Seção: Validação de Integridade ──────────────── */}
                <section className="bg-white rounded-xl p-6 shadow-[0_16px_32px_-12px_rgba(0,30,64,0.05)] border-l-4 border-secondary">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="bg-[#d8e2ff]/30 p-3 rounded-xl shrink-0">
                        <ShieldCheck className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-[#191c1d]">Validação de Integridade</h3>
                        <p className="text-[#43474f] text-sm">
                          {validationDone ? "Dados validados com sucesso" : "Pronto para processamento de remessa"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center">
                        <span className="block text-2xl font-black text-primary">{registros}</span>
                        <span className="text-[10px] uppercase font-bold text-[#737780]">Registros</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-black text-secondary">{erros}</span>
                        <span className="text-[10px] uppercase font-bold text-[#737780]">Erros</span>
                      </div>
                      <button
                        onClick={handleValidation}
                        disabled={isValidating || validationDone}
                        className="bg-secondary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isValidating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Validando...
                          </>
                        ) : validationDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Validado
                          </>
                        ) : (
                          "Iniciar Validação"
                        )}
                      </button>
                    </div>
                  </div>
                </section>

                {/* ── Seção: Histórico de Transmissões ─────────────── */}
                <section className="bg-white rounded-xl overflow-hidden shadow-[0_16px_32px_-12px_rgba(0,30,64,0.05)]">
                  <div className="px-6 py-4 bg-[#f3f4f5] border-b border-[#c3c6d1]/10">
                    <h3 className="font-headline font-bold text-[#191c1d]">Histórico de Transmissões</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#f3f4f5]/50">
                        <tr>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-[#737780] tracking-widest">Data</th>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-[#737780] tracking-widest">Responsável</th>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-[#737780] tracking-widest">Status</th>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-[#737780] tracking-widest text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f3f4f5]">
                        {history.map((record) => (
                          <tr key={record.id} className="hover:bg-[#f3f4f5]/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-[#191c1d]">{record.date}</td>
                            <td className="px-6 py-4 text-sm text-[#43474f]">{record.responsible}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(record.status)}`}>
                                {record.statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-secondary text-xs font-bold hover:underline cursor-pointer bg-transparent border-none">
                                Ver Retorno da Caixa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>

              {/* ═══════════════════════════════════════════════════════
                  COLUNA DIREITA: Ação Principal e Identidade (4-col)
                  ═══════════════════════════════════════════════════════ */}
              <div className="md:col-span-4 flex flex-col gap-6">

                {/* ── Card Hero: Ação de Transmissão ───────────────── */}
                <div className="bg-[#001e40] p-8 rounded-2xl text-white shadow-2xl shadow-[#001e40]/20 relative overflow-hidden group select-none">
                  {/* Ícone decorativo de fundo */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <CloudUpload className="w-[120px] h-[120px]" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                      <Network className="w-5 h-5 text-[#d8e2ff]" />
                      <span className="text-xs font-bold tracking-widest uppercase text-[#d8e2ff]">Integração CadÚnico Ativa</span>
                    </div>
                    <h4 className="font-headline text-2xl font-bold mb-4 leading-tight">
                      {transmissionDone ? "Arquivo Transmitido ✓" : "Pronto para Exportação"}
                    </h4>
                    <p className="text-[#a7c8ff] text-sm mb-8">
                      O sistema consolidou todos os dados de engenharia e social. A transmissão é criptografada e direta para os servidores da CEF.
                    </p>
                    <button
                      onClick={handleTransmit}
                      disabled={isTransmitting || transmissionDone}
                      className="w-full bg-[#0070ea] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-[#0059bb]/30 transition-all active:scale-95 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isTransmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Transmitindo...
                        </>
                      ) : transmissionDone ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Transmissão Concluída
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Gerar e Enviar Arquivo
                        </>
                      )}
                    </button>
                    <div className="mt-6 flex items-center gap-2 text-[10px] text-[#a7c8ff] opacity-70">
                      <Shield className="w-3.5 h-3.5" />
                      Protocolo de Segurança Governamental v4.2
                    </div>
                  </div>
                </div>

                {/* ── Card: Informações de Contexto ────────────────── */}
                <div className="bg-[#e7e8e9] rounded-xl p-6">
                  <h5 className="font-headline font-bold text-primary mb-4 text-sm">Informações de Contexto</h5>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <Building2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#191c1d]">Agência Vinculada</p>
                        <p className="text-xs text-[#43474f]">Superintendência Regional - Brasília/DF</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#191c1d]">Layout do Arquivo</p>
                        <p className="text-xs text-[#43474f]">CEF_HAB_V2024_03.xml</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* ── Card: Imagem Decorativa Arquitetural ──────────── */}
                <div className="rounded-xl overflow-hidden h-48 relative select-none">
                  <img
                    alt="Arquitetura Institucional Brasileira"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjO1AsgfQMwuFjBHWg4S6YneB-vdFM124EDv03J3OGhXUkSWOCjHV-tHjctQQ6Mf4SsJZkdANZHKKOP1vtn16FZKTnJSlR4KUGaMqFtv-wNwJBP7IMrQF8yROqfALRpUE75_7gcv5tJMWKYV0pKRdU1pmUMVSj2YPlUs8oetRStXTairzn2kOY7_Tl9nppENmbVV0bg8BD1qyBVXiMgr4wCeGhRtYIX7QN4ywIK5OsEZ-ppc27chtT4dVzHSIM80luyLLbq_v9-m8"
                  />
                  <div className="absolute inset-0 bg-[#001e40]/20 backdrop-blur-[2px]" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] uppercase font-black tracking-widest">SIGAH</p>
                    <p className="text-xs opacity-80">Gestão e Transparência</p>
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
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/50 rounded-t-xl select-none flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => router.push(`/${programId}/cadastro`)}
          className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer active:scale-90 duration-200"
        >
          <span className="text-xl">📝</span>
          <span className="text-[10px] font-bold tracking-wide">Cadastro</span>
        </button>
        <button
          onClick={() => router.push(`/${programId}/classificacao`)}
          className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer active:scale-90 duration-200"
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold tracking-wide">Classificação</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-5 py-1.5 active:scale-90 duration-200 border-none cursor-pointer">
          <span className="text-xl">📤</span>
          <span className="text-[10px] font-bold tracking-wide">Exportar</span>
        </button>
        <button
          onClick={() => router.push(`/${programId}/auditoria`)}
          className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer active:scale-90 duration-200"
        >
          <span className="text-xl">🛡</span>
          <span className="text-[10px] font-bold tracking-wide">Auditoria</span>
        </button>
      </nav>

    </div>
  );
}
