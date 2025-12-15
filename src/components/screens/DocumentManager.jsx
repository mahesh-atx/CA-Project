// Document Manager Screen with Upload/Download
import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Folder, 
  File, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  X,
  FileText,
  Image,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../ui';
import { 
  saveDocument, 
  getDocumentsByClient, 
  deleteDocument, 
  downloadDocument,
  fileToBase64,
  formatFileSize,
  getFolderStats
} from '../../services/documents';

const FOLDERS = [
  'Permanent File',
  'GST Returns',
  'Income Tax',
  'ROC / MCA',
  'Bank Statements',
  'Deeds & Agreements',
  'Audit Reports',
  'Other'
];

const DocumentManager = () => {
  const { selectedClient } = useApp();
  const [documents, setDocuments] = useState([]);
  const [folderStats, setFolderStats] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFolder, setUploadFolder] = useState(FOLDERS[0]);
  const fileInputRef = useRef(null);

  // Load documents
  useEffect(() => {
    if (selectedClient) {
      loadDocuments();
    }
  }, [selectedClient]);

  const loadDocuments = async () => {
    if (!selectedClient) return;
    const docs = await getDocumentsByClient(selectedClient.id);
    setDocuments(docs);
    const stats = await getFolderStats(selectedClient.id);
    setFolderStats(stats);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of files) {
        const base64 = await fileToBase64(file);
        await saveDocument({
          name: file.name,
          type: file.type,
          size: file.size,
          folder: uploadFolder,
          clientId: selectedClient.id,
          data: base64
        });
      }
      await loadDocuments();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (doc) => {
    await downloadDocument(doc);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this document?')) {
      await deleteDocument(id);
      await loadDocuments();
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <Image className="w-5 h-5 text-pink-500" />;
    if (type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type?.includes('sheet') || type?.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const filteredDocs = selectedFolder 
    ? documents.filter(d => d.folder === selectedFolder)
    : documents;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Document Manager</h2>
          {selectedClient && (
            <p className="text-xs text-slate-500 mt-1">{selectedClient.name}</p>
          )}
        </div>
        <Button icon={UploadCloud} onClick={() => setShowUploadModal(true)} disabled={!selectedClient}>
          Upload Files
        </Button>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to manage their documents.
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Upload Documents</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Select Folder
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm"
                >
                  {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              
              <div 
                className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-600 mb-2">
                  {uploading ? 'Uploading...' : 'Click to select files'}
                </p>
                <p className="text-xs text-slate-400">PDF, Images, Excel, Word files supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.csv"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedClient && (
        <>
          {/* Folders Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FOLDERS.map((folder) => {
              const stats = folderStats[folder] || { count: 0, size: 0 };
              return (
                <Card 
                  key={folder} 
                  className={`p-4 hover:border-black transition-colors cursor-pointer group ${
                    selectedFolder === folder ? 'border-black bg-slate-50' : ''
                  }`}
                  onClick={() => setSelectedFolder(selectedFolder === folder ? null : folder)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Folder className={`w-8 h-8 ${selectedFolder === folder ? 'text-black' : 'text-amber-400'} fill-current opacity-80`} />
                    <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">{folder}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    {stats.count} items • {formatFileSize(stats.size)}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Files List */}
          <Card>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                {selectedFolder ? `${selectedFolder} (${filteredDocs.length})` : `All Documents (${documents.length})`}
              </h3>
              {selectedFolder && (
                <button 
                  onClick={() => setSelectedFolder(null)}
                  className="text-xs text-slate-500 hover:text-black"
                >
                  View All
                </button>
              )}
            </div>
            
            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents yet</p>
                <p className="text-xs mt-1">Click "Upload Files" to add documents</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left w-8"></th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left hidden sm:table-cell">Folder</th>
                    <th className="px-4 py-2 text-right">Size</th>
                    <th className="px-4 py-2 text-right">Date</th>
                    <th className="px-4 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="group hover:bg-slate-50">
                      <td className="px-4 py-3">{getFileIcon(doc.type)}</td>
                      <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-xs">{doc.name}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">{doc.folder}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400 text-xs">{formatFileSize(doc.size)}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400 text-xs">
                        {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100">
                          {doc.type?.includes('image') && (
                            <button 
                              onClick={() => window.open(doc.data, '_blank')}
                              className="p-1 text-slate-400 hover:text-blue-600"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDownload(doc)}
                            className="p-1 text-slate-400 hover:text-emerald-600"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
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
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default DocumentManager;
