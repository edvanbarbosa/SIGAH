// =============================================================================
// app/[programId]/cadastro/[familiaId]/moradia/page.tsx
// Questionário de Condições de Moradia - Coabitação (Passo 2 de 4).
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
  Home,
  MessageSquare,
  Users,
  Settings,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Plus,
  Minus,
  Construction,
  AlertTriangle,
  ClipboardList
} from "lucide-react";

export default function QuestionarioMoradiaPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;
  const familiaId = params.familiaId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Questionário Respostas
  const [hasResidenciaFixa, setHasResidenciaFixa] = useState(true);
  const [recebeAluguelSocial, setRecebeAluguelSocial] = useState(false);
  const [hasCoabitacaoFamiliar, setHasCoabitacaoFamiliar] = useState(false);

  const [numComodos, setNumComodos] = useState(3);
  const [numDormitorios, setNumDormitorios] = useState(1);

  const [tipoConstrucao, setTipoConstrucao] = useState("Alvenaria");
  const [abastecimentoAgua, setAbastecimentoAgua] = useState("Rede geral");
  const [esgotamentoSanitario, setEsgotamentoSanitario] = useState("Rede geral de esgoto");

  const [observacoes, setObservacoes] = useState("");

  // Gravar e avançar
  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setToastMessage("Salvando questionário de moradia...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Condições de moradia registradas com sucesso!");
      setTimeout(() => {
        setToastMessage(null);
        // Avança para o passo de documentos ou perfil
        router.push(`/${programId}/cadastro/${familiaId}`);
      }, 1500);
    }, 1200);
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
          
          <main className="pt-24 px-4 md:p-10 max-w-4xl mx-auto w-full space-y-10">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Stepper Progress */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 select-none">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h1 className="font-headline font-black text-2xl text-primary tracking-tight">
                  Questionário de Condições de Moradia
                </h1>
                <span className="text-xs font-black text-secondary bg-blue-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  Passo 2 de 4
                </span>
              </div>

              {/* Progress bar (50%) */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div className="h-full bg-secondary w-1/2 transition-all duration-500 rounded-full"></div>
              </div>

              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                As informações coletadas são fundamentais para o diagnóstico habitacional e validação de benefícios do Governo Federal. Preencha com atenção.
              </p>
            </div>

            <form onSubmit={handleSaveAndContinue} className="space-y-8">
              
              {/* Seção 1: Situação de Moradia Atual */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 border-l-4 border-l-primary shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 select-none">
                  <Home className="text-primary w-5 h-5 shrink-0" />
                  <h2 className="font-headline font-black text-base text-primary uppercase tracking-wider">
                    Situação de Moradia Atual
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Pergunta 1: Residência Fixa */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Possui residência fixa?
                    </label>
                    <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/50 select-none">
                      <button
                        type="button"
                        onClick={() => setHasResidenciaFixa(true)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                          hasResidenciaFixa
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-primary bg-transparent"
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasResidenciaFixa(false)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                          !hasResidenciaFixa
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-primary bg-transparent"
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>

                  {/* Pergunta 2: Aluguel Social */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Recebe Aluguel Social?
                    </label>
                    <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/50 select-none">
                      <button
                        type="button"
                        onClick={() => setRecebeAluguelSocial(true)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                          recebeAluguelSocial
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-primary bg-transparent"
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecebeAluguelSocial(false)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                          !recebeAluguelSocial
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-primary bg-transparent"
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>

                  {/* Pergunta 3: Coabitação Familiar */}
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Possui coabitação familiar?
                    </label>
                    <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/50 select-none">
                      <button
                        type="button"
                        onClick={() => setHasCoabitacaoFamiliar(true)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                          hasCoabitacaoFamiliar
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-primary bg-transparent"
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasCoabitacaoFamiliar(false)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                          !hasCoabitacaoFamiliar
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-primary bg-transparent"
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>

                </div>
              </section>

              {/* Seção 2: Características do Domicílio */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 border-l-4 border-l-secondary shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 select-none">
                  <Construction className="text-secondary w-5 h-5 shrink-0" />
                  <h2 className="font-headline font-black text-base text-primary uppercase tracking-wider">
                    Características do Domicílio
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Stepper 1: Cômodos */}
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Número total de cômodos
                    </label>
                    <div className="flex items-center gap-4 select-none">
                      <button
                        type="button"
                        onClick={() => setNumComodos(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={numComodos}
                        onChange={(e) => setNumComodos(Math.max(1, Number(e.target.value)))}
                        className="w-16 text-center font-black text-lg bg-transparent border-none focus:ring-0 outline-none border-b-2 border-slate-350"
                      />
                      <button
                        type="button"
                        onClick={() => setNumComodos(prev => prev + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stepper 2: Dormitórios */}
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Número de dormitórios
                    </label>
                    <div className="flex items-center gap-4 select-none">
                      <button
                        type="button"
                        onClick={() => setNumDormitorios(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={numDormitorios}
                        onChange={(e) => setNumDormitorios(Math.max(1, Number(e.target.value)))}
                        className="w-16 text-center font-black text-lg bg-transparent border-none focus:ring-0 outline-none border-b-2 border-slate-350"
                      />
                      <button
                        type="button"
                        onClick={() => setNumDormitorios(prev => prev + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Select 1: Construção */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Tipo de construção
                    </label>
                    <select
                      value={tipoConstrucao}
                      onChange={(e) => setTipoConstrucao(e.target.value)}
                      className="w-full bg-slate-100 border-none border-b-2 border-[#001e40] focus:ring-0 p-3 text-xs font-bold rounded-t-lg text-primary focus:border-secondary transition-all"
                    >
                      <option value="Alvenaria">Alvenaria</option>
                      <option value="Madeira">Madeira</option>
                      <option value="Material reaproveitado">Material reaproveitado</option>
                      <option value="Palha/Pau-a-pique">Palha/Pau-a-pique</option>
                    </select>
                  </div>

                  {/* Select 2: Abastecimento de Água */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Abastecimento de água
                    </label>
                    <select
                      value={abastecimentoAgua}
                      onChange={(e) => setAbastecimentoAgua(e.target.value)}
                      className="w-full bg-slate-100 border-none border-b-2 border-[#001e40] focus:ring-0 p-3 text-xs font-bold rounded-t-lg text-primary focus:border-secondary transition-all"
                    >
                      <option value="Rede geral">Rede geral</option>
                      <option value="Poço ou Nascente">Poço ou Nascente</option>
                      <option value="Caminhão pipa">Caminhão pipa</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  {/* Select 3: Esgotamento */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider select-none">
                      Esgotamento sanitário
                    </label>
                    <select
                      value={esgotamentoSanitario}
                      onChange={(e) => setEsgotamentoSanitario(e.target.value)}
                      className="w-full bg-slate-100 border-none border-b-2 border-[#001e40] focus:ring-0 p-3 text-xs font-bold rounded-t-lg text-primary focus:border-secondary transition-all"
                    >
                      <option value="Rede geral de esgoto">Rede geral de esgoto</option>
                      <option value="Fossa séptica">Fossa séptica</option>
                      <option value="Fossa rudimentar">Fossa rudimentar</option>
                      <option value="Direto para vala/rio">Direto para vala/rio</option>
                    </select>
                  </div>

                </div>
              </section>

              {/* Seção 3: Observações */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 border-l-4 border-l-amber-600 shadow-sm space-y-4">
                <div className="flex items-center gap-3 select-none">
                  <AlertTriangle className="text-amber-600 w-5 h-5 shrink-0" />
                  <h2 className="font-headline font-black text-base text-primary uppercase tracking-wider">
                    Observações Adicionais
                  </h2>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider select-none leading-relaxed">
                  Descreva qualquer condição de precariedade extrema, risco de desabamento ou outras situações não listadas acima.
                </p>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full bg-slate-100 border-none border-b-2 border-amber-600 focus:ring-0 p-4 text-xs font-bold rounded-t-lg text-primary focus:border-secondary transition-all resize-none outline-none"
                  placeholder="Ex: Goteiras frequentes, risco em encostas, falta de ventilação..."
                  rows={4}
                ></textarea>
              </section>

              {/* Botões de Ação */}
              <div className="flex flex-col md:flex-row gap-4 pt-6 select-none">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-grow py-4 px-8 rounded-xl font-black text-xs uppercase tracking-wider bg-primary text-white hover:brightness-110 active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Salvar e Continuar</span>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/${programId}/cadastro/${familiaId}`)}
                  className="py-4 px-8 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer active:scale-95 transition-all bg-transparent font-sans"
                >
                  Voltar para Cadastro de Família
                </button>
              </div>

            </form>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

    </div>
  );
}
