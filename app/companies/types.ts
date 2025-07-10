export interface Company {
  id: number
  name: string
  nit: string
  address: string | null
  phone: string | null
}

export interface CompaniesViewProps {
  companies: Company[]
  onDeleteSuccess: () => void
  onDeleteError: (errorMessage: string) => void
}
