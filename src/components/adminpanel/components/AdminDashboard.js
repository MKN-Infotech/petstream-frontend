// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import dayjs from 'dayjs';
import {
  Settings, User, LogOut, Bell, Search,
  Menu, X, Plus, Edit, Trash2, Eye,
  Package, Building, GraduationCap,
  Briefcase, TrendingUp, Newspaper, Calendar, ChevronDown, Save, Image
} from 'lucide-react';

const API_BASE = 'https://petstream.in/api';

const sectionConfig = {
  products: {
    title: 'Products',
    endpoint: 'products',
    fields: [
      { key: 'title',        label: 'Title',         type: 'text' },
      { key: 'description',  label: 'Description',   type: 'text' },
      { key: 'file',           label: 'Image File',     type: 'file', multiple: true },
      { key: 'tag',        label: 'Tag',         type: 'text' },
      { key: 'category',        label: 'Category',         type: 'text' },
      { key: 'status',       label: 'Status',        type: 'status', options: ['Active','Draft','Archived'] },
      { key: 'created_date', label: 'Created Date',  type: 'date' }
    ]
  },

  industry: {
    title: 'Industry Information',
    endpoint: 'industry',
    fields: [
      { key: 'title',        label: 'Title',        type: 'text' },
      { key: 'description',  label: 'Description',  type: 'text' },
      { key: 'file',         label: 'Image File',   type: 'file' },
      { key: 'tag',        label: 'Tag',         type: 'text' },
      { key: 'category',        label: 'Category',         type: 'text' },
      { key: 'views',        label: 'Views',        type: 'number' },
      { key: 'publish_date', label: 'Publish Date', type: 'date' }
    ]
  },

  news: {
    title: 'Latest News',
    endpoint: 'news',
    fields: [
      { key: 'headline',       label: 'Headline',       type: 'text' },
      { key: 'content',        label: 'Content',        type: 'text' },
      { key: 'file',           label: 'Image File',     type: 'file', multiple: true },
      { key: 'tag',        label: 'Tag',         type: 'text' },
      { key: 'category',        label: 'Category',         type: 'text' },
      { key: 'published_date', label: 'Published Date', type: 'date' }
    ]
  },

  events: {
    title: 'Latest Events',
    endpoint: 'events',
    fields: [
      { key: 'title',      label: 'Title',      type: 'text' },
      { key: 'content',    label: 'Content',   type: 'text' },
      { key: 'file',       label: 'Image File', type: 'file' },
      { key: 'tag',        label: 'Tag',         type: 'text' },
      { key: 'category',        label: 'Category',         type: 'text' },
      { key: 'event_date', label: 'Event Date', type: 'date' },
      { key: 'status',     label: 'Status',     type: 'text' }
    ]
  }
};

// Helper function to truncate text
function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Helper function to get file name from path
function getFileName(filePath) {
  if (!filePath) return '';
  return filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen]         = useState(true);
  const [activeSection, setActiveSection]     = useState('products');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [items, setItems]                     = useState([]);
  const [error, setError]                     = useState(null);

  const [showModal, setShowModal]             = useState(false);
  const [modalType, setModalType]             = useState('create'); // create | edit | view
  const [formData, setFormData]               = useState({});
  const [selectedItem, setSelectedItem]       = useState(null);
  const [selectedFiles, setSelectedFiles]     = useState([]); // Changed to array for multiple files

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const sidebarItems = [
    { id: 'products',  label: 'Products Update',      icon: Package },
    { id: 'industry',  label: 'Industry Information', icon: TrendingUp },
    { id: 'news',      label: 'Latest News',          icon: Newspaper },
    { id: 'events',    label: 'Latest Events',        icon: Calendar }
  ];

  useEffect(() => {
    fetchItems();
  }, [activeSection]);

  async function fetchItems() {
    setIsLoading(true);
    setError(null);
    const cfg = sectionConfig[activeSection];
    try {
      const res = await axios.get(`${API_BASE}/${cfg.endpoint}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError(`Failed to load ${cfg.title}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setShowLogoutConfirm(true);
    setShowProfileMenu(false);
  }
  function confirmLogout() {
    logout();
    navigate('/adminpanel/login');
  }
  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  function getEmptyForm() {
    const fm = {};
    sectionConfig[activeSection].fields.forEach(f => {
      if (f.type === 'date')        fm[f.key] = dayjs().format('YYYY-MM-DD');
      else if (f.type === 'status') fm[f.key] = f.options[0];
      else if (f.type === 'number') fm[f.key] = 0;
      else                          fm[f.key] = '';
    });
    return fm;
  }

  function handleCreate() {
    setModalType('create');
    setSelectedItem(null);
    setFormData(getEmptyForm());
    setSelectedFiles([]); // Reset file selection
    setShowModal(true);
  }
  function handleEdit(item) {
    setModalType('edit');
    setSelectedItem(item);
    setFormData(item);
    setSelectedFiles([]); // Reset file selection for edit
    setShowModal(true);
  }
  function handleView(item) {
    setModalType('view');
    setSelectedItem(item);
    setFormData(item);
    setSelectedFiles([]);
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure?')) return;
    const cfg = sectionConfig[activeSection];
    try {
      await axios.delete(`${API_BASE}/${cfg.endpoint}/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  // Fixed handleChange function to properly handle multiple files
  function handleChange(e) {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      // Convert FileList to Array and store all selected files
      setSelectedFiles(Array.from(files));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  // Fixed handleSubmit function for multiple files
  async function handleSubmit(e) {
    e.preventDefault();
    const cfg = sectionConfig[activeSection];
    
    try {
      const data = new FormData();
      
      // Append all form fields to FormData
      cfg.fields.forEach(field => {
        if (field.type === 'file') {
          if (selectedFiles && selectedFiles.length > 0) {
            if (field.multiple) {
              // For multiple file upload, append each file
              selectedFiles.forEach(file => {
                data.append(field.key, file);
              });
            } else {
              // For single file upload, append only the first file
              data.append(field.key, selectedFiles[0]);
            }
          }
        } else {
          data.append(field.key, formData[field.key] || '');
        }
      });

      let res;
      if (modalType === 'create') {
        res = await axios.post(`${API_BASE}/${cfg.endpoint}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Create response:", res);
        setItems(prev => [res.data, ...prev]);
      } else {
        res = await axios.put(
          `${API_BASE}/${cfg.endpoint}/${selectedItem.id}`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log("Update response:", res);
        setItems(prev =>
          prev.map(i => i.id === selectedItem.id ? res.data : i)
        );
      }
      setShowModal(false);
      setSelectedFiles([]); // Clear file selection after successful submit
    } catch (err) {
      console.error('Submit error:', err);
      alert('Submit failed: ' + (err.response?.data?.message || err.message));
    } 
  }

  const cfg = sectionConfig[activeSection];

  function renderTable() {
    if (isLoading) return <p className="p-4">Loading {cfg.title}…</p>;
    if (error)    return <p className="p-4 text-red-600">{error}</p>;

    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {cfg.title} Management
          </h3>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {cfg.fields.map(f => (
                  <th
                    key={f.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {cfg.fields.map(f => {
                    const val = item[f.key];
                    if (f.type === 'file') {
                      // Enhanced file display with image name and icon
                      return (
                        <td key={f.key} className="px-6 py-4 whitespace-nowrap text-sm">
                          {val ? (
                            <div className="flex items-center space-x-2">
                              <Image className="w-4 h-4 text-blue-500" />
                              <span 
                                className="text-blue-600 hover:underline cursor-pointer font-medium" 
                                title={`Full path: ${val}`}
                                onClick={() => handleView(item)}
                              >
                                {f.multiple && Array.isArray(val) 
                                  ? `${val.length} files`
                                  : truncateText(getFileName(val), 15)
                                }
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Image className="w-4 h-4 text-gray-300" />
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </td>
                      );
                    }
                    if (f.type === 'status') {
                      const isFirst = f.options && val === f.options[0];
                      return (
                        <td key={f.key} className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            isFirst ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {val}
                          </span>
                        </td>
                      );
                    }
                    if (f.type === 'date') {
                      return (
                        <td key={f.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dayjs(val).format('YYYY-MM-DD')}
                        </td>
                      );
                    }
                    if (f.type === 'number') {
                      return (
                        <td key={f.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {val?.toLocaleString() || '0'}
                        </td>
                      );
                    }
                    // For text fields - truncate long content and add tooltip
                    return (
                      <td key={f.key} className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div 
                          className="truncate cursor-pointer hover:text-blue-600" 
                          title={val}
                          onClick={() => handleView(item)}
                        >
                          {truncateText(val, 40)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleView(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!items.length && (
          <div className="text-center py-12 text-gray-500">
            No {cfg.title.toLowerCase()} found. Click "Add New" to create one.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>}
          <button onClick={() => setSidebarOpen(o => !o)} className="p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">{cfg.title} Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button onClick={() => setShowProfileMenu(m => !m)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.username||'Admin User'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {renderTable()}
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2025 Industrial Solutions. All rights reserved.</p>
            <p> Pet Stream</p>
          </div>
        </footer>
      </div>

      {/* Create/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalType === 'create'
                  ? `Add New ${cfg.title.slice(0,-1)}`
                  : modalType === 'edit'
                  ? `Edit ${cfg.title.slice(0,-1)}`
                  : `${cfg.title.slice(0,-1)} Details`}
              </h3>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                {cfg.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor={f.key}>
                      {f.label} {f.multiple && '(Multiple files allowed)'}
                    </label>

                    {f.type === 'status' ? (
                      <select
                        id={f.key}
                        name={f.key}
                        value={formData[f.key] || ''}
                        onChange={handleChange}
                        disabled={modalType === 'view'}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {f.options.map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : f.key === 'description' || f.key === 'content' ? (
                      <textarea
                        id={f.key}
                        name={f.key}
                        value={formData[f.key] || ''}
                        onChange={handleChange}
                        disabled={modalType === 'view'}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                        placeholder={`Enter ${f.label.toLowerCase()}...`}
                      />
                    ) : f.type === 'file' ? (
                      <div className="space-y-3">
                        <input
                          id={f.key}
                          name={f.key}
                          type="file"
                          onChange={handleChange}
                          disabled={modalType === 'view'}
                          multiple={f.multiple} 
                          accept="image/*"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        
                        {/* Show selected files */}
                        {selectedFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-green-700">
                              Selected Files ({selectedFiles.length}):
                            </p>
                            <div className="max-h-24 overflow-y-auto space-y-1">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                  <Image className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-700 font-medium">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-green-600">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Show current files in edit/view mode */}
                        {modalType !== 'create' && formData[f.key] && selectedFiles.length === 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-700">Current Files:</p>
                            {Array.isArray(formData[f.key]) ? (
                              <div className="max-h-24 overflow-y-auto space-y-1">
                                {formData[f.key].map((filePath, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                    <Image className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-blue-700">
                                      {getFileName(filePath)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                <Image className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">
                                  {getFileName(formData[f.key])}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        id={f.key}
                        name={f.key}
                        type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
                        value={formData[f.key] || ''}
                        onChange={handleChange}
                        disabled={modalType === 'view'}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          f.type !== 'date' && f.type !== 'number' ? `Enter ${f.label.toLowerCase()}...` : ''
                        }
                      />
                    )}
                  </div>
                ))}
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={()=>{setShowModal(false); setSelectedFiles([]);}} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              {modalType!=='view' && (
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> 
                  {modalType==='create'?'Create':'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout? You will be redirected to the login page.
            </p>
            <div className="flex justify-center space-x-3">
              <button onClick={cancelLogout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
