// =============================================================================
// app/[programId]/enquadramento/fraude/page.tsx
// Validação de Renda - Detecção de Fraude (RF016) (Passo 22.3).
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
  AlertCircle,
  FileText,
  FileSignature,
  Maximize2,
  Lock,
  MailWarning,
  Calendar,
  X,
  CheckCircle2,
  Loader2,
  Ban,
  Scale
} from "lucide-react";

export default function DeteccaoFraudePage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [isRegisteringAppeal, setIsRegisteringAppeal] = useState(false);
  const [showEvidenceZoom, setShowEvidenceZoom] = useState(false);

  // Ações
  const handleDownloadReport = () => {
    setIsDownloadingReport(true);
    setToastMessage("Consolidando evidências de fraude e gerando laudo jurídico...");
    setTimeout(() => {
      setIsDownloadingReport(false);
      setToastMessage("Laudo de irregularidade técnica baixado com sucesso!");
      setTimeout(() => setToastMessage(null), 3500);

      // Simular download do laudo txt/pdf
      const reportText = `SIGAH // LAUDO DE DETECÇÃO DE FRAUDE (RF016)\n----------------------------------------\nProtocolo: #SIGAH-2024-0882-FT\nCandidato: Maria Eduarda Santos (Família Santos)\nCPF: ***.452.118-**\nData do Cruzamento: 14/10/2024 às 10:45\n\nINCONSISTÊNCIAS DETECTADAS:\n1. Divergência de Renda: Superior a 120% do valor autodeclarado (Cruzamento CNIS/CadÚnico)\n2. Omissão de Vínculo: Vínculo CLT ativo detectado no CNIS\n3. CPF irregular para a atividade declarada na Receita Federal\n\nStatus: DESCLASSIFICADO DEFINITIVAMENTE\nBloqueio permanente aplicado para assinatura de contrato.\n`;
      const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `laudo_fraude_santos_${familiaId}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const handleRegisterAppeal = () => {
    setIsRegisteringAppeal(true);
    setToastMessage("Iniciando fluxo de interposição de recurso...");
    setTimeout(() => {
      setIsRegisteringAppeal(false);
      setToastMessage("Recurso administrativo registrado. Aguardando análise jurídica.");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  const familiaId = "santos";

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
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Breadcrumb & Main Title */}
            <div className="space-y-1 select-none">
              <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Gestão</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span>Candidatos</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="text-secondary font-black">Família Santos</span>
              </nav>
              <h2 className="text-3xl font-extrabold text-primary tracking-tight mt-2">
                Situação do Candidato: Desclassificado
              </h2>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Detalhes do Caso */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Family Identity Card */}
                <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 border-l-4 border-l-[#001e40] shadow-sm space-y-6">
                  <div className="flex justify-between items-start flex-wrap gap-4 select-none">
                    <div>
                      <h3 className="font-headline text-xl font-black text-primary mb-2">Família Santos</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-error-container/20 text-error text-[9px] font-black px-3 py-1 rounded-full border border-error/25 flex items-center gap-1.5 uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5 text-error fill-error-container/40 shrink-0" />
                          Nível de Risco: Crítico
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-black uppercase mt-3 tracking-wider">
                        Protocolo: #SIGAH-2024-0882-FT | Módulo de Detecção de Fraudes
                      </p>
                    </div>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-250/20">
                      Lote 04 - Social
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 font-sans text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">Responsável</p>
                      <p className="font-black text-primary">Maria Eduarda Santos</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">CPF</p>
                      <p className="font-black text-primary">***.452.118-**</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">Data Inscrição</p>
                      <p className="font-black text-primary">12/01/2024</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">Pontuação Anterior</p>
                      <p className="font-black text-primary">85 pts</p>
                    </div>
                  </div>
                </section>

                {/* High-Visibility Error Card */}
                <section className="bg-error-container/10 border-2 border-error rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-error p-5 flex items-center gap-3 text-on-error select-none">
                    <AlertCircle className="w-5 h-5 text-on-error shrink-0" />
                    <h4 className="font-headline text-on-error font-black text-xs uppercase tracking-widest">
                      Desclassificação Definitiva
                    </h4>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <p className="font-headline text-xl font-black text-error">
                      DESCLASSIFICADO: Divergência Grave Detectada.
                    </p>
                    <p className="text-on-surface-variant text-xs font-semibold leading-relaxed">
                      Foi identificada a prestação de informações inverídicas ou omissão de dados essenciais em relação à documentação apresentada. Conforme o edital, esta família está permanentemente desclassificada deste ciclo.
                    </p>
                    <p className="text-[10px] font-black uppercase text-slate-400 italic select-none">
                      Detectado via Cruzamento Automático com Bases Externas: <strong className="text-slate-650 font-black">CadÚnico</strong>, <strong className="text-slate-650 font-black">CNIS</strong> e <strong className="text-slate-650 font-black">RFB</strong>.
                    </p>

                    {/* Bento card inside */}
                    <div className="bg-white p-5 rounded-xl border border-error-container/50 space-y-4">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                        <Scale className="w-4 h-4 text-slate-500 shrink-0" />
                        Inconsistências Detectadas
                      </h5>
                      
                      <div className="space-y-3 font-sans text-xs">
                        <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                          <span className="font-black text-primary">Divergência de Renda</span>
                          <span className="text-error font-black text-xs">Superior a 120% do declarado</span>
                        </div>
                        <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                          <span className="font-black text-primary">Omissão de Vínculo</span>
                          <span className="text-error font-black text-xs">Vínculo ativo em base CNIS</span>
                        </div>
                        <div className="flex items-center justify-between py-2.5">
                          <span className="font-black text-primary">Documentação RFB</span>
                          <span className="text-error font-black text-xs">CPF irregular para atividade</span>
                        </div>
                      </div>
                    </div>

                    {/* Alert card at bottom */}
                    <div className="p-4 bg-error text-on-error rounded-xl flex items-start gap-3 shadow-md shadow-error/10">
                      <Ban className="w-5 h-5 text-on-error shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-black uppercase tracking-wider">Status de Bloqueio</p>
                        <p className="opacity-95 mt-0.5 leading-relaxed font-semibold">
                          Candidato impedido permanentemente de avançar para a etapa de assinatura de contrato (RF016).
                        </p>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2 select-none">
                  <button
                    onClick={handleDownloadReport}
                    disabled={isDownloadingReport}
                    className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all border-none cursor-pointer"
                  >
                    {isDownloadingReport ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <FileText className="w-4.5 h-4.5 text-white shrink-0" />
                        <span>Ver Relatório de Irregularidade</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleRegisterAppeal}
                    disabled={isRegisteringAppeal}
                    className="flex-1 border-2 border-slate-200 text-slate-500 hover:bg-slate-50 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all bg-transparent cursor-pointer font-sans"
                  >
                    {isRegisteringAppeal ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                    ) : (
                      <>
                        <FileSignature className="w-4.5 h-4.5 text-slate-550 shrink-0" />
                        <span>Registrar Recurso</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Coluna Direita: Contextual Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Sidebar Card 1: Evidência Digital */}
                <section className="bg-slate-100 p-6 rounded-2xl border border-slate-250/20 space-y-4">
                  <h3 className="font-headline text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                    Evidência Digital
                  </h3>
                  
                  <div 
                    onClick={() => setShowEvidenceZoom(true)}
                    className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm border border-slate-200"
                  >
                    <img
                      alt="Document verification analysis" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAldpxtgwp-f5n8hruFUiLJ9NRAvljsavqEiMJW1gBV1A296YxLhh5nUHhHK02YeH0-KxnSztJNVeaKuhGaPXQwUySiKtl8Suo6LRvhhX53gDWggL5N1vQO_w3mA9ST15dNE_nmT4FqAuB74UyE6v91iyiqA0MaHbYcjEBuCSuqVPdFZjRdtLFSAe7WyUpVUPDP3PhbZaUtCBeW_r0xHYL2LYQWL1GVQrWKbS89ZFQjYfAbNPUJXKAGIh3yuEYnT1rg_LqJ9XZyzxU" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#001e40]/25 backdrop-blur-[1px] group-hover:bg-[#001e40]/30 transition-all select-none">
                      <span className="bg-white/95 px-4 py-2 rounded-xl text-[9px] font-black text-primary flex items-center gap-1.5 shadow uppercase tracking-wider">
                        <Maximize2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        Ampliar Prova
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Processo de auditoria automatizado via API SIGAH em 14/10/2024 às 10:45. A divergência de renda bruta familiar excede a margem de erro permitida de 5%. Evidência criptografada para fins de comprovação jurídica e integridade do processo (RF016).
                  </p>
                </section>

                {/* Sidebar Card 2: Próximos Passos */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-headline text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                    Próximos Passos
                  </h3>
                  
                  <ul className="space-y-5 select-none">
                    <li className="flex gap-3">
                      <MailWarning className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-black text-primary">Notificação Oficial</p>
                        <p className="text-slate-400 font-semibold mt-0.5">Enviado para o e-mail e app do candidato.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-black text-primary">Prazo de Recurso</p>
                        <p className="text-slate-400 font-semibold mt-0.5">Encerra-se em 48 horas úteis.</p>
                      </div>
                    </li>
                  </ul>
                </section>

              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL: ZOOM DA EVIDÊNCIA DIGITAL
          ========================================== */}
      {showEvidenceZoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/75 backdrop-blur-sm transition-opacity" onClick={() => setShowEvidenceZoom(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 select-none">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-heading text-sm font-black text-[#001e40] uppercase tracking-wider">Evidência de Auditoria Digital - Santos</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowEvidenceZoom(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-slate-150 flex items-center justify-center border-b border-slate-200">
              <img 
                alt="Document proof verification maximized" 
                className="max-h-[60vh] object-contain rounded-lg shadow" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAldpxtgwp-f5n8hruFUiLJ9NRAvljsavqEiMJW1gBV1A296YxLhh5nUHhHK02YeH0-KxnSztJNVeaKuhGaPXQwUySiKtl8Suo6LRvhhX53gDWggL5N1vQO_w3mA9ST15dNE_nmT4FqAuB74UyE6v91iyiqA0MaHbYcjEBuCSuqVPdFZjRdtLFSAe7WyUpVUPDP3PhbZaUtCBeW_r0xHYL2LYQWL1GVQrWKbS89ZFQjYfAbNPUJXKAGIh3yuEYnT1rg_LqJ9XZyzxU" 
              />
            </div>
            <div className="p-5 bg-slate-50 text-[10px] font-mono text-slate-500 leading-relaxed">
              <span className="text-secondary font-black block mb-1">HASH VERIFICATION CODE // SH-256</span>
              9b788a10cc92e5ba0901df4fce323891823908f902acdf8c89b2734612349ae8
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
