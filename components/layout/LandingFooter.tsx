import React from 'react';

export function LandingFooter() {
  return (
    <footer className="bg-[#001e40] text-white py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          <div className="space-y-4 max-w-xs">
            <span className="font-heading font-black text-2xl tracking-tight">SIGAH</span>
            <p className="text-white/60 text-xs leading-relaxed">
              A plataforma líder em gestão habitacional inteligente para o setor público brasileiro. Transformando moradia em dignidade através de dados.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">
                100% Digital
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">
                Seguro
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">
                Auditável
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">Produto</h5>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a className="hover:text-white transition-colors" href="/#funcionalidades">Funcionalidades</a></li>
                <li><a className="hover:text-white transition-colors" href="/#programas">Conformidade Legal</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Segurança de Dados</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">Institucional</h5>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a className="hover:text-white transition-colors" href="#">Sobre Nós</a></li>
                <li><a className="hover:text-white transition-colors" href="/#depoimentos">Transparência</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Contato</a></li>
              </ul>
            </div>
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">Legal</h5>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a className="hover:text-white transition-colors" href="#">Privacidade</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Termos de Uso</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Acessibilidade</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs">
          <p>© 2026 SIGAH Public Housing Management Platform. All Rights Reserved. Institutional Transparency Portal.</p>
          <div className="flex gap-6">
            <a className="hover:underline" href="#">Open Data API</a>
            <a className="hover:underline" href="#">Ouvidoria Geral</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
