export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString()

export const formatDate = (iso: string) => 
  new Date(iso).toLocaleDateString()
