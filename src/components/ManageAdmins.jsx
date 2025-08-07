import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XMarkIcon, TrashIcon, UserPlusIcon, ChartBarIcon, ClockIcon, EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const ManageUsers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    role: 'admin',
    status: 'active',
    password: '',
    phone: ''
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [adminStats, setAdminStats] = useState({
    total: 0,
  });
  const [nurseStats, setNurseStats] = useState({
    total: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('admins');

  // API URLs
  const Backend = import.meta.env.VITE_BACKEND_URL;
  const API_BASE_URL = `${Backend}/api/v1`;
  const REGISTER_URL = `${API_BASE_URL}/register`;
  const ADMINS_URL = `${API_BASE_URL}/admins`;
  const NURSES_URL = `${API_BASE_URL}/nurse`;

  // Generate secure password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserData({ ...userData, password });
    toast.info('Password generated!');
  };

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(ADMINS_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data.users || data);
      updateAdminStats(data.users || data);
      logActivity('Fetched admin list', 'System');
    } catch (error) {
      toast.error(error.message);
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch nurses from API
  const fetchNurses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(NURSES_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch nurses');
      }

      const data = await response.json();
      setNurses(data.users || data);
      updateNurseStats(data.users || data);
      logActivity('Fetched nurse list', 'System');
    } catch (error) {
      toast.error(error.message);
      console.error('Error fetching nurses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchNurses();
    // Initialize sample activity logs
    setActivityLogs([
      { id: 1, action: 'User dashboard loaded', admin: 'System', timestamp: new Date().toISOString() }
    ]);
  }, []);

  const updateAdminStats = (adminsList) => {
    setAdminStats({
      total: adminsList.length,
    });
  };

  const updateNurseStats = (nursesList) => {
    setNurseStats({
      total: nursesList.length,
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
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          role: userData.role,
          status: userData.status
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Update local state with the new user
      const newUser = data.user || data;
      if (newUser.role === 'admin') {
        const updatedAdmins = [...admins, newUser];
        setAdmins(updatedAdmins);
        updateAdminStats(updatedAdmins);
      } else {
        const updatedNurses = [...nurses, newUser];
        setNurses(updatedNurses);
        updateNurseStats(updatedNurses);
      }
      
      logActivity(`${userData.role} created`, userData.fullName);
      
      // Reset form
      setShowAddModal(false);
      setUserData({ 
        fullName: '', 
        email: '', 
        role: 'admin', 
        status: 'active', 
        password: '',
        phone: ''
      });
      
      toast.success(`${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} created successfully!`);
    } catch (error) {
      toast.error(error.message);
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
      try {
        setIsLoading(true);
        const url = role === 'admin' ? `${ADMINS_URL}/${id}` : `${NURSES_URL}/${id}`;
        const response = await fetch(url, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to delete ${role}`);
        }

        if (role === 'admin') {
          const admin = admins.find(a => a._id === id);
          const updatedAdmins = admins.filter(a => a._id !== id);
          setAdmins(updatedAdmins);
          updateAdminStats(updatedAdmins);
          logActivity('Admin deleted', admin.fullName);
        } else {
          const nurse = nurses.find(n => n._id === id);
          const updatedNurses = nurses.filter(n => n._id !== id);
          setNurses(updatedNurses);
          updateNurseStats(updatedNurses);
          logActivity('Nurse deleted', nurse.fullName);
        }
        
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully!`);
      } catch (error) {
        toast.error(error.message);
        console.error(`Error deleting ${role}:`, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus, role) => {
    try {
      setIsLoading(true);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const url = role === 'admin' ? `${ADMINS_URL}/${id}/status` : `${NURSES_URL}/${id}/status`;
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      if (role === 'admin') {
        const updatedAdmins = admins.map(admin => 
          admin._id === id ? { ...admin, status: newStatus } : admin
        );
        setAdmins(updatedAdmins);
        updateAdminStats(updatedAdmins);
        logActivity(`Admin status changed to ${newStatus}`, admins.find(a => a._id === id).fullName);
      } else {
        const updatedNurses = nurses.map(nurse => 
          nurse._id === id ? { ...nurse, status: newStatus } : nurse
        );
        setNurses(updatedNurses);
        updateNurseStats(updatedNurses);
        logActivity(`Nurse status changed to ${newStatus}`, nurses.find(n => n._id === id).fullName);
      }
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNurses = nurses.filter(nurse =>
    nurse.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            User Management
            <span className="block md:inline text-gray-700 text-2xl md:text-3xl">Dashboard</span>
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-[#992787] text-white px-6 py-3 rounded-xl hover:bg-[#7a1f6a] transition-colors w-full md:w-auto justify-center"
            disabled={isLoading}
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold">Add New User</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'admins' ? 'text-[#992787] border-b-2 border-[#992787]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('admins')}
          >
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            Admins
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'nurses' ? 'text-[#992787] border-b-2 border-[#992787]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('nurses')}
          >
            <UsersIcon className="w-5 h-5 mr-2" />
            Nurses
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(activeTab === 'admins' ? adminStats : nurseStats).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 capitalize">{key} {activeTab === 'admins' ? 'Admins' : 'Nurses'}</p>
                  <p className="text-3xl font-bold text-[#992787]">{value}</p>
                </div>
                <ChartBarIcon className="w-12 h-12 text-[#992787]/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                <h2 className="text-xl font-semibold text-[#992787]">
                  {activeTab === 'admins' ? 'Admin' : 'Nurse'} List
                </h2>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full md:w-72 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#992787]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#992787]"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Name', 'Email', 'Role', 'Actions'].map((header) => (
                          <th key={header} className="px-4 py-3 text-left text-sm text-gray-500 font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(activeTab === 'admins' ? filteredAdmins : filteredNurses).map(user => (
                        <tr 
                          key={user._id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-4 py-3 text-gray-800">{user.fullName}</td>
                          <td className="px-4 py-3 text-[#992787]">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full bg-[#992787]/10 text-[#992787] text-sm">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user._id, user.role);
                              }}
                              className="text-red-500 hover:text-red-700"
                              disabled={isLoading}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                          {new Date(log.timestamp).toLocaleString()}
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

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#992787]">Create New User</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                      value={userData.fullName}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                      value={userData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                      value={userData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        name="role"
                        className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                        value={userData.role}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      >
                        <option value="admin">Admin</option>
                        <option value="nurse">Nurse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50"
                        value={userData.status}
                        onChange={handleInputChange}
                        disabled={isLoading}
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
                        disabled={isLoading}
                      >
                        Generate
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="w-full px-4 py-2 rounded-lg border focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/50 pr-10"
                        value={userData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-10 top-2 text-[#992787] hover:text-[#7a1f6a]"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                      {userData.password && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(userData.password)}
                          className="absolute right-2 top-2 text-[#992787] hover:text-[#7a1f6a]"
                          disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6a] disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#992787]">
                    {selectedUser.role === 'admin' ? 'Admin' : 'Nurse'} Details
                  </h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Name</label>
                      <p className="font-medium text-gray-800">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-[#992787] break-all">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-600">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <p className="px-2 py-1 rounded-full bg-[#992787]/10 text-[#992787] text-sm w-fit">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Created At</label>
                      <p className="text-gray-600">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
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

export default ManageUsers;