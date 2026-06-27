// =============================================================================
// app/[programId]/vagas/elevadores/page.tsx
// Tela de Gestão de Condicionantes para Elevadores (Passo 24.2).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  ChevronRight, 
  Printer, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Users, 
  Building2, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Handshake, 
  HelpCircle,
  X
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

export default function GestaoElevadoresPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados Interativos da UI
  const [convenioSigned, setConvenioSigned] = useState(false);
  const [aportePercent, setAportePercent] = useState(15); // Inicial: 15% (Bloqueado)
  const [taxaCondominial, setTaxaCondominial] = useState(480);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "file1", name: "Contrato_Assinado_Elevadores.pdf", size: "2.4 MB" }
  ]);

  const [savingChanges, setSavingChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calcula valores proporcionais de transparência condominial reativamente
  // Elevadores = 24% da cota, Outros = 76%
  const valorElevadores = (taxaCondominial * 0.24).toFixed(2);
  const valorOutras = (taxaCondominial * 0.76).toFixed(2);

  // Celebrar Convênio (Eleva o aporte para 20% e remove o bloqueio)
  const handleCelebrarConvenio = () => {
    setConvenioSigned(true);
    setAportePercent(20);
    setToastMessage("Convênio de Manutenção (RF043.5) celebrado com sucesso! O aporte do Ente Público foi elevado para 20% e o status de entrega do residencial está liberado.");
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Salvar Alterações
  const handleSaveChanges = () => {
    setSavingChanges(true);
    setTimeout(() => {
      setSavingChanges(false);
      setToastMessage("Alterações orçamentárias e contratuais salvas com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  // Simular Upload de novo Documento
  const handleSimulatedUpload = () => {
    const newFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: `Anexo_Tecnico_Termo_${uploadedFiles.length + 1}.pdf`,
      size: "1.8 MB"
    };
    setUploadedFiles(prev => [...prev, newFile]);
    setToastMessage("Documentação técnica anexada com sucesso.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Deletar arquivo
  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setToastMessage("Arquivo excluído da pasta de conformidade.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Imprimir Relatório Condominial
  const handlePrintReport = () => {
    const reportText = `==================================================
SIGAH - RELATÓRIO DE CONDICIONANTES PARA ELEVADORES
==================================================
Programa Habitacional: ${programId.toUpperCase()}
Condomínio: CONJUNTO HABITACIONAL FLAMBOYANT
Localização: Av. das Nações, 1450 - Brasília, DF

STATUS FINANCEIRO:
- Aporte do Ente Público: ${aportePercent}% (Limite Mínimo: 20%)
- Convênio Celebrado: ${convenioSigned ? "SIM" : "NÃO"}
- Subvenção de Manutenção: R$ 14.250,00 mensais (60 meses)
- Período Decorrido: Mês 24/60 (40% Concluído)

COMPOSIÇÃO DE TAXAS CONDOMINIAIS:
- Taxa Condominial Total: R$ ${taxaCondominial.toFixed(2)}
- Parcela de Elevadores (24%): R$ ${valorElevadores}
- Outras Despesas (76%): R$ ${valorOutras}

CONFORMIDADE DOCUMENTAL:
- Arquivos anexados: ${uploadedFiles.map(f => f.name).join(", ")}

Gerado em: ${new Date().toLocaleDateString("pt-BR")}
==================================================`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_elevadores_${programId}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-5xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho & Breadcrumbs */}
            <section className="space-y-4">
              <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium uppercase tracking-wider select-none">
                <span>Vagas</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span>Condicionantes</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-secondary font-bold">RF043 - Elevadores</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-heading text-3xl font-black text-primary tracking-tighter uppercase">
                    CONJUNTO HABITACIONAL FLAMBOYANT
                  </h1>
                  <p className="text-on-surface-variant text-xs mt-1 flex items-center gap-1.5 font-semibold">
                    <Layers className="w-4 h-4 text-on-surface-variant shrink-0" />
                    Av. das Nações, 1450 - Setor Habitacional - Brasília, DF
                  </p>
                </div>
                
                <div className="flex gap-3 select-none shrink-0">
                  <button 
                    onClick={handlePrintReport}
                    className="px-6 py-3 bg-surface-container-high text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2 border-none cursor-pointer"
                  >
                    <Printer className="w-4.5 h-4.5 shrink-0" />
                    Relatório
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={savingChanges}
                    className="px-6 py-3 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-secondary/15 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border-none cursor-pointer"
                  >
                    {savingChanges ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4.5 h-4.5 shrink-0" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* RF043.1: Validação de Aptidão */}
              <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 border-b-4 border-b-secondary flex flex-col justify-between select-none">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-heading text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
                    RF043.1 Validação de Aptidão
                  </h3>
                  <span className="bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border border-secondary/10">
                    Requisito Base
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-secondary/5 text-secondary">
                      <Building2 className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Terreno</p>
                      <p className="font-heading font-black text-sm text-primary">Qualificação Superior</p>
                    </div>
                    <div className="ml-auto text-secondary"><CheckCircle2 className="w-5 h-5 shrink-0" /></div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-secondary/5 text-secondary">
                      <Users className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">População Municipal</p>
                      <p className="font-heading font-black text-sm text-primary">850.400 Habitantes</p>
                    </div>
                    <div className="ml-auto text-secondary"><CheckCircle2 className="w-5 h-5 shrink-0" /></div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-heading text-base font-black text-primary">STATUS: APTO</span>
                    <ShieldCheck className="text-secondary w-9 h-9 fill-secondary/10" />
                  </div>
                </div>
              </div>

              {/* RF043.8: Status de Entrega (Alerta) */}
              <div className="lg:col-span-8 select-none">
                {convenioSigned ? (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-sm flex flex-col gap-3 h-full justify-center">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                      <h3 className="font-heading font-black uppercase tracking-wider text-sm">LIBERADO PARA ENTREGA</h3>
                    </div>
                    <p className="text-emerald-950 font-medium text-xs leading-relaxed">
                      Todas as condicionantes de acessibilidade e elevadores (RF043) foram plenamente atendidas e validadas. As unidades habitacionais do residencial estão autorizadas para entrega física imediata aos beneficiários cadastrados.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border-l-4 border-error p-6 rounded-r-2xl shadow-sm flex flex-col gap-3 h-full justify-center animate-pulse">
                    <div className="flex items-center gap-2 text-error">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-error" />
                      <h3 className="font-heading font-black uppercase tracking-wider text-sm">BLOQUEADO PARA ENTREGA</h3>
                    </div>
                    <p className="text-red-950 font-medium text-xs leading-relaxed">
                      A unidade habitacional não pode ser entregue ao beneficiário. Identificamos pendências críticas no <strong>Aporte do Ente Público</strong> e na <strong>Formalização do Convênio</strong>. O Habite-se parcial está suspenso.
                    </p>
                    <div className="mt-2.5">
                      <button 
                        onClick={handleCelebrarConvenio}
                        className="text-error font-extrabold text-xs underline underline-offset-4 bg-transparent border-none cursor-pointer p-0"
                      >
                        Celebrar Convênio de Manutenção para Desbloquear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RF043.2 & RF043.3: Subvenção de Manutenção */}
              <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[250px] select-none">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-heading text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    RF043.2 Subvenção de Manutenção
                  </h3>
                  <div className="text-right">
                    <p className="text-[9px] text-on-surface-variant uppercase font-black">Valor Mensal</p>
                    <p className="text-2xl font-black text-primary tracking-tight">R$ 14.250,00</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-black text-on-surface-variant mb-2 uppercase tracking-wider">
                    <span>Evolução do Período (Fixo 60 Meses)</span>
                    <span className="text-secondary">40% Concluído</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[40%] rounded-full shadow-[0_0_10px_rgba(0,89,187,0.2)]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-surface-container-low p-3.5 rounded-xl text-center">
                    <p className="text-[8px] font-black text-on-surface-variant uppercase mb-1">Início</p>
                    <p className="font-bold text-xs">Jan/2023</p>
                  </div>
                  <div className="bg-secondary/5 border border-secondary/20 p-3.5 rounded-xl text-center">
                    <p className="text-[8px] font-black text-secondary uppercase mb-1">Atual</p>
                    <p className="font-bold text-xs text-secondary">Mês 24/60</p>
                  </div>
                  <div className="bg-surface-container-low p-3.5 rounded-xl text-center">
                    <p className="text-[8px] font-black text-on-surface-variant uppercase mb-1">Término</p>
                    <p className="font-bold text-xs">Dez/2027</p>
                  </div>
                </div>
              </div>

              {/* RF043.4 & RF043.5: Aporte do Ente Público */}
              <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[250px]">
                <h3 className="font-heading text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                  RF043.4 Aporte do Ente Público
                </h3>

                <div className="flex items-center gap-6 my-4 select-none">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-slate-100" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                      <circle 
                        className={`transition-all duration-700 ${convenioSigned ? "text-emerald-500" : "text-error"}`} 
                        cx="48" 
                        cy="48" 
                        fill="transparent" 
                        r="40" 
                        stroke="currentColor" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 * (1 - aportePercent / 100)} 
                        strokeWidth="8"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-xl font-black ${convenioSigned ? "text-emerald-600" : "text-error"}`}>{aportePercent}%</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Percentual Atual</p>
                    {convenioSigned ? (
                      <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                        Aporte regularizado e fixado em <span className="font-bold">20%</span> nos termos legais do convênio firmado.
                      </p>
                    ) : (
                      <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                        O aporte atual está abaixo do limite legal de <strong>20% do contrato de manutenção</strong>. Necessário ajuste orçamentário.
                      </p>
                    )}
                    
                    {!convenioSigned && (
                      <div className="mt-2 flex items-center gap-1 text-error text-[10px] font-bold uppercase tracking-wider select-none">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-error" />
                        <span>Ação Requerida Imediata</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl select-none">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-on-surface-variant shrink-0" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-on-surface-variant">Convênio RF043.5</p>
                      <p className="text-xs font-bold text-primary">
                        {convenioSigned ? "Celebrado & Integrado" : "Pendente de Assinatura"}
                      </p>
                    </div>
                  </div>
                  {!convenioSigned ? (
                    <button 
                      onClick={handleCelebrarConvenio}
                      className="bg-primary text-white text-[10px] font-bold px-3.5 py-2 rounded-lg uppercase tracking-wider hover:brightness-110 active:scale-95 transition-transform border-none cursor-pointer shadow-md"
                    >
                      Celebrar
                    </button>
                  ) : (
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/50 border border-emerald-300 px-3 py-1 rounded-lg uppercase">
                      Ativo
                    </span>
                  )}
                </div>
              </div>

              {/* RF043.6: Transparência Condominial */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <h3 className="font-heading text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                  RF043.6 Transparência Condominial
                </h3>

                <div className="space-y-4 my-6">
                  {/* Taxa Condominial Total */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center select-none text-primary">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">Taxa Condominial Total</p>
                        <p className="text-[10px] text-on-surface-variant font-medium select-none">Valor base editável por unidade</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-on-surface-variant">R$</span>
                      <input 
                        type="number"
                        value={taxaCondominial}
                        onChange={(e) => setTaxaCondominial(Number(e.target.value))}
                        className="w-24 bg-white border border-outline-variant rounded-lg p-2 text-xs font-bold text-right text-primary focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Manutenção de Elevadores */}
                  <div className="flex flex-col bg-secondary/5 p-4 rounded-xl border-l-4 border-secondary select-none gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-secondary">Manutenção de Elevadores</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">Parcela exclusiva (RF043)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-lg font-black text-secondary">R$ {valorElevadores}</p>
                        <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-wider">24% da cota</p>
                      </div>
                    </div>
                    <div className="border-t border-secondary/10 pt-2 flex justify-end">
                      <a 
                        href={`/${programId}/vagas/caucao`}
                        className="text-[10px] text-secondary font-black hover:underline uppercase tracking-wider flex items-center gap-1"
                      >
                        Gerenciar Conta Caução
                        <span className="material-symbols-outlined text-[12px] leading-none">arrow_forward</span>
                      </a>
                    </div>
                  </div>

                  {/* Outras Despesas */}
                  <div className="flex items-center justify-between py-3 select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">Outras Despesas</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Energia, limpeza, pessoal</p>
                      </div>
                    </div>
                    <p className="font-heading font-bold text-xs text-primary">R$ {valorOutras}</p>
                  </div>
                </div>
              </div>

              {/* RF043.7: Documentação */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <h3 className="font-heading text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4 select-none">
                  RF043.7 Documentação
                </h3>

                {/* Upload Card */}
                <div 
                  onClick={handleSimulatedUpload}
                  className="border-2 border-dashed border-outline-variant/40 rounded-xl p-5 flex flex-col items-center justify-center text-center group hover:border-secondary hover:bg-secondary/5 transition-all cursor-pointer mb-5 select-none"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-secondary/15 group-hover:text-secondary transition-colors text-on-surface-variant">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-xs mb-1 text-primary">Contrato de Manutenção (60 meses)</p>
                  <p className="text-[10px] text-on-surface-variant px-2 leading-relaxed">
                    Arraste o arquivo PDF ou clique para selecionar do computador
                  </p>
                </div>

                {/* Lista de Arquivos */}
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl group select-none">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4.5 h-4.5 text-error shrink-0" />
                        <span className="text-xs font-bold text-primary truncate max-w-[170px]">{file.name}</span>
                      </div>
                      <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="text-on-surface-variant hover:text-primary p-1 bg-transparent border-none cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-on-surface-variant hover:text-error p-1 bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {uploadedFiles.length === 0 && (
                    <div className="text-center p-4 border border-slate-100 rounded-xl bg-slate-50 select-none">
                      <p className="text-[10px] text-on-surface-variant italic font-semibold">Nenhum contrato técnico anexado.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

    </div>
  );
}
