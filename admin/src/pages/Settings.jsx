import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Settings</h1>
        <p className="font-montserrat-regular-400 text-black-light">Configure your admin panel preferences</p>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <SettingsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">Settings Coming Soon</h3>
        <p className="font-montserrat-regular-400 text-black-light">Settings management features will be integrated next</p>
      </div>
    </div>
  );
};

export default Settings;
