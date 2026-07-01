// =============================================================================
// app/[programId]/vistorias/chamado/page.tsx
// Novo Chamado de Manutenção - Padronizado (Passo 25.1).
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
  ArrowLeft,
  Gavel,
  CloudUpload,
  Camera,
  Trash2,
  Send,
  Info,
  CheckCircle,
  X,
  Loader2,
  Calendar,
  Home,
  Wrench,
  AlertTriangle,
  ClipboardList
} from "lucide-react";

export default function NovoChamadoManutencaoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(
    "Formulário RF082 pronto para envio. Verifique os anexos antes de confirmar."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problemType, setProblemType] = useState("");
  const [identifiedDate, setIdentifiedDate] = useState("");
  const [description, setDescription] = useState("");

  // Imagens Anexadas
  const [attachedFiles, setAttachedFiles] = useState<string[]>([
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB_XuRzNiA89zovaztsJSOCJNQnV0Y7WyB65tWkVm4nloe3hlTW9DxaK74N5GG6wsbabUtIA-WRx9TtSzhC8OR5DF7AXXnat2Uw5F6SkDVJ6r4qn_6-eX5Cgysiz-LZfP2X7Ut_THbrftZIFOmiQpkdaDMlsJ5GWLOY1Lza2TycUawDncoar7AZFUdWuzuV5I7Xs-eUdv-A6SrjU24rk2qUcO2FNMjtGCVQLbPaq7mya3MgHw_10Xm3zocVNmFceXtaD3_E9aKnVtE"
  ]);

  // Simular upload de arquivo
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setToastMessage(`Carregando imagem: ${file.name}...`);
    setTimeout(() => {
      // Adiciona imagem mockada
      setAttachedFiles(prev => [...prev, "https://lh3.googleusercontent.com/aida-public/AB6AXuB_XuRzNiA89zovaztsJSOCJNQnV0Y7WyB65tWkVm4nloe3hlTW9DxaK74N5GG6wsbabUtIA-WRx9TtSzhC8OR5DF7AXXnat2Uw5F6SkDVJ6r4qn_6-eX5Cgysiz-LZfP2X7Ut_THbrftZIFOmiQpkdaDMlsJ5GWLOY1Lza2TycUawDncoar7AZFUdWuzuV5I7Xs-eUdv-A6SrjU24rk2qUcO2FNMjtGCVQLbPaq7mya3MgHw_10Xm3zocVNmFceXtaD3_E9aKnVtE"]);
      setToastMessage("Foto anexada com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  // Remover Imagem
  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== index));
    setToastMessage("Anexo removido do chamado.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Enviar Chamado
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemType || !identifiedDate || !description) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Chamado técnico cadastrado com sucesso! Protocolo #82109 gerado.");
      
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/vistorias`);
      }, 2000);
    }, 1500);
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
          
          <main className="pt-24 px-4 md:p-10 max-w-5xl mx-auto w-full lg:flex gap-8">
            
            {/* Sidebar de Contexto Interno (Secretaria de Habitação) */}
            <aside className="hidden lg:flex flex-col w-72 shrink-0 space-y-6">
              
              <div className="bg-slate-100 rounded-2xl p-6 flex flex-col gap-2 border border-slate-200 select-none">
                <div className="mb-6">
                  <h3 className="text-on-surface font-headline font-black text-base">Secretaria de Habitação</h3>
                  <p className="text-on-surface-variant text-[10px] font-semibold mt-0.5">Gestor Técnico • v1.0.2</p>
                </div>
                
                <a 
                  href={`/${programId}/vistorias`}
                  className="flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-slate-200 rounded-xl transition-all font-semibold text-xs uppercase tracking-wider"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Painel de Vistorias</span>
                </a>
                <a 
                  href="#"
                  className="flex items-center gap-4 text-secondary font-black bg-transparent border-l-4 border-secondary py-3 px-6 rounded-r-lg font-sans text-xs uppercase tracking-wider"
                >
                  <Wrench className="w-5 h-5 text-secondary" />
                  <span>Chamados de Obra</span>
                </a>
                <a 
                  href={`/${programId}/vistorias/checklist-nbr`}
                  className="flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-slate-200 rounded-xl transition-all font-semibold text-xs uppercase tracking-wider"
                >
                  <ClipboardList className="w-5 h-5" />
                  <span>Checklists NBR</span>
                </a>
              </div>

              {/* Card de Aviso de Garantia (NBR 15575) */}
              <div className="p-6 bg-[#592300] rounded-2xl border-l-4 border-amber-600 text-white select-none shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-orange-100">
                  <Gavel className="w-5 h-5 text-orange-200 shrink-0" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider">Aviso de Garantia</span>
                </div>
                <p className="text-orange-200 text-xs leading-relaxed font-semibold">
                  Chamados para vícios aparentes devem ser realizados em até 90 dias após a entrega. Para vícios ocultos, o prazo é de 5 anos para estrutura e impermeabilização conforme NBR 15575.
                </p>
              </div>

            </aside>

            {/* Form Section */}
            <section className="flex-1 space-y-8">
              
              <header className="select-none">
                <button 
                  onClick={() => router.push(`/${programId}/vistorias`)}
                  className="flex items-center gap-2 text-secondary mb-3 border-none bg-transparent hover:underline cursor-pointer font-black text-[10px] uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 text-secondary shrink-0" />
                  <span>Voltar ao Painel</span>
                </button>
                <h2 className="font-heading text-3xl font-black text-primary tracking-tight">
                  Abertura de Chamado Técnico
                </h2>
                <p className="text-slate-500 text-xs mt-2 max-w-2xl font-semibold leading-relaxed">
                  Utilize este formulário para reportar problemas estruturais ou de acabamento (RF082/RF083). Certifique-se de anexar evidências fotográficas claras para agilizar a triagem.
                </p>
              </header>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Top Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Tipo de Problema */}
                    <div className="space-y-2 select-none">
                      <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">
                        Tipo de Problema
                      </label>
                      <select 
                        required
                        value={problemType}
                        onChange={(e) => setProblemType(e.target.value)}
                        className="w-full bg-slate-50 border-none border-b-2 border-primary focus:ring-0 text-xs font-bold text-slate-700 h-12 px-4 rounded-t-lg transition-all"
                      >
                        <option value="" disabled>Selecione a categoria</option>
                        <option value="eletrica">Instalações Elétricas</option>
                        <option value="hidraulica">Instalações Hidráulicas</option>
                        <option value="estrutura">Estrutura e Alvenaria</option>
                        <option value="revestimento">Revestimentos e Acabamentos</option>
                        <option value="outros">Outros Vícios</option>
                      </select>
                    </div>

                    {/* Data de Identificação */}
                    <div className="space-y-2 select-none">
                      <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">
                        Data de Identificação
                      </label>
                      <input 
                        type="date"
                        required
                        value={identifiedDate}
                        onChange={(e) => setIdentifiedDate(e.target.value)}
                        className="w-full bg-slate-50 border-none border-b-2 border-primary focus:ring-0 text-xs font-bold text-slate-700 h-12 px-4 rounded-t-lg transition-all"
                      />
                    </div>

                  </div>

                  {/* Descrição Detalhada */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider select-none">
                      Descrição Detalhada do Vício
                    </label>
                    <textarea 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border-none border-b-2 border-primary focus:ring-0 text-xs font-bold text-slate-700 p-4 rounded-t-lg min-h-[120px] transition-all"
                      placeholder="Descreva com precisão o problema identificado, local exato e circunstâncias da ocorrência..."
                      rows={5}
                    ></textarea>
                  </div>

                  {/* Upload Area */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider select-none">
                      Upload de Fotos e Evidências
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Dropzone Style */}
                      <div className="col-span-full border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors select-none relative">
                        <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-3 shrink-0" />
                        <label className="text-xs font-black text-slate-700 cursor-pointer block hover:underline">
                          Arraste fotos ou clique para selecionar
                          <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={handleUploadFile}
                            accept="image/*,.pdf" 
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">Formatos suportados: JPG, PNG, PDF (Máx 10MB)</p>
                      </div>

                      {/* Preview Placeholders */}
                      {attachedFiles.map((url, idx) => (
                        <div key={idx} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                          <img 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover opacity-80" 
                            src={url} 
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <button 
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="text-white bg-transparent border-none cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-[#001e40] px-2 py-0.5 rounded text-[8px] text-white font-black">
                            FOTO_{String(idx + 1).padStart(2, "0")}.JPG
                          </div>
                        </div>
                      ))}

                      {/* Caixa para Adicionar Mais */}
                      <label className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-[#0059bb] hover:border-[#0059bb] cursor-pointer transition-colors select-none">
                        <Camera className="w-6 h-6 shrink-0" />
                        <span className="text-[9px] font-black mt-2 uppercase tracking-wider">ADICIONAR</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleUploadFile}
                          accept="image/*" 
                        />
                      </label>

                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Info className="w-4 h-4 text-secondary shrink-0" />
                      <span className="text-[10px] font-bold">Ao enviar, você declara que as informações são verídicas.</span>
                    </div>

                    <div className="flex gap-4 w-full sm:w-auto">
                      <button 
                        type="button"
                        onClick={() => router.push(`/${programId}/vistorias`)}
                        className="flex-1 sm:flex-none px-8 py-3 rounded-xl border border-slate-350 text-slate-650 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer bg-transparent"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-10 py-3 rounded-xl bg-primary hover:bg-[#003366] text-white font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border-none cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <>
                            <span>Enviar Chamado</span>
                            <Send className="w-4 h-4 text-white shrink-0" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </form>
              </div>

            </section>

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
          href={`/${programId}/vistorias`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Wrench className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Chamados</span>
        </a>
        <a 
          href={`/${programId}/vistorias/checklist-nbr`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Normas</span>
        </a>
      </nav>

      {/* ==========================================
          SUCCESS FLOATING TOAST (Mockup state)
          ========================================== */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-10 right-6 z-50 flex items-center gap-4 bg-[#001e40] text-white py-3.5 px-6 rounded-2xl shadow-2xl animate-bounce max-w-sm">
          <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
          <div className="text-left select-none">
            <p className="text-xs font-black uppercase tracking-wider">Formulário RF082 pronto.</p>
            <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Verifique os anexos antes de confirmar.</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="border-none bg-transparent cursor-pointer text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
