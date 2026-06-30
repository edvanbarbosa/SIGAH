// =============================================================================
// app/[programId]/retomada/page.tsx
// Execução Extrajudicial e Retomada (Passo 28.3 / Etapa 61).
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
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Users,
  Eye,
  FolderOpen,
  FileText,
  Camera,
  Send,
  CheckCircle2,
  X,
  Loader2,
  Building,
  MapPin,
  CheckCircle,
  HelpCircle,
  Home,
  GitFork,
  User
} from "lucide-react";

interface InfractionCase {
  id: string;
  beneficiario: string;
  cpf: string;
  infraction: string;
  infractionBgClass: string;
  details: {
    dataVistoria: string;
    fiscal: string;
    observacoes: string;
    numNotificacoes: number;
  };
}

export default function ExecucaoExtrajudicialPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Controle de Perfil: 'social' (Trabalho Social - Somente Leitura) vs 'admin' (Administrador Central - Transmissão Liberada)
  const [operatorProfile, setOperatorProfile] = useState<"social" | "admin">("social");

  // Estados principais
  const [cases, setCases] = useState<InfractionCase[]>([
    {
      id: "UH-2024-0012",
      beneficiario: "Ricardo Almeida S.",
      cpf: "012.***.***-45",
      infraction: "Abandono de Imóvel",
      infractionBgClass: "bg-[#ffdbca] text-[#381300] border border-[#ffdbca]",
      details: {
        dataVistoria: "10/05/2024",
        fiscal: "Carlos Eduardo (Engenheiro)",
        observacoes: "Imóvel fechado e sem consumo de água ou luz há 6 meses. Vizinhos relatam que morador se mudou de estado.",
        numNotificacoes: 3
      }
    },
    {
      id: "UH-2024-0459",
      beneficiario: "Maria José Pereira",
      cpf: "442.***.***-10",
      infraction: "Aluguel Irregular",
      infractionBgClass: "bg-[#ffdbca] text-[#381300] border border-[#ffdbca]",
      details: {
        dataVistoria: "14/05/2024",
        fiscal: "Mariana Costa (Assistente Social)",
        observacoes: "Imóvel sublocado a terceiros sem anuência da EPL/Secretaria de Habitação. Contrato de gaveta identificado.",
        numNotificacoes: 2
      }
    },
    {
      id: "UH-2024-0892",
      beneficiario: "Cláudio Duarte Lima",
      cpf: "198.***.***-82",
      infraction: "Venda sem Anuência",
      infractionBgClass: "bg-[#ffdbca] text-[#381300] border border-[#ffdbca]",
      details: {
        dataVistoria: "18/05/2024",
        fiscal: "Roberto Souza (Auditor)",
        observacoes: "Imóvel anunciado para venda e transacionado de forma ilegal através de redes sociais. Dossiê de denúncia anexo.",
        numNotificacoes: 3
      }
    },
    {
      id: "UH-2024-1102",
      beneficiario: "Ana Julia Santos",
      cpf: "301.***.***-55",
      infraction: "Uso Não Residencial",
      infractionBgClass: "bg-[#ffdbca] text-[#381300] border border-[#ffdbca]",
      details: {
        dataVistoria: "20/05/2024",
        fiscal: "Patrícia Medeiros (Fiscal)",
        observacoes: "Garagem e sala do imóvel convertidos em comércio (mercearia de grande porte) sem alvará ou autorização.",
        numNotificacoes: 1
      }
    }
  ]);

  // Estados de Interação
  const [selectedCase, setSelectedCase] = useState<InfractionCase | null>(null);
  const [transmissionStatus, setTransmissionStatus] = useState<"pending" | "sending" | "sent">("pending");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transmitir dossiê
  const handleTransmitDossier = () => {
    if (operatorProfile === "social") {
      setToastMessage("Erro: Seu perfil atual não possui permissão para assinar e transmitir este dossiê.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setTransmissionStatus("sending");
    setToastMessage("Iniciando assinatura digital com certificado A3...");
    setTimeout(() => {
      setTransmissionStatus("sent");
      setToastMessage("Dossiê consolidado e transmitido ao Agente Financeiro (Caixa)!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 2000);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-7xl mx-auto px-6 pt-24 pb-32">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Seletor de Perfil do Operador (Simulação de Auditoria) */}
            <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4 select-none">
              <span className="text-xs font-black text-primary uppercase tracking-wider">
                Simulador de Acesso (Auditoria de Perfil):
              </span>
              <div className="flex bg-[#f3f4f5] p-1.5 rounded-xl border border-slate-200">
                <button 
                  onClick={() => {
                    setOperatorProfile("social");
                    setTransmissionStatus("pending");
                  }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border-none transition-all ${
                    operatorProfile === "social" 
                      ? "bg-[#001e40] text-white shadow-sm" 
                      : "text-slate-500 hover:text-primary"
                  }`}
                >
                  Trabalho Social (Leitura)
                </button>
                <button 
                  onClick={() => setOperatorProfile("admin")}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border-none transition-all ${
                    operatorProfile === "admin" 
                      ? "bg-[#001e40] text-white shadow-sm" 
                      : "text-slate-500 hover:text-primary"
                  }`}
                >
                  Admin Central (Transmissão)
                </button>
              </div>
            </div>

            {/* Warning Banner para Perfil Trabalho Social */}
            {operatorProfile === "social" && (
              <div className="mb-8 bg-[#ffdbca]/40 border-l-4 border-[#ffb690] p-4 flex items-center gap-4 rounded-r-xl select-none">
                <AlertTriangle className="text-[#723610] w-6 h-6 shrink-0" />
                <div>
                  <p className="text-[#341100] font-black text-sm uppercase tracking-wide">Acesso Restrito: Perfil Trabalho Social</p>
                  <p className="text-on-surface-variant text-xs font-semibold leading-relaxed">
                    Este perfil não possui permissão para assinar, transmitir ou homologar a execução extrajudicial. Visualização em modo de auditoria apenas.
                  </p>
                </div>
              </div>
            )}

            {/* Breadcrumbs e Título */}
            <div className="mb-8 select-none">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-2 uppercase tracking-widest font-black">
                <span>Gestão</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span>Retomada de Imóveis</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="text-secondary">Execução Extrajudicial</span>
              </div>
              <h2 className="font-headline font-black text-3xl text-primary tracking-tight">
                Execução Extrajudicial
              </h2>
              <p className="text-on-surface-variant text-sm mt-1.5 font-medium leading-relaxed">
                Preparação e transmissão de dossiês de retomada de unidades habitacionais por infrações cadastrais e contratuais para o Agente Financeiro.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Esquerda: Lista de Irregularidades e Mapa (8 Colunas) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Irregularidades Verificadas */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center select-none">
                    <h3 className="font-headline font-black text-sm text-primary uppercase tracking-wide flex items-center gap-2">
                      <CheckCircle className="text-secondary w-5 h-5" />
                      <span>Irregularidades Verificadas</span>
                    </h3>
                    <span className="bg-[#d8e2ff] text-[#001a41] text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                      4 Unidades Prontas
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 border-b border-slate-100 select-none">
                        <tr className="text-on-surface-variant text-[9px] uppercase tracking-widest font-black">
                          <th className="px-6 py-4">ID Unidade</th>
                          <th className="px-6 py-4">Beneficiário</th>
                          <th className="px-6 py-4">Infração Detetada</th>
                          <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cases.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-xs font-black text-primary">
                              {c.id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs font-extrabold text-primary leading-tight">{c.beneficiario}</div>
                              <div className="text-[10px] text-slate-450 mt-1 select-none font-bold uppercase tracking-wider">{c.cpf}</div>
                            </td>
                            <td className="px-6 py-4 select-none">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${c.infractionBgClass}`}>
                                {c.infraction}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setSelectedCase(c)}
                                className="text-secondary hover:text-primary font-black text-xs uppercase tracking-wider border-none bg-transparent cursor-pointer"
                              >
                                Ver Detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Localização das Unidades em Execução */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 space-y-4">
                  <h3 className="font-headline font-black text-sm text-primary flex items-center gap-2 select-none">
                    <MapPin className="text-secondary w-5 h-5 shrink-0" />
                    <span>Localização das Unidades em Execução</span>
                  </h3>

                  <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200/50 select-none">
                    <img 
                      className="w-full h-full object-cover opacity-60 grayscale" 
                      alt="Mapa de Localização"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBGpT4f9CPhXNk-ZzH_jtsAgvW41XP7UQOLX9EblTYo77BmjF9dS1950i6p5W7wY_lIrZyuVt_6ZOKEHhA6SmIAL4ikOSdB9ZcmGkffaG3i4JXA9gWFYZ4BorE0iVUFArGwwk0pD0JEloPVkV19Ur3f-BJsN4x2SsL8Sc_rxLZpqIrJU9aOHMctkHTjclZLiNDcd8Mt3iFhl1u14lahLj3dY4WP97YB_WcTQsE7U2qdVxqo12w6VEo_4a0QFl9hsTlGlCHtHUlm04" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-primary/95 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2">
                        <span>🔍</span>
                        <span>Filtrar por Setor Administrativo</span>
                      </span>
                    </div>
                  </div>
                </section>

              </div>

              {/* Direita: Dossiê e Transmissão (4 Colunas) */}
              <div className="lg:col-span-4 space-y-8 select-none">
                
                {/* Dossiê de Transmissão */}
                <section className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-secondary border-x border-b border-slate-200/60 space-y-6">
                  <h3 className="font-headline font-black text-sm text-primary flex items-center gap-2 border-b border-slate-50 pb-3">
                    <FolderOpen className="text-secondary w-5 h-5 shrink-0" />
                    <span>Dossiê de Transmissão</span>
                  </h3>

                  <div className="space-y-3">
                    
                    {/* Item 1 */}
                    <div 
                      onClick={() => setToastMessage("Carregando PDFs de Contratos originais assinados...")}
                      className="flex items-center gap-4 p-3 bg-[#f3f4f5] rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/40"
                    >
                      <div className="w-10 h-10 bg-primary-container/10 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="text-primary w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-primary truncate">Contratos Originais</p>
                        <p className="text-[10px] text-slate-400 font-bold">4 arquivos PDF (24.5 MB)</p>
                      </div>
                      <Eye className="w-4 h-4 text-slate-400 hover:text-secondary shrink-0" />
                    </div>

                    {/* Item 2 */}
                    <div 
                      onClick={() => setToastMessage("Carregando Laudos Técnicos de fiscalização...")}
                      className="flex items-center gap-4 p-3 bg-[#f3f4f5] rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/40"
                    >
                      <div className="w-10 h-10 bg-primary-container/10 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldAlert className="text-primary w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-primary truncate">Laudos Técnicos</p>
                        <p className="text-[10px] text-slate-400 font-bold">Assinados digitalmente (12.2 MB)</p>
                      </div>
                      <Eye className="w-4 h-4 text-slate-400 hover:text-secondary shrink-0" />
                    </div>

                    {/* Item 3 */}
                    <div 
                      onClick={() => setToastMessage("Carregando fotos georreferenciadas do imóvel...")}
                      className="flex items-center gap-4 p-3 bg-[#f3f4f5] rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/40"
                    >
                      <div className="w-10 h-10 bg-primary-container/10 rounded-xl flex items-center justify-center shrink-0">
                        <Camera className="text-primary w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-primary truncate">Evidências Fotográficas</p>
                        <p className="text-[10px] text-slate-400 font-bold">32 fotos georreferenciadas</p>
                      </div>
                      <Eye className="w-4 h-4 text-slate-400 hover:text-secondary shrink-0" />
                    </div>

                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant font-bold">Status Atual</span>
                      
                      {transmissionStatus === "pending" && (
                        <span className="text-[10px] font-black text-secondary flex items-center gap-1">
                          <span>📝</span>
                          <span>Aguardando Transmissão</span>
                        </span>
                      )}

                      {transmissionStatus === "sending" && (
                        <span className="text-[10px] font-black text-amber-600 flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Transmitindo Dossiê...</span>
                        </span>
                      )}

                      {transmissionStatus === "sent" && (
                        <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                          <span>✓</span>
                          <span>Dossiê Transmitido</span>
                        </span>
                      )}
                    </div>

                    {/* Status Box (Post-Transmission) */}
                    {transmissionStatus === "sent" && (
                      <div className="bg-[#adc7ff]/30 p-3.5 rounded-xl border border-secondary/20 flex items-center gap-3">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0" />
                        <span className="text-xs font-black text-secondary leading-tight">
                          Status: Em Processo de Retomada
                        </span>
                      </div>
                    )}

                    <button 
                      onClick={handleTransmitDossier}
                      disabled={transmissionStatus === "sending" || transmissionStatus === "sent"}
                      className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer shadow-md ${
                        transmissionStatus === "sent"
                          ? "bg-emerald-600 text-white cursor-not-allowed"
                          : operatorProfile === "social"
                          ? "bg-slate-300 text-slate-450 cursor-not-allowed"
                          : "bg-gradient-to-br from-[#001e40] to-[#003366] text-white hover:brightness-110 active:scale-95"
                      }`}
                    >
                      {transmissionStatus === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Transmitindo Dossiê...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>Transmitir Dossiê</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed font-bold">
                      A transmissão requer certificado digital A3. O Agente Financeiro terá 72h para processar o recebimento.
                    </p>
                  </div>
                </section>

                {/* Métricas de Execução */}
                <section className="bg-[#e7e8e9]/55 rounded-2xl p-6 border border-slate-200/50 space-y-5">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">
                    Métricas de Execução
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-on-surface-variant uppercase">Documentação Completa</span>
                        <span className="text-primary font-black">100%</span>
                      </div>
                      <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200/30">
                        <div className="bg-secondary h-full w-full"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-on-surface-variant uppercase">Consistência Jurídica</span>
                        <span className="text-primary font-black">94%</span>
                      </div>
                      <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200/30">
                        <div className="bg-secondary h-full w-[94%]"></div>
                      </div>
                    </div>
                  </div>
                </section>

              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DE DETALHES DO CASO DE INFRAÇÃO
          ========================================== */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 select-none">
              <div>
                <h3 className="text-base font-black text-primary uppercase tracking-wide">Registro de Infração</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">
                  Dossiê e Parecer Técnico de Ocupação
                </p>
              </div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent flex items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs font-semibold text-primary">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">Responsável</span>
                  <span className="font-bold text-xs">{selectedCase.beneficiario}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">CPF</span>
                  <span className="font-bold text-xs">{selectedCase.cpf}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">Data da Ocorrência</span>
                  <span className="font-bold text-xs">{selectedCase.details.dataVistoria}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">Notificações Enviadas</span>
                  <span className="font-bold text-xs">{selectedCase.details.numNotificacoes} / 3</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-450 uppercase block mb-1">Fiscal Responsável</span>
                <span className="text-xs font-bold text-[#001e40]">{selectedCase.details.fiscal}</span>
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-450 uppercase block mb-1">Relato de Vistoria / Evidências</span>
                <p className="text-xs text-on-surface-variant leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-150 font-medium">
                  {selectedCase.details.observacoes}
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => setSelectedCase(null)}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none shadow-md"
            >
              Fechar Detalhes
            </button>

          </div>
        </div>
      )}

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/50 rounded-t-xl select-none flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold tracking-wide">Início</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">📢</span>
          <span className="text-[10px] font-bold tracking-wide">Denúncias</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-4 py-1 active:scale-90 duration-200 border-none cursor-pointer">
          <span className="text-xl">🔄</span>
          <span className="text-[10px] font-bold tracking-wide">Retomadas</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold tracking-wide">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
