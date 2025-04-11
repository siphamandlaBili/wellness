import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XMarkIcon, TrashIcon, UserPlusIcon, ChartBarIcon, ClockIcon, EyeIcon, EyeSlashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const ManageAdmins = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: 'admin',
    status: 'active',
    password: ''
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Generate secure password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminData({ ...adminData, password });
    toast.info('Password generated!');
  };

  // Sample initial data
  useEffect(() => {
    const sampleAdmins = [
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@hospital.com', 
        role: 'admin', 
        status: 'active', 
        lastActive: '2023-08-15',
        password: 'generated-password-123',
        createdAt: '2023-08-01'
      }
    ];
    const sampleLogs = [
      { id: 1, action: 'Admin created', admin: 'System', timestamp: new Date().toISOString() }
    ];
    setAdmins(sampleAdmins);
    setActivityLogs(sampleLogs);
    updateStats(sampleAdmins);
  }, []);

  const updateStats = (adminsList) => {
    setStats({
      total: adminsList.length,
      active: adminsList.filter(a => a.status === 'active').length,
      inactive: adminsList.filter(a => a.status === 'inactive').length
    });
  };

  const logActivity = (action, adminName) => {
    setActivityLogs(prev => [
      {
        id: prev.length + 1,
        action,
        admin: adminName,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleInputChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAdmin = {
      ...adminData,
      id: admins.length + 1,
      lastActive: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    updateStats(updatedAdmins);
    logActivity('Admin created', 'System');
    setShowAddModal(false);
    setAdminData({ name: '', email: '', role: 'admin', status: 'active', password: '' });
    toast.success('Admin created successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      const admin = admins.find(a => a.id === id);
      const updatedAdmins = admins.filter(admin => admin.id !== id);
      setAdmins(updatedAdmins);
      updateStats(updatedAdmins);
      logActivity('Admin deleted', admin.name);
      toast.error('Admin deleted successfully!');
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        toastStyle={{ backgroundColor: '#fff', color: '#992787' }}
      />
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#992787]">
            Admin Management
            <span className="block md:inline text-gray-700 text-2xl md:text-3xl">Dashboard</span>
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-[#992787] text-white px-6 py-3 rounded-xl hover:bg-[#7a1f6a] transition-colors w-full md:w-auto justify-center"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold">Add New Admin</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 capitalize">{key} Admins</p>
                  <p className="text-3xl font-bold text-[#992787]">{value}</p>
                </div>
                <ChartBarIcon className="w-12 h-12 text-[#992787]/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admins Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                <h2 className="text-xl font-semibold text-[#992787]">Admin List</h2>
                <input
                  type="text"
                  placeholder="Search admins..."
                  className="w-full md:w-72 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#992787]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="px-4 py-3 text-left text-sm text-gray-500 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAdmins.map(admin => (
                      <tr 
                        key={admin.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedAdmin(admin)}
                      >
                        <td className="px-4 py-3 text-gray-800">{admin.name}</td>
                        <td className="px-4 py-3 text-[#992787]">{admin.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full bg-[#992787]/10 text-[#992787] text-sm">
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            admin.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(admin.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Monitoring */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-[#992787] mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {activityLogs.map(log => (
                  <div key={log.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="bg-[#992787] p-2 rounded-full mr-4">
                      <ClockIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{log.action}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">By {log.admin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#992787]">Create New Admin</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                      value={adminData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                      value={adminData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        name="role"
                        className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                        value={adminData.role}
                        onChange={handleInputChange}
                      >
                        <option value="admin">Admin</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="auditor">Auditor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                        value={adminData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="ml-2 text-sm text-[#992787] hover:underline"
                      >
                        Generate
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="password"
                        className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50 pr-10"
                        value={adminData.password}
                        onChange={handleInputChange}
                        required
                      />
                      {adminData.password && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(adminData.password)}
                          className="absolute right-2 top-2 text-[#992787] hover:text-[#7a1f6a]"
                        >
                          <DocumentDuplicateIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6a]"
                    >
                      Create Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Admin Details Modal */}
        {selectedAdmin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#992787]">Admin Details</h2>
                  <button
                    onClick={() => setSelectedAdmin(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Name</label>
                      <p className="font-medium text-gray-800">{selectedAdmin.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-[#992787] break-all">{selectedAdmin.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <p className="px-2 py-1 rounded-full bg-[#992787]/10 text-[#992787] text-sm w-fit">
                        {selectedAdmin.role}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <p className={`px-2 py-1 rounded-full text-sm w-fit ${
                        selectedAdmin.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedAdmin.status}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Created At</label>
                      <p className="text-gray-600">{selectedAdmin.createdAt}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Active</label>
                      <p className="text-gray-600">{selectedAdmin.lastActive}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Password
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-[#992787] hover:text-[#7a1f6a]"
                      >
                        {showPassword ? <EyeSlashIcon className="w-4 h-4 inline" /> : <EyeIcon className="w-4 h-4 inline" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(selectedAdmin.password)}
                        className="ml-2 text-[#992787] hover:text-[#7a1f6a]"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4 inline" />
                      </button>
                    </label>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <p className="font-mono">
                        {showPassword ? selectedAdmin.password : '•'.repeat(12)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmins;