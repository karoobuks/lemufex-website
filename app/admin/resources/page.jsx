"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import TypingDots from "@/components/loaders/TypingDots";
import { 
  FiUpload, 
  FiFile, 
  FiTag, 
  FiType, 
  FiFileText,
  FiPlus,
  FiCheck
} from "react-icons/fi";

export default function AdminResourcesPage() {
  const {data:session, status} = useSession()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [track, setTrack] = useState("Automation");
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try{
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("file", file)
      formData.append("track", track)

      const res = await fetch("/api/resources", {
        method: "POST",
        body: formData,
      });

      const data = await res.json()

      if(data.success){
        toast.success("Resource uploaded successfully!");
        setTitle("");
        setDescription("");
        setFile(null);
        setTrack("Automation");
      } else{
        toast.error("Upload failed: " + data.error)
      }
    }catch(error){
      toast.error("Unexpected error while uploading.")
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <TypingDots />
      </div>
    )
  }
  
  if (session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FiUpload className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
        </div>
        <p className="text-gray-600">Upload and manage learning resources for different tracks</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiType size={16} />
                Resource Title
              </label>
              <input
                type="text"
                placeholder="Enter resource title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Track Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiTag size={16} />
                Track Category
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="Automation">Automation</option>
                <option value="Software Programming">Software Programming</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiFileText size={16} />
              Description
            </label>
            <textarea
              placeholder="Provide a detailed description of the resource"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 resize-none placeholder:text-gray-500"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiFile size={16} />
              Upload File (PDF only)
            </label>
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-[#FE9900] bg-orange-50' 
                  : file 
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-[#FE9900] hover:bg-orange-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="space-y-3">
                {file ? (
                  <>
                    <FiCheck className="mx-auto text-green-500" size={48} />
                    <div>
                      <p className="text-lg font-medium text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">File selected successfully</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FiUpload className="mx-auto text-gray-400" size={48} />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Drop your PDF file here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <TypingDots />
              ) : (
                <>
                  <FiPlus size={20} />
                  Add Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
