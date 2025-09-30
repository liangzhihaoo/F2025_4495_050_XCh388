import { useMemo, useState } from 'react'

export default function Uploads() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const files = useMemo(
    () => [
      { name: 'brand-guide.pdf', type: 'PDF', size: '2.1 MB', by: 'Alex Chen', date: '2025-09-20' },
      { name: 'hero.jpg', type: 'Image', size: '840 KB', by: 'Jamie Lee', date: '2025-09-22' },
      { name: 'data-export.csv', type: 'CSV', size: '4.7 MB', by: 'Taylor Ray', date: '2025-09-23' },
      { name: 'contract.docx', type: 'Doc', size: '312 KB', by: 'Sam Patel', date: '2025-09-24' },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Uploads</h1>
        <p className="text-sm text-gray-600">Manage and review all uploaded files here.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Recent files</div>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => setOpen(true)}
        >
          Upload New File
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="h-8 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-8 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm">
              <thead className="text-left text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f, i) => (
                  <tr key={f.name} className={i % 2 === 1 ? 'odd:bg-gray-50' : ''}>
                    <td className="px-4 py-3 text-gray-900">{f.name}</td>
                    <td className="px-4 py-3 text-gray-700">{f.type}</td>
                    <td className="px-4 py-3 text-gray-700">{f.size}</td>
                    <td className="px-4 py-3 text-gray-700">{f.by}</td>
                    <td className="px-4 py-3 text-gray-700">{f.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">View</button>
                        <button className="px-2 py-1 rounded border border-gray-300 text-red-600 hover:bg-gray-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
              <div className="border-b px-4 py-3 text-sm font-medium">Upload New File</div>
              <div className="p-4 space-y-3">
                <label className="block text-sm text-gray-700">Choose file</label>
                <input type="file" className="block w-full text-sm" />
                <div className="h-28 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500">
                  Drag & drop a file here
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <button className="px-3 py-2 text-sm rounded border border-gray-300" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => setOpen(false)}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


