import { apiRequest } from "../../../helpers/api";
import { 
    startLoadingCompanies, 
    setCompanies, 
    setCurrentCompany, 
    addCompany, 
    updateCompanyInList, 
    removeCompany, 
    setError 
} from './company-slice';

// Tipos para la empresa y respuestas del API
export interface Company {
    id: number;
    name: string;
    nit: string;
    address: string | null;
    phone: string | null;
}

export interface ApiResponse {
    data: Company[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
}

export interface CompanyFilters {
    search?: string;
    page?: number;
    size?: number;
}

export interface CreateCompanyData {
    name: string;
    nit: string;
    address: string | null;
    phone: string | null;
}

export interface UpdateCompanyData extends CreateCompanyData {
    id: number;
}

// Fetch companies
export const fetchCompanies = (filters: CompanyFilters = {}) => {
    return async (dispatch: any) => {
        try {
            dispatch(startLoadingCompanies());
            
            const { search = '', page = 0, size = 10 } = filters;
            
            const params = new URLSearchParams({
                search: search.toString(),
                page: page.toString(),
                size: size.toString()
            });
            
            const response = await apiRequest(`/companies?${params}`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data: ApiResponse = await response.json();
            dispatch(setCompanies(data));
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Error al cargar las empresas'));
        }
    };
};

// Fetch single company
export const fetchCompanyById = (id: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(startLoadingCompanies());
            
            const response = await apiRequest(`/companies/${id}`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Empresa no encontrada');
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data: Company = await response.json();
            dispatch(setCurrentCompany(data));
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Error al cargar la empresa'));
        }
    };
};

// Create company
export const createCompany = (companyData: CreateCompanyData) => {
    return async (dispatch: any) => {
        try {
            dispatch(startLoadingCompanies());
            
            const response = await apiRequest('/companies', {
                method: 'POST',
                body: JSON.stringify(companyData)
            });
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                } catch (parseError) {
                    throw new Error(errorMessage);
                }
            }
            
            const data: Company = await response.json();
            dispatch(addCompany(data));
            return data;
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Error al crear la empresa'));
            throw error;
        }
    };
};

// Update company
export const updateCompany = (companyData: UpdateCompanyData) => {
    return async (dispatch: any) => {
        try {
            dispatch(startLoadingCompanies());
            
            const { id, ...updateData } = companyData;
            
            const response = await apiRequest(`/companies/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                } catch (parseError) {
                    throw new Error(errorMessage);
                }
            }
            
            const data: Company = await response.json();
            dispatch(updateCompanyInList(data));
            return data;
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Error al actualizar la empresa'));
            throw error;
        }
    };
};

// Delete company
export const deleteCompany = (id: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(startLoadingCompanies());
            
            const response = await apiRequest(`/companies/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                } catch (parseError) {
                    throw new Error(errorMessage);
                }
            }
            
            dispatch(removeCompany(id));
            return id;
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Error al eliminar la empresa'));
            throw error;
        }
    };
};