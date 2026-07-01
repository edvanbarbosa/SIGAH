// =============================================================================
// app/[programId]/entregas/page.tsx
// Tela de Entrega de Chaves (Termo de Recebimento).
// Baseada fielmente na tela correspondente do projeto "DESIGN SIGAH" no Stitch.
// =============================================================================

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  ChevronRight, 
  CheckSquare, 
  MapPin, 
  Maximize2, 
  Key, 
  Headphones, 
  FileText, 
  Fingerprint, 
  CheckCircle,
  HelpCircle,
  FileCheck,
  Home,
  Users,
  Percent,
  Settings
} from "lucide-react";

export default function EntregaChavesPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Referência do Canvas para a assinatura digital
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [signatureLocked, setSignatureLocked] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Inicializa o canvas de desenho
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#001e40"; // primary color
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
  }, []);

  // Iniciar desenho
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (signatureLocked) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Desenhar no canvas
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  // Finalizar desenho
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Limpar a assinatura do canvas
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSignatureLocked(false);
  };

  // Bloqueia assinatura digital
  const lockSignature = () => {
    if (!hasSigned) {
      setNotification("Por favor, faça um traço de assinatura no quadro antes de assinar digitalmente.");
      return;
    }
    setSignatureLocked(true);
    setNotification("Assinatura digitalizada e vinculada com sucesso!");
    setTimeout(() => setNotification(null), 3000);
  };

  // Visualizar PDF Termo
  const handleViewPDF = () => {
    setNotification("Gerando visualização em PDF do Termo de Recebimento...");
    setTimeout(() => {
      setNotification(null);
      alert("Laudo RF070 - Termo de Recebimento de Chaves exportado com sucesso.");
    }, 1000);
  };

  // Confirmar Chaves
  const handleConfirmDelivery = () => {
    if (!signatureLocked) {
      setNotification("Você precisa assinar digitalmente e travar a assinatura no botão 'Assinar Digitalmente' antes de confirmar a entrega.");
      return;
    }
    setNotification("Processo finalizado! A entrega das chaves da unidade 402-B foi devidamente homologada e registrada no SIGAH.");
    setTimeout(() => setNotification(null), 6000);
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
            
            {/* Mensagem de Feedback */}
            {notification && (
              <div className={`p-4 rounded-xl flex items-start gap-3 shadow-md border-l-4 animate-fade-in ${
                notification.includes("sucesso") || notification.includes("finalizado")
                  ? "bg-green-50 text-green-800 border-green-600"
                  : "bg-amber-50 text-amber-800 border-amber-600"
              }`}>
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  notification.includes("sucesso") || notification.includes("finalizado") ? "text-green-600" : "text-amber-600"
                }`} />
                <div>
                  <h4 className="font-bold text-sm">Formalização de Chaves</h4>
                  <p className="text-xs">{notification}</p>
                </div>
              </div>
            )}

            {/* Cabeçalho da Página com Breadcrumb */}
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest select-none">
                <span>Entregas</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-primary font-black">RF070</span>
              </nav>
              <div className="space-y-1">
                <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                  Termo de Recebimento
                </h2>
                <p className="text-on-surface-variant text-sm sm:text-base max-w-2xl">
                  Finalize o processo de ocupação através da formalização do recebimento das chaves e aceite das condições estruturais do imóvel.
                </p>
              </div>
            </div>

            {/* Unidade Status Badge */}
            <section className="mb-6">
              <div className="inline-flex items-center bg-secondary/10 border-l-4 border-secondary px-6 py-4 rounded-r-xl gap-4 select-none">
                <div className="p-2 bg-secondary rounded-lg shrink-0">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none mb-1">
                    Status da Unidade
                  </p>
                  <p className="text-base font-bold text-primary">Aprovado na Vistoria</p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Coluna Esquerda: Resumo do Imóvel & Suporte */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Resumo do Imóvel Card */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6">
                    Resumo do Imóvel
                  </h3>
                  
                  {/* Foto do Interior */}
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6 border border-outline-variant/10">
                    <img 
                      alt="Apartment interior" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91zc-M9JH-D07V6PDK9Im44yNGWnC9VEB9gR95Uy4FFt0pyanKWaf5Ngs03BvcB1u1Rrk_vkcx0_2TPKjuZpOQEfintA3qHz3SdXx3SvXkwclOFeYLmlIA7U1YZMPvEZxxXaWudXQ1VDInYvQx-UcHzynH9Ob8lND6kLwZ7xuoIj0wCXP-8Bh9lMKJ3kFgZpxBi5EStFO-2MfiwXzSEMPpErI8sZQbQmZbW_R6eyqEULOG7l2D2dgkw1a1mOd_xezvNL5RqU65gA"
                    />
                    <div className="absolute top-4 right-4 bg-primary px-3 py-1.5 rounded-lg text-white text-[10px] font-black tracking-widest shadow-lg">
                      UNIDADE 402-B
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="space-y-6 text-sm">
                    <div className="flex items-start gap-4">
                      <MapPin className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Endereço</p>
                        <p className="font-semibold text-primary">Residencial Esplanada, Bloco B</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Maximize2 className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Área Total</p>
                        <p className="font-semibold text-primary">58,50 m²</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Key className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Conjunto de Chaves</p>
                        <p className="font-semibold text-primary">03 unidades (Principal, Reserva, Portaria)</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Suporte ao Beneficiário (Primary style) */}
                <section className="bg-primary p-8 rounded-xl shadow-lg text-white space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-3">
                    <Headphones className="w-5 h-5 text-white" />
                    Suporte ao Beneficiário
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Caso encontre divergências físicas não relatadas no laudo, entre em contato imediatamente com nossa equipe técnica.
                  </p>
                  <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-xs transition-colors cursor-pointer text-white">
                    Abrir Chamado Técnico
                  </button>
                </section>

              </div>

              {/* Coluna Direita: Declaração & Assinatura */}
              <div className="lg:col-span-8 space-y-8">
                
                <section className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center shrink-0">
                      <FileText className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Declaração de Aceite</h3>
                  </div>

                  {/* Lista de Termos */}
                  <div className="text-on-surface-variant text-sm leading-relaxed mb-10">
                    <p className="mb-6 font-medium">Eu, na qualidade de beneficiário do programa de gestão habitacional, declaro para os devidos fins que:</p>
                    
                    <ul className="space-y-6">
                      <li className="flex gap-4 items-start">
                        <CheckCircle className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                        <span>
                          Recebi nesta data as chaves da unidade habitacional acima descrita, encontrando-se a mesma em perfeito estado de conservação, conforme laudo de vistoria prévia aprovado em <strong>14/10/2023</strong>.
                        </span>
                      </li>
                      <li className="flex gap-4 items-start">
                        <CheckCircle className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                        <span>
                          Assumo total responsabilidade pela guarda, conservação e manutenção do imóvel a partir desta data, comprometendo-me a zelar pelo patrimônio público.
                        </span>
                      </li>
                      <li className="flex gap-4 items-start">
                        <CheckCircle className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                        <span>
                          Estou ciente das normas do regimento interno do condomínio e das obrigações contratuais inerentes à posse do imóvel.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Assinatura Digital do Beneficiário */}
                  <div className="pt-10 border-t border-outline-variant/10">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        Assinatura Digital do Beneficiário
                      </h4>
                      {hasSigned && (
                        <button 
                          onClick={clearSignature}
                          className="text-xs text-red-600 font-bold hover:underline cursor-pointer border-none bg-transparent"
                        >
                          Limpar Canvas
                        </button>
                      )}
                    </div>

                    {/* Canvas de Assinatura Interativo */}
                    <div className="relative w-full h-48 border-2 border-dashed border-outline-variant/40 rounded-2xl overflow-hidden bg-slate-50/50 group">
                      {/* Grid pontilhado */}
                      <div className="absolute inset-0 signature-pad pointer-events-none opacity-40 z-0"></div>
                      
                      {/* O Canvas propriamente dito */}
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={192}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className={`absolute inset-0 w-full h-full z-10 touch-none ${
                          signatureLocked ? "cursor-not-allowed" : "cursor-crosshair"
                        }`}
                      ></canvas>

                      {/* Texto Instrucional */}
                      {!hasSigned && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-0">
                          <Fingerprint className="text-outline-variant group-hover:scale-110 transition-transform w-12 h-12" />
                          <p className="text-xs text-on-surface-variant/60 font-semibold">
                            Clique/toque aqui e desenhe sua assinatura
                          </p>
                        </div>
                      )}

                      {signatureLocked && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center gap-2 z-20 select-none">
                          <FileCheck className="w-6 h-6 text-green-600" />
                          <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
                            Assinatura Digitalizada Concluída
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-8">
                      <button 
                        onClick={lockSignature}
                        disabled={signatureLocked}
                        className={`px-8 py-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer border-none ${
                          signatureLocked
                            ? "bg-green-600 text-white cursor-not-allowed opacity-80"
                            : "bg-secondary text-white hover:scale-[1.02] shadow-secondary/15"
                        }`}
                      >
                        <Fingerprint className="w-4 h-4" />
                        {signatureLocked ? "Assinado Digitalmente" : "Assinar Digitalmente"}
                      </button>
                    </div>

                  </div>
                </section>

                {/* Ações Finais (PDF e Confirmação de Entrega) */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                  <button 
                    onClick={handleViewPDF}
                    className="w-full md:w-auto px-8 py-4 text-secondary font-bold text-xs hover:bg-secondary/10 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                  >
                    Visualizar PDF do Termo
                  </button>
                  
                  <button 
                    onClick={handleConfirmDelivery}
                    className="w-full md:w-auto px-12 py-5 bg-primary hover:shadow-xl hover:shadow-primary/10 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-4 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer border-none"
                  >
                    Confirmar Recebimento das Chaves
                    <Key className="w-4 h-4 text-white shrink-0" />
                  </button>
                </div>

              </div>

            </div>

          </main>

          {/* 5. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/95 dark:bg-[#001e40]/95 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/vistorias`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Vistorias</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Percent className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
        </a>
        <a 
          href={`/${programId}/entregas`}
          className="flex flex-col items-center justify-center text-[#0059bb] dark:text-[#0070ea] scale-110"
        >
          <Key className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Entregas</span>
        </a>
      </nav>

    </div>
  );
}
