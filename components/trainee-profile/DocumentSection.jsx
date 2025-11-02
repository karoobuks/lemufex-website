'use client';
import { FaFileAlt, FaDownload, FaUpload, FaFolder } from 'react-icons/fa';

export default function DocumentsSection({ documents }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <FaFolder className="text-[#FE9900] text-xl sm:text-2xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#002B5B] truncate">Documents & Certificates</h2>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-[#FE9900] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#F8C400] transition-colors font-medium text-sm sm:text-base w-full sm:w-auto flex-shrink-0">
          <FaUpload className="text-sm" />
          <span className="hidden sm:inline">Upload Document</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FaFileAlt className="text-6xl text-[#A0AEC0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#444] mb-2">No Documents Yet</h3>
          <p className="text-[#555] mb-6">
            Upload your certificates, transcripts, and other important documents here.
          </p>
          <button className="inline-flex items-center justify-center gap-2 bg-[#FE9900] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#F8C400] transition-colors font-medium text-sm sm:text-base">
            <FaUpload />
            <span className="hidden sm:inline">Upload Your First Document</span>
            <span className="sm:hidden">Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-[#F8F9FC] rounded-xl hover:bg-[#F8F9FC]/80 transition-colors">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="bg-[#FE9900]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <FaFileAlt className="text-[#FE9900] text-base sm:text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-[#444] text-sm sm:text-base truncate">{doc.name}</h4>
                  <p className="text-xs sm:text-sm text-[#555]">
                    Uploaded on {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a 
                href={doc.url} 
                download
                className="inline-flex items-center justify-center gap-2 text-[#FE9900] hover:text-[#F8C400] font-medium transition-colors text-sm sm:text-base py-2 px-3 rounded-lg hover:bg-[#FE9900]/10 flex-shrink-0"
              >
                <FaDownload />
                <span className="hidden sm:inline">Download</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Document Guidelines */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#081C3C]/5 border border-[#081C3C]/10 rounded-xl">
        <h4 className="font-medium text-[#002B5B] mb-2 text-sm sm:text-base">Document Guidelines</h4>
        <ul className="text-xs sm:text-sm text-[#555] space-y-1">
          <li>• Accepted formats: PDF, JPG, PNG (Max 5MB each)</li>
          <li>• Ensure documents are clear and readable</li>
          <li>• Keep your certificates and transcripts up to date</li>
        </ul>
      </div>
    </div>
  );
}