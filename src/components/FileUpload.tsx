import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../lib/store';
import toast from 'react-hot-toast';
import { Upload, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';

interface ContactRow {
  Name: string;
  Phone: string;
}

export function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [nameCol, setNameCol] = useState<string>('');
  const [phoneCol, setPhoneCol] = useState<string>('');
  const [previewData, setPreviewData] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'csv') {
      toast.error('Please upload a valid .xlsx or .csv file');
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const json = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (json.length === 0) {
          toast.error('File is empty');
          setFile(null);
          return;
        }

        const extractedHeaders = Object.keys(json[0]);
        setHeaders(extractedHeaders);
        setRawData(json);

        // Auto-guess columns
        const guessedName = extractedHeaders.find(h => h.toLowerCase().includes('name')) || extractedHeaders[0] || '';
        const guessedPhone = extractedHeaders.find(h => h.toLowerCase().includes('phone') || h.toLowerCase().includes('number') || h.toLowerCase().includes('tel')) || (extractedHeaders.length > 1 ? extractedHeaders[1] : extractedHeaders[0]) || '';

        setNameCol(guessedName);
        setPhoneCol(guessedPhone);

      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error('Failed to parse file');
        setFile(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (rawData.length > 0) {
      const mappedData: ContactRow[] = rawData.map(row => ({
        Name: nameCol && row[nameCol] !== undefined ? String(row[nameCol]) : '',
        Phone: phoneCol && row[phoneCol] !== undefined ? String(row[phoneCol]) : ''
      })).filter(row => row.Name || row.Phone);
      
      setPreviewData(mappedData.slice(0, 5));
    }
  }, [rawData, nameCol, phoneCol]);

  const handleUpload = async () => {
    if (!file) return;
    if (!nameCol || !phoneCol) {
      toast.error('Please select both Name and Phone columns');
      return;
    }

    setLoading(true);

    const mappedData = rawData.map((row) => ({
      name: nameCol && row[nameCol] !== undefined ? String(row[nameCol]) : '',
      phone: phoneCol && row[phoneCol] !== undefined ? String(row[phoneCol]) : ''
    })).filter(row => row.name || row.phone);

    if (mappedData.length === 0) {
      toast.error('No valid data found to upload.');
      setLoading(false);
      return;
    }

    let batch;
    try {
      batch = db.batches.add({
        file_name: file.name,
        contact_count: mappedData.length
      });

      const finalData = mappedData.map((row, i) => ({
        ...row,
        batch_id: batch.id,
        row_number: i + 1
      }));

      db.contacts.addBatch(finalData);

      toast.success(`Successfully uploaded ${finalData.length} contacts!`);
      clearFile();
      onUploadSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      if (batch) {
        db.batches.delete(batch.id);
      }
      if (error.name === 'QuotaExceededError' || error.message?.includes('quota')) {
        toast.error('Browser storage limit exceeded. Please upload a smaller file or clear old data.');
      } else {
        toast.error(error.message || 'Failed to upload contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setRawData([]);
    setHeaders([]);
    setNameCol('');
    setPhoneCol('');
    setPreviewData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Upload Contacts</h2>
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:bg-zinc-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .csv" 
            className="hidden" 
          />
          <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-sm font-medium text-zinc-900">Click to upload or drag and drop</p>
          <p className="text-xs text-zinc-500 mt-1">Excel or CSV files only</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Name Column</label>
              <select 
                value={nameCol} 
                onChange={e => setNameCol(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              >
                <option value="">-- Select Column --</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Column</label>
              <select 
                value={phoneCol} 
                onChange={e => setPhoneCol(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              >
                <option value="">-- Select Column --</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          {previewData.length > 0 && (
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Preview (First 5 rows)</p>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 bg-white border-b border-zinc-100">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-zinc-900">{row.Name || '-'}</td>
                      <td className="px-4 py-2 text-zinc-600">{row.Phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !nameCol || !phoneCol}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Uploading...' : (
              <>
                <CheckCircle2 size={18} />
                Confirm & Upload
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

