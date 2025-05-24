import React from 'react';
import Widget from '../components/dashboard/Widget';
import { CheckCircle, ListTodo, FolderOpenDot } from 'lucide-react';

const DashboardPage = () => {
  const quickStats = [
    { id: 1, icon: <CheckCircle size={24} className="text-green-400" />, label: 'Tâches complétées', value: '0' },
    { id: 2, icon: <ListTodo size={24} className="text-yellow-500" />, label: 'Tâches en cours', value: '0' }, // Changement ici
    { id: 3, icon: <FolderOpenDot size={24} className="text-bright-blue" />, label: 'Projets actifs', value: '0' }, // Changement ici
  ];

  const recentTasks = [
    { id: 1, title: 'Finaliser le rapport financier Q2' },
    { id: 2, title: 'Préparer la présentation client pour "Alpha Project"' },
    { id: 3, title: 'Relecture de la documentation technique API v2' },
    { id: 4, title: 'Planifier la prochaine réunion d'équipe' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-poppins font-bold text-white mb-8">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Widget title="Aperçu rapide" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStats.map(stat => (
              <div key={stat.id} className="bg-dark-slate/50 p-4 rounded-lg flex items-center space-x-3">
                {stat.icon}
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-white text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        <Widget title="Mes Tâches Récentes">
          <ul className="space-y-3">
            {recentTasks.map(task => (
              <li key={task.id} className="bg-dark-slate/50 p-3 rounded-md hover:bg-dark-slate cursor-pointer transition-colors">
                <p className="text-gray-200">{task.title}</p>
              </li>
            ))}
            {recentTasks.length === 0 && <p className="text-gray-400">Aucune tâche récente.</p>}
          </ul>
        </Widget>

        <Widget title="Calendrier">
          <div className="flex items-center justify-center h-48 bg-dark-slate/30 rounded-md">
            <p className="text-gray-500">Le composant Calendrier sera intégré ici.</p>
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default DashboardPage;
