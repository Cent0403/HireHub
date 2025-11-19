export default function Resources() {
  const resources = [
    {
      id: 1,
      category: 'Currículum',
      title: 'Cómo Crear un Currículum Profesional',
      description: 'Aprende a destacar tus habilidades y experiencia de forma efectiva para captar la atención de los reclutadores.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
      tips: [
        'Usa un formato limpio y profesional',
        'Incluye palabras clave relevantes del sector',
        'Destaca logros cuantificables',
        'Mantén la información actualizada'
      ]
    },
    {
      id: 2,
      category: 'Entrevistas',
      title: 'Preparación para Entrevistas de Trabajo',
      description: 'Domina las técnicas de entrevista y aprende a responder preguntas difíciles con confianza y profesionalismo.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: 'bg-green-100 text-green-600',
      tips: [
        'Investiga sobre la empresa antes',
        'Practica respuestas a preguntas comunes',
        'Prepara preguntas para el entrevistador',
        'Viste de forma profesional y apropiada'
      ]
    },
    {
      id: 3,
      category: 'Habilidades',
      title: 'Desarrollo de Habilidades Profesionales',
      description: 'Mejora tus competencias técnicas y blandas para aumentar tu empleabilidad en el mercado laboral actual.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600',
      tips: [
        'Identifica habilidades más demandadas',
        'Toma cursos online y certificaciones',
        'Practica con proyectos personales',
        'Mantente actualizado en tu campo'
      ]
    },
    {
      id: 4,
      category: 'Networking',
      title: 'Construye tu Red Profesional',
      description: 'Aprende a crear y mantener conexiones valiosas que impulsen tu carrera profesional.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
      ),
      color: 'bg-orange-100 text-orange-600',
      tips: [
        'Asiste a eventos de tu industria',
        'Participa en comunidades profesionales',
        'Mantén tu perfil de LinkedIn actualizado',
        'Ofrece valor antes de pedir favores'
      ]
    },
    {
      id: 5,
      category: 'Carrera',
      title: 'Planificación de Carrera Profesional',
      description: 'Define tus objetivos profesionales y traza un camino estratégico para alcanzar el éxito.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      color: 'bg-pink-100 text-pink-600',
      tips: [
        'Establece metas claras a corto y largo plazo',
        'Evalúa tus fortalezas y áreas de mejora',
        'Busca mentores en tu campo',
        'Revisa y ajusta tus objetivos regularmente'
      ]
    },
    {
      id: 6,
      category: 'Negociación',
      title: 'Negociación Salarial Efectiva',
      description: 'Conoce tu valor y aprende técnicas para negociar salarios y beneficios con confianza.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: 'bg-yellow-100 text-yellow-600',
      tips: [
        'Investiga rangos salariales del mercado',
        'Considera beneficios más allá del salario',
        'Practica tu propuesta de valor',
        'Mantén una actitud profesional y flexible'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recursos Profesionales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Herramientas, consejos y recursos para impulsar tu carrera y conseguir el trabajo de tus sueños
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {resources.map((resource) => (
            <div 
              key={resource.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
            >
              <div className={`w-14 h-14 ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                {resource.icon}
              </div>
              
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                {resource.category}
              </span>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {resource.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {resource.description}
              </p>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Consejos clave:</h4>
                <ul className="space-y-2">
                  {resource.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg 
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
