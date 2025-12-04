import React from 'react';

export default function ClassDiagramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Architecture du Système
          </h1>
          <p className="text-slate-600 text-lg">
            Diagramme de classes - Modules métiers et serveur de documents
          </p>
        </div>

        {/* Diagram Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 relative">
          <div className="relative">
            {/* SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
              {/* Line from ModuleRH to DocumentServeur */}
              <line x1="35%" y1="15%" x2="65%" y2="30%" 
                    stroke="#94a3b8" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead)" />
              
              {/* Line from ModuleFinance to DocumentServeur */}
              <line x1="35%" y1="50%" x2="54%" y2="50%" 
                    stroke="#94a3b8" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead)" />
              
              {/* Line from ModuleMarketing to DocumentServeur */}
              <line x1="35%" y1="85%" x2="65%" y2="70%" 
                    stroke="#94a3b8" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead)" />
              
              {/* Arrow marker definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
                </marker>
              </defs>
              
              {/* Labels "utilise" */}
              <text x="50%" y="20%" fill="#64748b" fontSize="14" textAnchor="middle" fontStyle="italic">
                utilise
              </text>
              <text x="50%" y="49%" fill="#64748b" fontSize="14" textAnchor="middle" fontStyle="italic">
                utilise
              </text>
              <text x="50%" y="80%" fill="#64748b" fontSize="14" textAnchor="middle" fontStyle="italic">
                utilise
              </text>
            </svg>

            <div className="grid grid-cols-2 gap-24 relative" style={{zIndex: 2}}>
              {/* Left Column - Modules */}
              <div className="flex flex-col gap-12">
                {/* ModuleRH */}
                <div className="border-2 border-blue-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 font-bold text-lg">
                    ModuleRH
                  </div>
                  <div className="p-5 bg-blue-50 border-b-2 border-blue-200">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> userId: Integer
                      </div>
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> listeEmployes: Liste&lt;Employe&gt;
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="font-mono text-sm text-slate-700">
                      <span className="text-green-600 font-bold">+</span> ajouterEmploye(employe: Employe)
                    </div>
                  </div>
                </div>

                {/* ModuleFinance */}
                <div className="border-2 border-purple-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 font-bold text-lg">
                    ModuleFinance
                  </div>
                  <div className="p-5 bg-purple-50 border-b-2 border-purple-200">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> userId: Integer
                      </div>
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> listeFactures: Liste&lt;Factures&gt;
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="font-mono text-sm text-slate-700">
                      <span className="text-green-600 font-bold">+</span> consulterFacture(num: Integer)
                    </div>
                  </div>
                </div>

                {/* ModuleMarketing */}
                <div className="border-2 border-pink-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-4 font-bold text-lg">
                    ModuleMarketing
                  </div>
                  <div className="p-5 bg-pink-50 border-b-2 border-pink-200">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> userId: Integer
                      </div>
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> listeCompagne: Liste&lt;Compagne&gt;
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="font-mono text-sm text-slate-700">
                      <span className="text-green-600 font-bold">+</span> creerCompagne(nom: string)
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - DocumentServeur */}
              <div className="flex items-center">
                <div className="border-2 border-emerald-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-full bg-white">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 font-bold text-lg">
                    DocumentServeur
                  </div>
                  <div className="p-5 bg-emerald-50 border-b-2 border-emerald-200">
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> url: String
                      </div>
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> contenu: byte[]
                      </div>
                      <div className="text-slate-700">
                        <span className="text-red-600 font-bold">−</span> tailleEnMB: integer
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="space-y-2 font-mono text-sm text-slate-700">
                      <div><span className="text-green-600 font-bold">+</span> getMetadonnees()</div>
                      <div><span className="text-green-600 font-bold">+</span> telecharger()</div>
                      <div><span className="text-green-600 font-bold">+</span> lire(): String</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 pt-8 border-t-2 border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📖 Légende UML</h3>
            <div className="flex flex-wrap gap-8 text-base">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg">
                <span className="text-red-600 font-bold text-xl">−</span>
                <span className="text-slate-700 font-medium">Attribut privé</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg">
                <span className="text-green-600 font-bold text-xl">+</span>
                <span className="text-slate-700 font-medium">Méthode publique</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg">
                <svg width="60" height="20">
                  <line x1="0" y1="10" x2="50" y2="10" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,3" />
                  <polygon points="50,10 45,7 45,13" fill="#94a3b8" />
                </svg>
                <span className="text-slate-700 font-medium">Dépendance (utilise)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-xl mb-3">Modules Métiers</h3>
            <p className="text-blue-100 leading-relaxed">
              Les modules RH, Finance et Marketing encapsulent la logique métier spécifique à chaque domaine fonctionnel.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="font-bold text-xl mb-3">Serveur Central</h3>
            <p className="text-emerald-100 leading-relaxed">
              DocumentServeur fournit un service centralisé de gestion documentaire accessible à tous les modules.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-bold text-xl mb-3">Architecture</h3>
            <p className="text-purple-100 leading-relaxed">
              Pattern de dépendance permettant le découplage et la réutilisabilité du service documentaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}