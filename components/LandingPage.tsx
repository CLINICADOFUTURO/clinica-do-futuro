import React from 'react';
import { ChevronRight, Calendar, Users, DollarSign, CheckCircle, ArrowRight, Activity, ShieldCheck, Star } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <img 
                src="https://i.imgur.com/393Jk3S.png" 
                alt="Clínica do Futuro" 
                className="h-12 w-auto object-contain" 
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white font-medium transition">Funcionalidades</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white font-medium transition">Depoimentos</a>
              <a href="#pricing" className="text-slate-300 hover:text-white font-medium transition">Planos</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button onClick={onLogin} className="text-slate-300 hover:text-white font-medium hidden sm:block">
                Entrar
              </button>
              <button 
                onClick={onLogin}
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-brand-900/20 flex items-center"
              >
                Começar Grátis
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6 border border-brand-100">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2"></span>
              Nova Integração com IA Disponível
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              Gestão Inteligente para sua <span className="text-brand-600 relative whitespace-nowrap">
                Clínica do Futuro
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Simplifique agendamentos, organize prontuários e controle suas finanças em um único lugar. 
              Aumente a produtividade da sua clínica com automação e inteligência.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onLogin} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-brand-200 flex items-center justify-center">
                Acessar Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center">
                Ver Vídeo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-brand-500 mr-1" /> Sem cartão de crédito</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-brand-500 mr-1" /> Setup em 2 minutos</span>
            </div>
          </div>
          
          {/* Hero Image / Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-20 bottom-0"></div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 p-2">
              <div className="rounded-xl overflow-hidden bg-white aspect-[16/9] relative flex items-center justify-center border border-slate-100">
                 {/* Simplified UI Representation */}
                 <div className="w-full h-full bg-slate-50 grid grid-cols-12 gap-4 p-6 opacity-90">
                    <div className="col-span-3 bg-white rounded-lg shadow-sm h-full hidden md:block"></div>
                    <div className="col-span-12 md:col-span-9 space-y-4">
                        <div className="flex gap-4">
                           <div className="h-24 bg-white rounded-lg shadow-sm flex-1"></div>
                           <div className="h-24 bg-white rounded-lg shadow-sm flex-1"></div>
                           <div className="h-24 bg-white rounded-lg shadow-sm flex-1"></div>
                        </div>
                        <div className="h-64 bg-white rounded-lg shadow-sm w-full"></div>
                    </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={onLogin} className="bg-brand-600/90 hover:bg-brand-700 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg transform transition hover:scale-105">
                        Ver Dashboard Interativo
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo o que sua clínica precisa</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Substitua planilhas e agendas de papel por um sistema integrado que trabalha por você.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-brand-600" />}
              title="Agenda Inteligente"
              description="Controle de horários com confirmação automática via WhatsApp e redução de faltas."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-brand-600" />}
              title="Prontuário Digital"
              description="Anamnese completa, histórico de tratamentos e upload de exames em um só lugar."
            />
            <FeatureCard 
              icon={<DollarSign className="w-8 h-8 text-brand-600" />}
              title="Controle Financeiro"
              description="Fluxo de caixa, emissão de recibos e gestão de comissões de dentistas."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h3 className="text-xl font-semibold text-slate-800 mb-8">Utilizado por mais de 500 clínicas modernas</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Mock Logos */}
              <div className="flex items-center justify-center font-bold text-2xl text-slate-400">DENTAL<span className="text-brand-500">CARE</span></div>
              <div className="flex items-center justify-center font-bold text-2xl text-slate-400">ORTO<span className="text-blue-500">PLUS</span></div>
              <div className="flex items-center justify-center font-bold text-2xl text-slate-400">SORRISO<span className="text-pink-500">MAX</span></div>
              <div className="flex items-center justify-center font-bold text-2xl text-slate-400">CLINIC<span className="text-green-500">ONE</span></div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://i.imgur.com/393Jk3S.png" 
                alt="Clínica do Futuro" 
                className="h-10 w-auto" 
              />
            </div>
            <p className="max-w-sm text-slate-400">
              Transformando a gestão odontológica com tecnologia, design e simplicidade.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-400 transition">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-brand-400 transition">Preços</a></li>
              <li><a href="#" className="hover:text-brand-400 transition">Segurança</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-400 transition">Sobre</a></li>
              <li><a href="#" className="hover:text-brand-400 transition">Contato</a></li>
              <li><a href="#" className="hover:text-brand-400 transition">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; 2024 Clínica do Futuro Tecnologia. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition border border-slate-100 group">
    <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);

export default LandingPage;