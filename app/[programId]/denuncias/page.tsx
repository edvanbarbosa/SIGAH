// =============================================================================
// app/[programId]/denuncias/page.tsx
// Tela de Denúncia de Irregularidade (Passo 16.1).
// Baseada fielmente na tela correspondente do projeto "DESIGN SIGAH" no Stitch.
// =============================================================================

"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  EyeOff, 
  Info, 
  MapPin, 
  AlertTriangle, 
  Upload, 
  Send, 
  Trash2, 
  CheckCircle,
  Home,
  CheckSquare,
  Percent,
  Key
} from "lucide-react";

interface UploadedFile {
  name: string;
  size: string;
}

export default function DenunciaIrregularidadePage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados do Formulário
  const [reportType, setReportType] = useState<"anonimo" | "identificado">("anonimo");
  const [reporterName, setReporterName] = useState("");
  const [reporterCpf, setReporterCpf] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");

  const [residencial, setResidencial] = useState("");
  const [blocoQuadra, setBlocoQuadra] = useState("");
  const [aptCasa, setAptCasa] = useState("");

  const [natureza, setNatureza] = useState("aluguel");
  const [descricao, setDescricao] = useState("");

  // Estado de arquivos anexados
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);

  // Estado de Notificação
  const [notification, setNotification] = useState<string | null>(null);

  // Manipulador de upload de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
      setNotification(`${newFiles.length} arquivo(s) anexado(s) com sucesso.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Remover arquivo da lista
  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Envio do Relato
  const handleSubmitDenuncia = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!residencial || residencial === "Selecione o Residencial") {
      setNotification("Por favor, selecione a unidade habitacional alvo.");
      return;
    }
    if (!blocoQuadra || !aptCasa) {
      setNotification("Por favor, preencha o bloco e o apartamento da unidade habitacional alvo.");
      return;
    }
    if (!descricao.trim()) {
      setNotification("Por favor, descreva detalhadamente os fatos observados.");
      return;
    }

    if (reportType === "identificado") {
      if (!reporterName.trim() || !reporterCpf.trim()) {
        setNotification("Por favor, informe seu nome e CPF para realizar o relato identificado.");
        return;
      }
    }

    // Sucesso
    const randomProtocol = `DN-${Math.floor(100000 + Math.random() * 900000)}`;
    setNotification(`Denúncia enviada com sucesso! Protocolo gerado: #${randomProtocol}. Agradecemos sua colaboração.`);
    
    // Reseta formulário
    setReporterName("");
    setReporterCpf("");
    setReporterPhone("");
    setResidencial("");
    setBlocoQuadra("");
    setAptCasa("");
    setDescricao("");
    setAttachedFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setNotification(null);
    }, 8000);
  };

  // Limpar Formulário
  const handleResetForm = () => {
    setReporterName("");
    setReporterCpf("");
    setReporterPhone("");
    setResidencial("");
    setBlocoQuadra("");
    setAptCasa("");
    setDescricao("");
    setAttachedFiles([]);
    setNotification("Formulário limpo com sucesso.");
    setTimeout(() => setNotification(null), 2000);
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
          
          <main className="w-full max-w-xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-6">
            
            {/* Banner de Feedback */}
            {notification && (
              <div className={`p-4 rounded-xl flex items-start gap-3 shadow-md border-l-4 animate-fade-in ${
                notification.includes("sucesso")
                  ? "bg-green-50 text-green-800 border-green-600"
                  : notification.includes("limpo") || notification.includes("anexado")
                  ? "bg-blue-50 text-blue-800 border-blue-600"
                  : "bg-amber-50 text-amber-800 border-amber-600"
              }`}>
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  notification.includes("sucesso") ? "text-green-600" : notification.includes("limpo") || notification.includes("anexado") ? "text-blue-600" : "text-amber-600"
                }`} />
                <div>
                  <h4 className="font-bold text-sm">Canal de Denúncias</h4>
                  <p className="text-xs">{notification}</p>
                </div>
              </div>
            )}

            {/* Hero Section estilo marinho */}
            <section className="bg-primary-container p-6 rounded-xl text-white shadow-lg overflow-hidden relative select-none">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-secondary rounded-full opacity-10 blur-2xl"></div>
              <h2 className="text-2xl font-extrabold mb-3">Denúncia de Irregularidade</h2>
              <p className="text-xs text-white/70 leading-relaxed mb-6 font-medium">
                Sua colaboração é fundamental para garantir que as habitações sociais cheguem a quem realmente precisa. Relate suspeitas de irregularidades de forma segura.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-secondary-fixed w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Protocolo seguro e criptografado</span>
                </div>
                <div className="flex items-center gap-3">
                  <EyeOff className="text-secondary-fixed w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Opção de anonimato garantida</span>
                </div>
              </div>
            </section>

            {/* Card de Critérios explicativos */}
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 select-none">
              <h3 className="font-bold text-primary-container text-xs uppercase tracking-wider mb-3">
                Critérios de Irregularidade
              </h3>
              <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                <li className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>Venda ou aluguel de imóveis não quitados.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>Imóveis abandonados ou sem uso residencial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>Uso do imóvel para fins comerciais ou ilícitos.</span>
                </li>
              </ul>
            </div>

            {/* Formulário Principal */}
            <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
              <form onSubmit={handleSubmitDenuncia} className="space-y-8">
                
                {/* 1. Tipo de Relato Toggle */}
                <div className="flex flex-col gap-3 p-4 bg-surface-container-low rounded-lg">
                  <div className="select-none">
                    <p className="font-bold text-primary-container text-xs uppercase tracking-wider">Tipo de Relato</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Escolha como deseja se identificar</p>
                  </div>
                  <div className="flex bg-surface-container-high p-1 rounded-full w-full">
                    <button 
                      type="button"
                      onClick={() => setReportType("anonimo")}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border-none ${
                        reportType === "anonimo" 
                          ? "bg-secondary text-white shadow-sm" 
                          : "text-on-surface-variant hover:text-primary bg-transparent"
                      }`}
                    >
                      Anônimo
                    </button>
                    <button 
                      type="button"
                      onClick={() => setReportType("identificado")}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border-none ${
                        reportType === "identificado" 
                          ? "bg-secondary text-white shadow-sm" 
                          : "text-on-surface-variant hover:text-primary bg-transparent"
                      }`}
                    >
                      Identificado
                    </button>
                  </div>
                </div>

                {/* Campos de identificação condicional */}
                {reportType === "identificado" && (
                  <div className="space-y-4 p-4 border border-outline-variant/20 rounded-lg animate-fade-in bg-slate-50/50">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block px-1">
                        Nome Completo
                      </label>
                      <input 
                        type="text" 
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Informe seu nome"
                        className="w-full bg-white border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none py-3 px-4 text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block px-1">
                          CPF
                        </label>
                        <input 
                          type="text" 
                          value={reporterCpf}
                          onChange={(e) => setReporterCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full bg-white border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none py-3 px-4 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block px-1">
                          Telefone
                        </label>
                        <input 
                          type="text" 
                          value={reporterPhone}
                          onChange={(e) => setReporterPhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="w-full bg-white border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none py-3 px-4 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Unidade Alvo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 select-none">
                    <MapPin className="text-primary-container w-4.5 h-4.5" />
                    <h3 className="font-bold text-primary-container uppercase text-xs tracking-wider">Unidade Alvo</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest px-1 block">
                        Residencial
                      </label>
                      <select 
                        value={residencial}
                        onChange={(e) => setResidencial(e.target.value)}
                        className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg text-xs font-semibold"
                      >
                        <option value="">Selecione o Residencial</option>
                        <option value="Solar da Alvorada">Solar da Alvorada</option>
                        <option value="Vila dos Pássaros">Vila dos Pássaros</option>
                        <option value="Residencial Esperança">Residencial Esperança</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest px-1 block">
                          Bloco / Quadra
                        </label>
                        <input 
                          type="text" 
                          value={blocoQuadra}
                          onChange={(e) => setBlocoQuadra(e.target.value)}
                          placeholder="Ex: Bloco B"
                          className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest px-1 block">
                          Apt / Casa
                        </label>
                        <input 
                          type="text" 
                          value={aptCasa}
                          onChange={(e) => setAptCasa(e.target.value)}
                          placeholder="Ex: Apt 102"
                          className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Natureza da Irregularidade (Radio tiles) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 select-none">
                    <AlertTriangle className="text-primary-container w-4.5 h-4.5" />
                    <h3 className="font-bold text-primary-container uppercase text-xs tracking-wider">Natureza da Irregularidade</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Venda Ilegal */}
                    <button
                      type="button"
                      onClick={() => setNatureza("venda")}
                      className={`w-full flex items-center p-4 border-2 rounded-xl text-left cursor-pointer transition-all duration-300 ${
                        natureza === "venda"
                          ? "border-secondary bg-secondary/5"
                          : "border-outline-variant/30 bg-transparent hover:bg-surface-container-high"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="natureza"
                        checked={natureza === "venda"}
                        readOnly
                        className="text-secondary focus:ring-secondary w-4 h-4 mr-4 shrink-0" 
                      />
                      <div>
                        <p className="font-bold text-xs text-on-surface">Venda Ilegal</p>
                        <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">Comercialização do imóvel sem quitação</p>
                      </div>
                    </button>

                    {/* Aluguel Irregular */}
                    <button
                      type="button"
                      onClick={() => setNatureza("aluguel")}
                      className={`w-full flex items-center p-4 border-2 rounded-xl text-left cursor-pointer transition-all duration-300 ${
                        natureza === "aluguel"
                          ? "border-secondary bg-secondary/5"
                          : "border-outline-variant/30 bg-transparent hover:bg-surface-container-high"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="natureza"
                        checked={natureza === "aluguel"}
                        readOnly
                        className="text-secondary focus:ring-secondary w-4 h-4 mr-4 shrink-0" 
                      />
                      <div>
                        <p className="font-bold text-xs text-on-surface">Aluguel Irregular</p>
                        <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">Sublocação da unidade habitacional</p>
                      </div>
                    </button>

                    {/* Abandono */}
                    <button
                      type="button"
                      onClick={() => setNatureza("abandono")}
                      className={`w-full flex items-center p-4 border-2 rounded-xl text-left cursor-pointer transition-all duration-300 ${
                        natureza === "abandono"
                          ? "border-secondary bg-secondary/5"
                          : "border-outline-variant/30 bg-transparent hover:bg-surface-container-high"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="natureza"
                        checked={natureza === "abandono"}
                        readOnly
                        className="text-secondary focus:ring-secondary w-4 h-4 mr-4 shrink-0" 
                      />
                      <div>
                        <p className="font-bold text-xs text-on-surface">Abandono</p>
                        <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">Unidade desabitada há longo período</p>
                      </div>
                    </button>

                    {/* Uso Comercial */}
                    <button
                      type="button"
                      onClick={() => setNatureza("comercial")}
                      className={`w-full flex items-center p-4 border-2 rounded-xl text-left cursor-pointer transition-all duration-300 ${
                        natureza === "comercial"
                          ? "border-secondary bg-secondary/5"
                          : "border-outline-variant/30 bg-transparent hover:bg-surface-container-high"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="natureza"
                        checked={natureza === "comercial"}
                        readOnly
                        className="text-secondary focus:ring-secondary w-4 h-4 mr-4 shrink-0" 
                      />
                      <div>
                        <p className="font-bold text-xs text-on-surface">Uso Comercial</p>
                        <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">Imóvel sendo usado como ponto de comércio</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Descrição detalhada */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest px-1 block">
                    Descrição Detalhada
                  </label>
                  <textarea 
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={4}
                    placeholder="Descreva os fatos observados, datas aproximadas e outros detalhes relevantes..."
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg resize-none text-xs font-semibold"
                  ></textarea>
                </div>

                {/* 5. Upload Area */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest px-1 block">
                    Evidências (Fotos/Documentos)
                  </label>
                  
                  {/* Div de arrastar e clicar */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer select-none"
                  >
                    <Upload className="w-8 h-8 text-secondary mb-2 shrink-0" />
                    <p className="font-bold text-xs text-primary-container">Clique para fazer upload ou arraste</p>
                    <p className="text-[9px] text-on-surface-variant mt-1 text-center font-medium">
                      Formatos suportados: JPG, PNG, PDF (Máx. 10MB)
                    </p>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                  />

                  {/* Listagem de arquivos anexados */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2 p-3 bg-slate-50 border border-outline-variant/10 rounded-lg">
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                        Arquivos Anexados ({attachedFiles.length})
                      </p>
                      <div className="divide-y divide-outline-variant/10">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 text-xs">
                            <span className="font-semibold text-primary truncate max-w-[200px]">{file.name}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[9px] text-on-surface-variant/60 font-semibold">{file.size}</span>
                              <button 
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="text-red-600 hover:text-red-800 transition-colors cursor-pointer border-none bg-transparent"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações do Formulário */}
                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-primary-container text-white py-4 rounded-xl font-bold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-none cursor-pointer tracking-wider"
                  >
                    <Send className="w-4 h-4 text-white" />
                    Enviar Denúncia
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleResetForm}
                    className="w-full py-3 text-on-surface-variant hover:text-primary font-bold text-xs hover:bg-surface-container-high rounded-xl transition-all cursor-pointer border-none bg-transparent"
                  >
                    Limpar Formulário
                  </button>
                </div>

              </form>
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
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/denuncias`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <AlertTriangle className="w-5 h-5 text-secondary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Denúncias</span>
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
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Key className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Entregas</span>
        </a>
      </nav>

    </div>
  );
}
