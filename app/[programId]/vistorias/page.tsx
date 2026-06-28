// =============================================================================
// app/[programId]/vistorias/page.tsx
// Tela de Agendamento de Vistoria (Passo 12.2).
// Permite ao operador agendar vistorias técnicas nas unidades habitacionais.
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  Building, 
  ChevronDown, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sun, 
  Moon, 
  ClipboardCheck, 
  CheckCircle, 
  Info,
  MapPin,
  Check,
  Grid,
  Users,
  Percent,
  Settings
} from "lucide-react";

export default function VistoriaSchedulingPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos seletores de unidades
  const [residencial, setResidencial] = useState("Jardins do Amanhã I");
  const [bloco, setBloco] = useState("Bloco B - Girassol");
  const [unidade, setUnidade] = useState("Apto 402");

  const [openResidencial, setOpenResidencial] = useState(false);
  const [openBloco, setOpenBloco] = useState(false);
  const [openUnidade, setOpenUnidade] = useState(false);

  // Estados do Calendário e Horários
  const [selectedDay, setSelectedDay] = useState<number>(11);
  const [selectedMonth, setSelectedMonth] = useState("Outubro");
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedTime, setSelectedTime] = useState("09:30");

  // Estado de Confirmação
  const [notification, setNotification] = useState<string | null>(null);

  const handleConfirmSchedule = () => {
    setNotification(`Agendamento confirmado com sucesso! Protocolo RF070 registrado para ${selectedDay} de ${selectedMonth}, ${selectedYear} às ${selectedTime}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const residenciais = ["Jardins do Amanhã I", "Jardins do Amanhã II", "Residencial Alvorada"];
  const blocos = ["Bloco A - Margarida", "Bloco B - Girassol", "Bloco C - Hortênsia"];
  const unidades = ["Apto 401", "Apto 402", "Apto 403", "Apto 404"];

  const calendarDays = [
    { day: 24, currentMonth: false },
    { day: 25, currentMonth: false },
    { day: 26, currentMonth: false },
    { day: 27, currentMonth: false },
    { day: 28, currentMonth: false },
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: true, special: false },
    { day: 1, currentMonth: true, dot: true },
    { day: 2, currentMonth: true, clickable: true },
    { day: 3, currentMonth: true, clickable: true },
    { day: 4, currentMonth: true, clickable: true },
    { day: 5, currentMonth: true, clickable: true },
    { day: 6, currentMonth: true, clickable: true },
    { day: 7, currentMonth: true, clickable: false },
    { day: 8, currentMonth: true, clickable: false },
    { day: 9, currentMonth: true, clickable: true },
    { day: 10, currentMonth: true, clickable: true },
    { day: 11, currentMonth: true, clickable: true },
    { day: 12, currentMonth: true, clickable: true },
    { day: 13, currentMonth: true, clickable: true },
    { day: 14, currentMonth: true, clickable: false }
  ];

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
            
            {/* Mensagem de sucesso */}
            {notification && (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-start gap-3 shadow-md border-l-4 border-green-600 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Agendamento Realizado!</h4>
                  <p className="text-xs">{notification}</p>
                </div>
              </div>
            )}

            {/* Cabeçalho da Página */}
            <div className="space-y-1">
              <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                Agendamento de Vistoria
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base">
                Selecione os detalhes da unidade e o período disponível para a realização da vistoria técnica.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Coluna Esquerda: Detalhes da Unidade & Calendário */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Seção 1: Detalhes da Unidade */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Building className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="font-heading text-lg font-bold text-primary">Detalhes da Unidade</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Seleção do Residencial */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Residencial
                      </label>
                      <button 
                        onClick={() => {
                          setOpenResidencial(!openResidencial);
                          setOpenBloco(false);
                          setOpenUnidade(false);
                        }}
                        className="w-full p-4 bg-surface-container-low rounded-lg font-semibold text-primary border border-outline-variant/20 flex items-center justify-between hover:bg-surface-container-high transition-colors text-xs text-left cursor-pointer"
                      >
                        {residencial}
                        <ChevronDown className={`w-4 h-4 opacity-40 transition-transform ${openResidencial ? "rotate-180" : ""}`} />
                      </button>
                      
                      {openResidencial && (
                        <div className="absolute top-[76px] left-0 w-full bg-white border border-outline-variant/30 rounded-lg shadow-lg z-20 overflow-hidden">
                          {residenciais.map(res => (
                            <button
                              key={res}
                              onClick={() => {
                                setResidencial(res);
                                setOpenResidencial(false);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-semibold text-primary hover:bg-slate-50 transition-colors"
                            >
                              {res}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Seleção de Bloco / Torre */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Bloco / Torre
                      </label>
                      <button 
                        onClick={() => {
                          setOpenBloco(!openBloco);
                          setOpenResidencial(false);
                          setOpenUnidade(false);
                        }}
                        className="w-full p-4 bg-surface-container-low rounded-lg font-semibold text-primary border border-outline-variant/20 flex items-center justify-between hover:bg-surface-container-high transition-colors text-xs text-left cursor-pointer"
                      >
                        {bloco}
                        <ChevronDown className={`w-4 h-4 opacity-40 transition-transform ${openBloco ? "rotate-180" : ""}`} />
                      </button>

                      {openBloco && (
                        <div className="absolute top-[76px] left-0 w-full bg-white border border-outline-variant/30 rounded-lg shadow-lg z-20 overflow-hidden">
                          {blocos.map(bl => (
                            <button
                              key={bl}
                              onClick={() => {
                                setBloco(bl);
                                setOpenBloco(false);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-semibold text-primary hover:bg-slate-50 transition-colors"
                            >
                              {bl}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Seleção da Unidade */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Unidade
                      </label>
                      <button 
                        onClick={() => {
                          setOpenUnidade(!openUnidade);
                          setOpenResidencial(false);
                          setOpenBloco(false);
                        }}
                        className="w-full p-4 bg-surface-container-low rounded-lg font-semibold text-primary border border-outline-variant/20 flex items-center justify-between hover:bg-surface-container-high transition-colors text-xs text-left cursor-pointer"
                      >
                        {unidade}
                        <ChevronDown className={`w-4 h-4 opacity-40 transition-transform ${openUnidade ? "rotate-180" : ""}`} />
                      </button>

                      {openUnidade && (
                        <div className="absolute top-[76px] left-0 w-full bg-white border border-outline-variant/30 rounded-lg shadow-lg z-20 overflow-hidden">
                          {unidades.map(un => (
                            <button
                              key={un}
                              onClick={() => {
                                setUnidade(un);
                                setOpenUnidade(false);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-semibold text-primary hover:bg-slate-50 transition-colors"
                            >
                              {un}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </section>

                {/* Seção 2: Seleção do Calendário */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  
                  {/* Navegação do Mês */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="text-secondary w-6 h-6 shrink-0" />
                      <h3 className="font-heading text-lg font-bold text-primary">Data da Vistoria</h3>
                    </div>
                    <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
                      <button className="text-primary hover:text-secondary cursor-pointer transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-primary text-xs min-w-[120px] text-center select-none">
                        {selectedMonth} {selectedYear}
                      </span>
                      <button className="text-primary hover:text-secondary cursor-pointer transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dias da Semana */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-4 select-none">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Dom</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Seg</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Ter</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Qua</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Qui</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Sex</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Sáb</div>
                  </div>

                  {/* Dias da Grade */}
                  <div className="grid grid-cols-7 gap-3">
                    {calendarDays.map((item, index) => {
                      // Verifica se o dia é o selecionado
                      const isCurrentlySelected = item.currentMonth && selectedDay === item.day;
                      
                      // Caso do dia 1 (dia especial no mockup com dot no bottom)
                      if (item.dot && item.day === 1) {
                        const isDay1Selected = selectedDay === 1;
                        return (
                          <button 
                            key={index}
                            onClick={() => setSelectedDay(1)}
                            className={`aspect-square flex flex-col items-center justify-center rounded-xl font-bold relative transition-all duration-300 shadow-md ${
                              isDay1Selected 
                                ? "bg-secondary text-white shadow-secondary/20" 
                                : "bg-secondary-container/20 text-secondary hover:bg-secondary/10"
                            }`}
                          >
                            1
                            <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isDay1Selected ? "bg-white" : "bg-secondary"}`}></span>
                          </button>
                        );
                      }

                      // Dias comuns
                      if (!item.currentMonth) {
                        return (
                          <div 
                            key={index} 
                            className="aspect-square flex items-center justify-center text-on-surface-variant/30 text-sm select-none"
                          >
                            {item.day}
                          </div>
                        );
                      }

                      if (item.clickable) {
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDay(item.day)}
                            className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-300 text-sm font-medium cursor-pointer ${
                              isCurrentlySelected
                                ? "bg-primary text-white font-bold shadow-lg"
                                : "text-primary hover:bg-secondary/5"
                            }`}
                          >
                            {item.day}
                          </button>
                        );
                      }

                      // Dias não clicáveis (ex: fins de semana ou passados)
                      return (
                        <div 
                          key={index} 
                          className={`aspect-square flex items-center justify-center text-on-surface-variant text-sm font-medium select-none ${
                            isCurrentlySelected ? "bg-primary text-white rounded-xl font-bold" : ""
                          }`}
                        >
                          {item.day}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Seção 3: Links de Checklists Técnicos */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 space-y-6">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="font-heading text-lg font-bold text-primary">Checklists de Vistoria e Conformidade</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
                    Acesse os checklists para vistoria da unidade habitacional ou para a auditoria de conformidade técnica NBR da torre.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href={`/${programId}/vistorias/checklist`}
                      className="p-5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all gap-4 text-left border-none"
                    >
                      <div>
                        <span className="text-[8px] font-black uppercase text-secondary bg-blue-50 px-2 py-0.5 rounded tracking-wider w-fit">Unidade</span>
                        <h4 className="font-heading font-black text-sm text-primary mt-2">Vistoria do Imóvel</h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">Checklist de entrega de chaves, tomadas, cerâmicas e vazamentos.</p>
                      </div>
                      <span className="text-[9px] font-black text-secondary uppercase tracking-widest flex items-center gap-1 mt-auto">Acessar Checklist →</span>
                    </a>

                    <a 
                      href={`/${programId}/vistorias/checklist-nbr`}
                      className="p-5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all gap-4 text-left border-none"
                    >
                      <div>
                        <span className="text-[8px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded tracking-wider w-fit">Torre / NBR</span>
                        <h4 className="font-heading font-black text-sm text-primary mt-2">Conformidade NBR</h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">Auditoria técnica de poços de ventilação, janelas e regras de ventilação.</p>
                      </div>
                      <span className="text-[9px] font-black text-secondary uppercase tracking-widest flex items-center gap-1 mt-auto">Acessar NBR →</span>
                    </a>
                  </div>
                </section>

              </div>

              {/* Coluna Direita: Horários & Resumo */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Seção 3: Horários Disponíveis */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Clock className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="font-heading text-lg font-bold text-primary">Horários</h3>
                  </div>

                  <div className="space-y-8">
                    {/* Período da Manhã */}
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase mb-4 flex items-center gap-2 tracking-widest select-none">
                        <Sun className="w-3.5 h-3.5 text-on-surface-variant" /> Manhã
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setSelectedTime("08:30")}
                          className={`py-4 rounded-xl font-bold text-sm transition-all duration-300 border cursor-pointer ${
                            selectedTime === "08:30"
                              ? "bg-secondary text-white border-transparent shadow-md shadow-secondary/20"
                              : "bg-surface-container-low text-primary border-outline-variant/10 hover:border-secondary"
                          }`}
                        >
                          08:30
                        </button>
                        
                        <button 
                          onClick={() => setSelectedTime("09:30")}
                          className={`py-4 rounded-xl font-bold text-sm transition-all duration-300 border cursor-pointer flex items-center justify-center gap-1.5 ${
                            selectedTime === "09:30"
                              ? "bg-secondary text-white border-transparent shadow-md shadow-secondary/20"
                              : "bg-surface-container-low text-primary border-outline-variant/10 hover:border-secondary"
                          }`}
                        >
                          09:30
                          {selectedTime === "09:30" && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>

                        <button 
                          onClick={() => setSelectedTime("10:30")}
                          className={`py-4 rounded-xl font-bold text-sm transition-all duration-300 border cursor-pointer ${
                            selectedTime === "10:30"
                              ? "bg-secondary text-white border-transparent shadow-md shadow-secondary/20"
                              : "bg-surface-container-low text-primary border-outline-variant/10 hover:border-secondary"
                          }`}
                        >
                          10:30
                        </button>

                        <button 
                          disabled
                          className="py-4 rounded-xl bg-surface-container-highest text-on-surface-variant/40 font-bold text-sm cursor-not-allowed opacity-50 select-none"
                        >
                          11:30
                        </button>
                      </div>
                    </div>

                    {/* Período da Tarde */}
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase mb-4 flex items-center gap-2 tracking-widest select-none">
                        <Moon className="w-3.5 h-3.5 text-on-surface-variant" /> Tarde
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {["14:00", "15:00", "16:00", "17:00"].map((time) => (
                          <button 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-4 rounded-xl font-bold text-sm transition-all duration-300 border cursor-pointer ${
                              selectedTime === time
                                ? "bg-secondary text-white border-transparent shadow-md shadow-secondary/20"
                                : "bg-surface-container-low text-primary border-outline-variant/10 hover:border-secondary"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Seção 4: Resumo & Confirmação */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                  <h3 className="font-heading text-lg font-bold text-primary mb-8 flex items-center gap-3">
                    <ClipboardCheck className="text-secondary w-6 h-6 shrink-0" />
                    Resumo
                  </h3>

                  <div className="space-y-6 mb-10 text-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data</span>
                      <span className="font-extrabold text-primary">{selectedDay} {selectedMonth.slice(0, 3)}, {selectedYear}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Horário</span>
                      <span className="font-extrabold text-primary">{selectedTime} {parseInt(selectedTime.split(":")[0]) < 12 ? "AM" : "PM"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Unidade</span>
                      <span className="font-extrabold text-primary">{unidade}, {bloco.split(" ")[0]}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirmSchedule}
                    className="w-full py-4 bg-primary hover:shadow-lg text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 mb-4 cursor-pointer border-none text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Agendamento
                  </button>

                  <div className="bg-[#ffdbca]/40 p-4 rounded-lg flex items-start gap-3 border-l-4 border-tertiary">
                    <Info className="text-tertiary w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#723610] leading-tight font-medium">
                      Alterações de data devem ser feitas com no mínimo 48h de antecedência.
                    </p>
                  </div>

                  <p className="text-[9px] text-center mt-6 opacity-40 uppercase font-black tracking-[0.2em] text-primary select-none">
                    Protocolo RF070 - Vistoria e Entrega
                  </p>
                </section>

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
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/90 dark:bg-[#001e40]/90 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Grid className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Percent className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
        </a>
        <a 
          href={`/${programId}/vistorias`}
          className="flex flex-col items-center justify-center text-[#0059bb] dark:text-[#0070ea] scale-110"
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Vistoria</span>
        </a>
        <a 
          href="#"
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Settings className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Ajustes</span>
        </a>
      </nav>

    </div>
  );
}
