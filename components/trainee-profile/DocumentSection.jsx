'use client';
import { FaFileAlt, FaDownload, FaUpload, FaFolder } from 'react-icons/fa';

export default function DocumentsSection({ documents }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaFolder className="text-[#FE9900] text-2xl" />
          <h2 className="text-2xl font-bold text-[#002B5B]">Documents & Certificates</h2>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#FE9900] text-white px-4 py-2 rounded-lg hover:bg-[#F8C400] transition-colors font-medium">
          <FaUpload className="text-sm" />
          Upload Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FaFileAlt className="text-6xl text-[#A0AEC0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#444] mb-2">No Documents Yet</h3>
          <p className="text-[#555] mb-6">
            Upload your certificates, transcripts, and other important documents here.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#FE9900] text-white px-6 py-3 rounded-lg hover:bg-[#F8C400] transition-colors font-medium">
            <FaUpload />
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#F8F9FC] rounded-xl hover:bg-[#F8F9FC]/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-[#FE9900]/10 p-3 rounded-lg">
                  <FaFileAlt className="text-[#FE9900] text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-[#444]">{doc.name}</h4>
                  <p className="text-sm text-[#555]">
                    Uploaded on {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a 
                href={doc.url} 
                download
                className="inline-flex items-center gap-2 text-[#FE9900] hover:text-[#F8C400] font-medium transition-colors"
              >
                <FaDownload />
                Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Document Guidelines */}
      <div className="mt-6 p-4 bg-[#081C3C]/5 border border-[#081C3C]/10 rounded-xl">
        <h4 className="font-medium text-[#002B5B] mb-2">Document Guidelines</h4>
        <ul className="text-sm text-[#555] space-y-1">
          <li>• Accepted formats: PDF, JPG, PNG (Max 5MB each)</li>
          <li>• Ensure documents are clear and readable</li>
          <li>• Keep your certificates and transcripts up to date</li>
        </ul>
      </div>
    </div>
  );
}