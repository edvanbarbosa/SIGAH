// =============================================================================
// app/[programId]/exportacao/page.tsx
// Exportação e Publicidade de Dados (Etapa 64).
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
  Download,
  Settings2,
  Shield,
  CloudUpload,
  CalendarClock,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Share2,
  X,
  Clock,
  AlertTriangle
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ExportRecord {
  id: string;
  protocol: string;
  date: string;
  requester: string;
  dataset: string;
  status: "concluido" | "processando" | "aviso";
  statusLabel: string;
}

interface RecentFile {
  id: string;
  name: string;
  format: "PDF" | "CSV" | "JSON";
  size: string;
  time: string;
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function ExportacaoPublicidadePage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // ─── Estados do Formulário ────────────────────────────────────────────
  const [orgao, setOrgao] = useState("TCU - Tribunal de Contas da União");
  const [conjuntoDados, setConjuntoDados] = useState("Lista de Beneficiários");
  const [dataInicio, setDataInicio] = useState("2023-07-01");
  const [dataFim, setDataFim] = useState("2023-09-30");
  const [formato, setFormato] = useState<"PDF" | "CSV" | "JSON">("PDF");

  // ─── Estados de Interação ─────────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(4);

  // ─── Dados dos Últimos Arquivos ───────────────────────────────────────
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([
    { id: "rf-1", name: "Beneficiarios_V4.pdf", format: "PDF", size: "12.4 MB", time: "2 horas atrás" },
    { id: "rf-2", name: "Obras_Fiscalizacao.csv", format: "CSV", size: "4.1 MB", time: "Ontem" },
  ]);

  // ─── Dados do Histórico de Exportações ────────────────────────────────
  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([
    {
      id: "exp-1",
      protocol: "#EXP-2023-982",
      date: "24 Out 2023, 14:30",
      requester: "Ricardo Mendes",
      dataset: "Cronograma de Obras",
      status: "concluido",
      statusLabel: "CONCLUÍDO"
    },
    {
      id: "exp-2",
      protocol: "#EXP-2023-981",
      date: "22 Out 2023, 09:15",
      requester: "Sistema (Automático)",
      dataset: "Lista de Beneficiários",
      status: "processando",
      statusLabel: "EM PROCESSAMENTO"
    },
    {
      id: "exp-3",
      protocol: "#EXP-2023-980",
      date: "19 Out 2023, 16:45",
      requester: "Fernanda Silva",
      dataset: "Execução Financeira",
      status: "aviso",
      statusLabel: "AVISO: DADOS INCOMPLETOS"
    }
  ]);

  // ─── Ações Reativas ───────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);

      const newProtocol = `#EXP-2023-${983 + exportHistory.length}`;
      const newRecord: ExportRecord = {
        id: `exp-new-${Date.now()}`,
        protocol: newProtocol,
        date: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        requester: "Ana Silva",
        dataset: conjuntoDados,
        status: "processando",
        statusLabel: "EM PROCESSAMENTO"
      };
      setExportHistory(prev => [newRecord, ...prev]);

      const newFile: RecentFile = {
        id: `rf-new-${Date.now()}`,
        name: `${conjuntoDados.replace(/\s+/g, "_")}_${formato}.${formato.toLowerCase()}`,
        format: formato,
        size: `${(Math.random() * 15 + 1).toFixed(1)} MB`,
        time: "Agora"
      };
      setRecentFiles(prev => [newFile, ...prev.slice(0, 2)]);

      showToast(`Exportação ${newProtocol} iniciada com sucesso para ${orgao}.`);
    }, 2500);
  };

  const handleDownloadFile = (file: RecentFile) => {
    showToast(`Download iniciado: ${file.name}`);
  };

  // ─── Helpers de Estilo ────────────────────────────────────────────────
  const getStatusBadge = (status: ExportRecord["status"]) => {
    switch (status) {
      case "concluido":
        return "bg-[#d8e2ff]/50 text-[#004493]";
      case "processando":
        return "bg-[#d5e3ff] text-[#1f477b]";
      case "aviso":
        return "bg-[#ffdbca] text-[#723610]";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getFormatBadge = (format: RecentFile["format"]) => {
    switch (format) {
      case "PDF":
        return "bg-[#ffdad6] text-[#93000a]";
      case "CSV":
        return "bg-[#d8e2ff] text-[#001a41]";
      case "JSON":
        return "bg-[#d5e3ff] text-[#1f477b]";
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
              <span className="text-secondary">Exportação e Transparência</span>
            </nav>

            {/* Título Principal */}
            <header className="space-y-3 select-none">
              <h2 className="font-headline text-4xl md:text-[3.5rem] leading-none font-bold text-primary tracking-tight">
                Exportação e Transparência
              </h2>
              <p className="text-[#43474f] text-base md:text-lg max-w-2xl">
                Gere e gerencie pacotes de dados para órgãos de controle e auditoria externa de forma segura e padronizada.
              </p>
            </header>

            {/* ─── Grid Principal 12-col ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* ═══════════════════════════════════════════════════════
                  COLUNA ESQUERDA: Formulário de Configuração (8-col)
                  ═══════════════════════════════════════════════════════ */}
              <section className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 shadow-[0_16px_32px_-12px_rgba(0,30,64,0.05)]">
                <div className="flex items-center gap-3 mb-8">
                  <Settings2 className="w-5 h-5 text-secondary" />
                  <h3 className="font-headline text-lg font-bold text-primary">Configurar Nova Exportação</h3>
                </div>

                <div className="space-y-8">
                  {/* Linha 1: Órgão + Conjunto de Dados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-[#43474f] uppercase tracking-widest">
                        Órgão Destinatário
                      </label>
                      <div className="relative">
                        <select
                          value={orgao}
                          onChange={(e) => setOrgao(e.target.value)}
                          className="w-full bg-[#e1e3e4] border-none rounded-lg px-4 py-3 text-[#191c1d] text-sm focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                        >
                          <option>TCU - Tribunal de Contas da União</option>
                          <option>CGU - Controladoria Geral da União</option>
                          <option>Caixa Econômica Federal</option>
                          <option>Ministério das Cidades</option>
                          <option>Diário Oficial / Conselhos</option>
                        </select>
                        <ChevronRight className="w-4 h-4 absolute right-4 top-3.5 pointer-events-none text-[#43474f] rotate-90" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-[#43474f] uppercase tracking-widest">
                        Conjunto de Dados
                      </label>
                      <div className="relative">
                        <select
                          value={conjuntoDados}
                          onChange={(e) => setConjuntoDados(e.target.value)}
                          className="w-full bg-[#e1e3e4] border-none rounded-lg px-4 py-3 text-[#191c1d] text-sm focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                        >
                          <option>Lista de Beneficiários</option>
                          <option>Cronograma de Obras</option>
                          <option>Execução Financeira Mensal</option>
                          <option>Relatório de Irregularidades</option>
                          <option>Relatório para Diário Oficial / Conselhos</option>
                        </select>
                        <ChevronRight className="w-4 h-4 absolute right-4 top-3.5 pointer-events-none text-[#43474f] rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Linha 2: Período + Formato */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[10px] font-black text-[#43474f] uppercase tracking-widest">
                        Período do Relatório
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="date"
                          value={dataInicio}
                          onChange={(e) => setDataInicio(e.target.value)}
                          className="flex-1 bg-[#e1e3e4] border-none rounded-lg px-4 py-3 text-[#191c1d] text-sm focus:ring-2 focus:ring-secondary"
                        />
                        <span className="text-[#43474f] text-sm font-medium">até</span>
                        <input
                          type="date"
                          value={dataFim}
                          onChange={(e) => setDataFim(e.target.value)}
                          className="flex-1 bg-[#e1e3e4] border-none rounded-lg px-4 py-3 text-[#191c1d] text-sm focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-[#43474f] uppercase tracking-widest">
                        Formato
                      </label>
                      <div className="flex bg-[#e1e3e4] p-1 rounded-lg">
                        {(["PDF", "CSV", "JSON"] as const).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFormato(f)}
                            className={`flex-1 py-2 rounded-md font-bold text-xs cursor-pointer border-none transition-all duration-200 ${
                              formato === f
                                ? "bg-white shadow-sm text-primary"
                                : "text-[#43474f] hover:text-primary bg-transparent"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Banner LGPD */}
                  <div className="bg-[#f3f4f5] p-4 rounded-xl border border-[#c3c6d1]/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0059bb]/10 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-primary uppercase tracking-wider">Proteção de Dados (LGPD)</span>
                        <span className="bg-[#0059bb]/10 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">ATIVO</span>
                      </div>
                      <p className="text-xs text-[#43474f]">
                        A proteção de dados é nativa. Dados sensíveis são mascarados automaticamente em conformidade com a LGPD para garantir a privacidade e segurança institucional.
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="pt-6 border-t border-[#c3c6d1]/15 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl border border-[#c3c6d1] text-[#43474f] font-bold text-sm hover:bg-[#e1e3e4] transition-colors cursor-pointer bg-transparent"
                    >
                      <span className="flex items-center gap-2 justify-center">
                        <CalendarClock className="w-4 h-4" />
                        Agendar Recorrência
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={isExporting}
                      className="px-8 py-3 rounded-xl bg-gradient-to-br from-[#001e40] to-[#003366] text-white font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 justify-center cursor-pointer border-none disabled:opacity-70 disabled:cursor-wait"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Iniciar Exportação
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* ═══════════════════════════════════════════════════════
                  COLUNA DIREITA: Sidebar Contextual (4-col)
                  ═══════════════════════════════════════════════════════ */}
              <aside className="lg:col-span-4 space-y-6">

                {/* Card Hero: Próxima Remessa */}
                <div className="bg-[#001e40] text-white rounded-2xl p-6 relative overflow-hidden shadow-xl select-none">
                  <div className="relative z-10">
                    <h4 className="font-headline font-bold text-xl mb-2">Próxima Remessa</h4>
                    <p className="text-[#a7c8ff] text-sm mb-6">
                      Entrega obrigatória TCU referente ao 3º Trimestre de 2023.
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black">{String(daysRemaining).padStart(2, "0")}</span>
                      <span className="text-lg font-medium opacity-80 pb-1">Dias restantes</span>
                    </div>
                  </div>
                  {/* Ícone decorativo de fundo */}
                  <CalendarClock className="absolute -right-4 -bottom-4 w-[120px] h-[120px] opacity-10" />
                </div>

                {/* Card: Últimos Arquivos */}
                <div className="bg-[#f3f4f5] rounded-2xl p-6">
                  <h4 className="font-headline font-bold text-primary mb-4 flex items-center gap-2">
                    <CloudUpload className="w-5 h-5" />
                    Últimos Arquivos
                  </h4>
                  <div className="space-y-3">
                    {recentFiles.map((file) => (
                      <div key={file.id} className="bg-white p-3 rounded-xl flex items-center gap-3">
                        <div className={`w-10 h-10 ${getFormatBadge(file.format)} rounded-lg flex items-center justify-center shrink-0`}>
                          <span className="text-[10px] font-black">{file.format}</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold text-primary truncate">{file.name}</p>
                          <p className="text-[10px] text-[#43474f]">{file.size} • {file.time}</p>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="text-[#43474f] hover:text-secondary cursor-pointer bg-transparent border-none transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* ═══════════════════════════════════════════════════════
                  TABELA: Histórico de Exportações (12-col)
                  ═══════════════════════════════════════════════════════ */}
              <section className="lg:col-span-12 mt-4">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  {/* Cabeçalho da Tabela */}
                  <div className="px-6 md:px-8 py-6 flex justify-between items-center">
                    <h3 className="font-headline text-lg font-bold text-primary">Histórico de Exportações</h3>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-[#edeeef] rounded-full cursor-pointer text-[#43474f] bg-transparent border-none transition-colors">
                        <Filter className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-[#edeeef] rounded-full cursor-pointer text-[#43474f] bg-transparent border-none transition-colors">
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tabela */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#f3f4f5] text-[#43474f]">
                        <tr>
                          <th className="px-6 md:px-8 py-4 text-[10px] uppercase tracking-wider font-black">Protocolo</th>
                          <th className="px-6 md:px-8 py-4 text-[10px] uppercase tracking-wider font-black">Data/Hora</th>
                          <th className="px-6 md:px-8 py-4 text-[10px] uppercase tracking-wider font-black hidden sm:table-cell">Solicitante</th>
                          <th className="px-6 md:px-8 py-4 text-[10px] uppercase tracking-wider font-black hidden md:table-cell">Conjunto de Dados</th>
                          <th className="px-6 md:px-8 py-4 text-[10px] uppercase tracking-wider font-black">Status</th>
                          <th className="px-6 md:px-8 py-4 text-[10px] uppercase tracking-wider font-black text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c3c6d1]/10">
                        {exportHistory.map((record, i) => (
                          <tr
                            key={record.id}
                            className={`hover:bg-[#f3f4f5]/30 transition-colors ${i % 2 !== 0 ? "bg-[#f3f4f5]/20" : ""}`}
                          >
                            <td className="px-6 md:px-8 py-5 font-bold text-xs text-primary">{record.protocol}</td>
                            <td className="px-6 md:px-8 py-5 text-sm text-[#43474f]">{record.date}</td>
                            <td className="px-6 md:px-8 py-5 text-sm hidden sm:table-cell">{record.requester}</td>
                            <td className="px-6 md:px-8 py-5 text-sm italic hidden md:table-cell">{record.dataset}</td>
                            <td className="px-6 md:px-8 py-5">
                              <span className={`${getStatusBadge(record.status)} px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap`}>
                                {record.statusLabel}
                              </span>
                            </td>
                            <td className="px-6 md:px-8 py-5 text-right">
                              <button className="text-secondary cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity">
                                <Eye className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  <div className="px-6 md:px-8 py-4 border-t border-[#c3c6d1]/15 flex justify-between items-center text-[10px] font-bold text-[#43474f] select-none">
                    <p>Mostrando {exportHistory.length} de 156 registros</p>
                    <div className="flex gap-4">
                      <button className="uppercase tracking-widest hover:text-primary cursor-pointer bg-transparent border-none text-[10px] font-bold text-[#43474f]">Anterior</button>
                      <button className="uppercase tracking-widest hover:text-primary cursor-pointer bg-transparent border-none text-[10px] font-bold text-[#43474f]">Próximo</button>
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
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/50 rounded-t-xl select-none flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => router.push(`/${programId}/dashboard`)}
          className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer"
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold tracking-wide">Dashboard</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">🛡</span>
          <span className="text-[10px] font-bold tracking-wide">Auditoria</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-5 py-1.5 active:scale-90 duration-200 border-none cursor-pointer">
          <span className="text-xl">📤</span>
          <span className="text-[10px] font-bold tracking-wide">Exportar</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold tracking-wide">Perfil</span>
        </button>
      </nav>

      {/* ==========================================
          FAB – Ação Rápida de Exportação
          ========================================== */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-secondary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 z-40 cursor-pointer border-none disabled:opacity-60"
      >
        {isExporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}
      </button>

    </div>
  );
}
