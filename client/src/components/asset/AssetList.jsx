import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Package, Plus, Search, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AddAssetModal from './AddAssetModal';

const AssetList = () => {
    const { can } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        console.log('DEBUG: AssetList Component Mounted. Version: 1.0.2');
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/assets');
            setAssets(data);
        } catch (err) {
            console.error('Error fetching assets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this asset?')) return;
        try {
            await api.delete(`/assets/${id}`);
            fetchAssets();
        } catch (err) {
            console.error('Error deleting asset:', err);
            alert('Failed to delete asset');
        }
    };

    const handleEdit = (asset) => {
        console.log('DEBUG: Editing asset:', asset);
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        console.log('DEBUG: Adding new asset modal triggered');
        setSelectedAsset(null);
        setIsModalOpen(true);
    };

    const statusColors = {
        available: 'bg-green-100 text-green-700 border-green-200',
        assigned: 'bg-blue-100 text-blue-700 border-blue-200',
        repair: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        retired: 'bg-red-100 text-red-700 border-red-200',
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="text-indigo-600" />
                        Asset Management <span className="text-xs font-normal text-gray-400">v1.0.2-debug</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Track and manage company equipment and hardware.</p>
                </div>

                {can('manage_assets') && (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Add New Asset</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or serial number..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Asset Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Serial Number</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading assets...</td>
                                </tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No assets found.</td>
                                </tr>
                            ) : (
                                filteredAssets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-800">{asset.name}</div>
                                            <div className="text-xs text-gray-400">{asset._id.substring(18)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md uppercase tracking-tight">
                                                {asset.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{asset.serialNumber}</td>
                                        <td className="px-6 py-4">
                                            {asset.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold ring-2 ring-white">
                                                        {asset.assignedTo.name?.charAt(0) || '?'}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{asset.assignedTo.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">---</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusColors[asset.status] || 'bg-gray-100'}`}>
                                                {asset.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {can('manage_assets') && (
                                                    <button
                                                        onClick={() => handleEdit(asset)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                {can('delete_records') && (
                                                    <button
                                                        onClick={() => handleDelete(asset._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddAssetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchAssets}
                asset={selectedAsset}
            />
        </div>
    );
};

export default AssetList;
